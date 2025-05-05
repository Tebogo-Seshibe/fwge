import { CalcuateDelay, Vector2, createContext, type IDelay } from "@fwge/common";
import { Class, Component, ComponentId, Entity, EntityId, ListContainer, System, Type, TypeId } from "@fwge/ecs";
import { Asset } from "./Asset";
import { Scene, type SceneId } from "./Scene";
import { Shader } from "./shader/Shader";
import { RenderWindow } from "./render";

export type Head<T extends any[]> = T extends [infer U, ...infer _]
    ? U
    : never;

export type Tail<T extends any[]> = T extends [infer _, ...infer U]
    ? U
    : never;

export type Args<T> = T extends new (...args: any[]) => Component | System | Scene | Asset
    ? Head<ConstructorParameters<T>> extends Game
        ? [T, ...Tail<ConstructorParameters<T>>]
        : [T, ...ConstructorParameters<T>]
    : never;

export interface LibraryEntry<T>
{
    name: string;
    create: () => T;
}

export interface GameConfig
{
    debug?: boolean;
    protocol?: string;
    canvas?: HTMLCanvasElement | (() => HTMLCanvasElement);
    height: number;
    width: number;
}

export abstract class Game
{
    abstract UseAssets: Type<Asset>[];
    abstract UseScenes: Type<Scene>[];

    //#region Private Fields
    private readonly _dimensions: Vector2 = new Vector2();
    private _currentScene: Scene | undefined = undefined;
    private _currTick: number = -1;
    private _prevTick: number = -1;
    private _tickId: number | undefined = undefined;
    private _delayId: number | undefined = undefined;
    private _running: boolean = false;
    private _debug: boolean = false;
    private _canvas: HTMLCanvasElement;
    private _gl!: WebGL2RenderingContext;
    private _protocol?: (...args: any[]) => Promise<Blob>;
    //#endregion

    public get Height(): number
    {
        return this._dimensions[1];
    }

    public set Height(height: number)
    {
        this._dimensions[1] = height;
        this._canvas.height = height;
    }

    public get Width(): number
    {
        return this._dimensions[0];
    }

    public set Width(width: number)
    {
        this._dimensions[0] = width;
        this._canvas.width = width;
    }  

    public get Canvas(): HTMLCanvasElement
    {
        return this._canvas;
    }

    public get GL(): WebGL2RenderingContext
    {
        return this._gl;
    }

    public get CurrentScene(): Scene | undefined
    {
        return this._currentScene;
    }

    public get Scenes(): readonly Scene[]
    {
        return this.scenes;
    }

    constructor()
    constructor(config: GameConfig)
    constructor(config?: GameConfig) {
        config = {
            debug: config?.debug ?? false,
            canvas: typeof config?.canvas === 'function'
                ? config.canvas()
                : config?.canvas instanceof HTMLCanvasElement 
                    ? config.canvas
                    : document.createElement('canvas'),
            height: config?.height ?? 1080,
            width: config?.width ?? 1920
        }
        
        this._canvas = config.canvas as HTMLCanvasElement;
        this._dimensions[0] = config.width;
        this._dimensions[1] = config.height;
        this._debug = config.debug as boolean;
        
        this.Reset()
        this.ResetContext(this._debug);
    }

    public Reset(): void
    {
        Shader.CurrentBlockIndex = 0;
        Scene.SceneId = 0;
    }
    
    public ResetContext(debug: boolean = false): void
    {
        this._gl = createContext(this._canvas, debug);
    }

    async Init(): Promise<void>
    {
        // const assets = [];
        // for (const asset of this.UseAssets)
        // {
        //     this.RegisterAsset(asset, new asset());
        //     assets.push(this.LoadAsset(asset));
        // }
        // await Promise.all(assets);
        // await RenderWindow.Init();

        for (const scene of this.UseScenes)
        {
            this.AddScene(new scene(this));
        }
    }

    public Protocol(protocol: (...args: any[]) => Promise<Blob>): void
    {
        this._protocol = protocol;
    }

    public Start(): void;
    public Start(delay: IDelay): void;
    public Start(delay: IDelay = {}): void
    {
        window.setTimeout(() => this._start(), CalcuateDelay(delay));
    }

    public Stop(): void;
    public Stop(delay: IDelay): void;
    public Stop(delay: IDelay = {}): void
    {
        window.setTimeout(() => this._stop(), CalcuateDelay(delay));
    }

    public Exit(): void
    {
        for (let i = 0; i < this.scenes.length; ++i)
        {
            this.scenes[i]?.Destroy();
        }
        this.scenes.empty();
    }

    //#region Private Methods
    private _start(): void
    {
        if (this._running)
        {
            return;
        }
        else
        {
            this._running = true;
        }

        this._prevTick = Date.now();
        this._currTick = Date.now();
        this._currentScene?.Start();

        this._tickId = window.requestAnimationFrame(this._update.bind(this));
    }

    private _update(): void
    {
        const delta = (this._currTick - this._prevTick) / 1000;
        
        this._currentScene?.Update(delta);
        this._prevTick = this._currTick;
        this._currTick = Date.now();

        this._tickId = window.requestAnimationFrame(this._update.bind(this));
    }

    private _stop(): void
    {
        this._running = false;

        if (this._delayId !== undefined)
        {
            window.clearTimeout(this._delayId);
        }

        if (this._tickId !== undefined)
        {
            window.cancelAnimationFrame(this._tickId);
        }

        this._currentScene?.Stop();
        this._tickId = undefined;
    }
    //#endregion

    //#region Configurations
    private _assetsConfigruations: Map<string, Asset> = new Map();
    private _componentConfigruations: Map<string, Component> = new Map();
    private _systemConfigruations: Map<string, System> = new Map();
    private _sceneConfigruations: Map<string, Scene> = new Map();

    public ConfigureAsset<T extends Asset, U extends new (...args: any[]) => T>(type: U, ...args: ConstructorParameters<U>): Game
    {
        this._assetsConfigruations.set(type.name, new type(...args));
        return this;
    }
    public ConfigureComponent<T extends Component, U extends new (...args: any[]) => T>(type: Class<T>, ...args: ConstructorParameters<U>): Game
    {
        this._componentConfigruations.set(type.name, new type(...args));
        return this;
    }
    public ConfigureSystem<T extends System, U extends new (...args: any[]) => T>(type: Class<T>, ...args: ConstructorParameters<U>): Game
    {
        this._systemConfigruations.set(type.name, new type(...args));
        return this;
    }
    public ConfigureScene<T extends Scene, U extends new (...args: any[]) => T>(type: Class<T>, ...args: ConstructorParameters<U>): Game
    {
        this._sceneConfigruations.set(type.name, new type(...args));
        return this;
    }
    //#endregion
    
    //#region Entity Management
    
    //#region Properties
    private readonly entityGraph: (EntityEntry | undefined)[] = [];
    private readonly componentTypes: Class<Component>[] = [];
    private readonly componentListContainers: ListContainer<Component>[] = [];
    private readonly entityComponentList: ListContainer<(Component | undefined)[]> = new ListContainer<(Component | undefined)[]>();

    private readonly views: ListContainer<View> = new ListContainer<View>();
    private readonly viewConfig: ViewConfig[] = [];
    private readonly mappedViews: number[][] = [];

    public readonly ExistFilter: ViewFilter<[Component]> = () => true;
    //#endregion

    //#region Entity
    public CreateEntity<T extends Entity = Entity>(entity: T): EntityId
    {
        const entityId = this.entityComponentList.Add([]);

        this.entityGraph[entityId] = {
            entity: entity,
            children: [],
            parent: -1,
        };

        return entityId;
    }

    public GetEntity<T extends Entity = Entity>(entityId: EntityId): T | undefined
    {
        return this.entityGraph[entityId]?.entity as T;
    }

    public GetEntities<T extends Entity = Entity>(entityType: Class<T>): readonly T[]
    {
        const entities: T[] = [];

        for (let i = 0; i < this.entityGraph.length; ++i)
        {
            if (this.entityGraph[i]?.entity instanceof entityType)
            {
                entities.push(this.entityGraph[i]!.entity as T);
            }
        }
        
        return entities;

    }

    public IsEntityActive(entityId: EntityId): boolean
    {
        return this.GetEntity(entityId)?.Active ?? false;
    }

    public AddChild(parentId: EntityId, childId: EntityId): void
    {
        const parent = this.entityGraph[parentId];
        const child = this.entityGraph[childId];

        if (!parent || !child)
        {
            return;
        }

        if (!parent.children.includes(childId))
        {
            parent.children.push(childId)
        }

        child.parent = parentId;
    }
    
    public GetChild(parentId: EntityId, childId: EntityId): Entity
    {
        const childrenList = this.entityGraph[parentId]?.children ?? [];

        return this.entityGraph[childrenList[childId]]!.entity!;
    }
    
    public GetParent(childId: EntityId): Entity | undefined
    {
        return this.entityGraph[this.entityGraph[childId]!.parent]!.entity;
    }
    
    public GetParentId(childId: EntityId): EntityId
    {
        return this.entityGraph[childId]?.parent ?? -1;
    }
    
    public GetChildren(entityId: EntityId): readonly Entity[]
    {
        const children: Entity[] = [];
        const childrenList = this.entityGraph[entityId]?.children ?? [];

        for (let i = 0; i < childrenList.length; ++i)
        {
            children.push(this.entityGraph[childrenList[i]]!.entity!);
        }
        
        return children;
    }

    public GetChildrenIds(entityId: EntityId): readonly EntityId[]
    {
        const children: EntityId[] = [];
        const childrenList = this.entityGraph[entityId]?.children ?? [];

        for (let i = 0; i < childrenList.length; ++i)
        {
            children.push(childrenList[i]);
        }
        
        return children;
    }

    public RemoveChild(parentId: EntityId, childId: EntityId): void
    {
        const parent = this.entityGraph[parentId];
        const child = this.entityGraph[childId];

        if (parent)
        {   
            const childIndex = parent.children.indexOf(childId);
            
            if (childIndex !== -1)
            {
                parent.children[childIndex] = parent.children[parent.children.length - 1];
                parent.children.pop();
            }
        }

        if (child)
        {
            child.parent = -1;
        }
    }

    public DestroyEntity(entityId: EntityId): void
    {
        const entity = this.entityGraph[entityId];
        this.entityGraph[entityId] = undefined;

        if (!entity)
        {
            return;
        }

        for (let i = 0; i < entity.children.length; ++i)
        {
            const child = this.entityGraph[entity.children[i]];

            if (child)
            {
                child.parent = -1;
            }
        }
    }
    //#endregion

    //#region Component
    public CreateComponent(componentTypeId: TypeId, component: Component): ComponentId
    {
        return this.componentListContainers[componentTypeId].Add(component);
    }

    public AddComponent(entityId: EntityId, component: Component): void
    {
        const entityList = this.entityComponentList.Get(entityId);
        
        if (!entityList)
        {
            throw new Error('Attempted to add component to invalid entity id');
        }
        
        entityList[component.TypeId] = component;
        
        const possibleViews = this.mappedViews[component.TypeId] ?? [];
        for (let i = 0; i < possibleViews.length; ++i)
        {
            const view = this.views.Get(possibleViews[i])!;
            const config = this.viewConfig[possibleViews[i]];
            
            if (view.includes(entityId))
            {
                continue;
            }

            if (this.testValidViewEntity(entityId, config.componentTypes, config.filter))
            {
                view.push(entityId);
            }
        }
        this.mappedViews[component.TypeId] = possibleViews;
    }

    public GetComponent<T extends Component = Component>(entityId: EntityId, componentTypeId: TypeId): T | undefined
    public GetComponent<T extends Component = Component>(entityId: EntityId, componentType: Class<T>): T | undefined
    public GetComponent<T extends Component = Component>(entityId: EntityId, componentTypeOrId: TypeId | Class<T>): T | undefined
    {
        const typeId = typeof componentTypeOrId === 'number'
            ? componentTypeOrId
            : componentTypeOrId.TypeId
        const entityList = this.entityComponentList.Get(entityId);

        if (entityList)
        {
            return entityList[typeId] as T;
        }

        return undefined;

    }

    public HasComponent(entityId: EntityId, componentTypeId: TypeId): boolean
    {
        const entityList = this.entityComponentList.Get(entityId);

        if (entityList)
        {
            return entityList[componentTypeId] !== undefined;
        }

        return false;

    }

    public RemoveComponent(entityId: EntityId, componentTypeId: TypeId): void
    {
        const entityList = this.entityComponentList.Get(entityId);
        
        if (entityList)
        {
            entityList[componentTypeId] = undefined;
        }

        const possibleViews = this.mappedViews[componentTypeId] ?? [];
        for (let i = 0; i < possibleViews.length; ++i)
        {
            const view = this.views.Get(possibleViews[i])!;
            const index = view.indexOf(entityId);

            if (index === -1)
            {
                continue;
            }

            view[index] = view[view.length - 1];
            view.pop();
        }
        this.mappedViews[componentTypeId] = possibleViews;
    }
    //#endregion

    //#region Component Type
    public RegisterComponentType(componentType: Class<Component>): void
    {
        (componentType as any).TypeId = this.componentTypes.length;
        this.componentListContainers[componentType.TypeId] = new ListContainer(1);
        this.componentTypes.push(componentType);
    }

    public GetRegisteredComponentType(componentTypeId: TypeId): Class<Component>
    {
        return this.componentTypes[componentTypeId];
    }

    public GetRegisteredComponentTypes(): readonly Class<Component>[]
    {
        return this.componentTypes;
    }

    public GetComponentTypeId(componentType: Class<Component>): TypeId
    {
        for (let i = 0; i < this.componentTypes.length; ++i)
        {
            if (this.componentTypes[i].name === componentType.name)
            {
                return this.componentTypes[i].TypeId;   
            }
        }

        return -1;
    }
    //#endregion

    //#region View
    public RegisterView<T1 extends Component>(componentTypes: readonly [Class<T1>]): ViewKey
    public RegisterView<T1 extends Component>(componentTypes: readonly [Class<T1>], filter: ViewFilter<[T1]>): ViewKey
    public RegisterView<T1 extends Component, T2 extends Component>(componentTypes: readonly [Class<T1>, Class<T2>]): ViewKey
    public RegisterView<T1 extends Component, T2 extends Component>(componentTypes: readonly [Class<T1>, Class<T2>], filter: ViewFilter<[T1, T2]>): ViewKey
    public RegisterView<T1 extends Component, T2 extends Component, T3 extends Component>(componentTypes: readonly [Class<T1>, Class<T2>, Class<T3>]): ViewKey
    public RegisterView<T1 extends Component, T2 extends Component, T3 extends Component>(componentTypes: readonly [Class<T1>, Class<T2>, Class<T3>], filter: ViewFilter<[T1, T2, T3]>): ViewKey
    public RegisterView<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component>(componentTypes: readonly [Class<T1>, Class<T2>, Class<T3>, Class<T4>]): ViewKey
    public RegisterView<T1 extends Component, T2 extends Component, T3 extends Component, T4 extends Component>(componentTypes: readonly [Class<T1>, Class<T2>, Class<T3>, Class<T4>], filter: ViewFilter<[T1, T2, T3, T4]>): ViewKey
    public RegisterView<T extends Component[]>(componentTypes: readonly Class<T[number]>[], filter: ViewFilter<T[number][]> = () => true): ViewKey
    {
        const entityIds: View = [];
        const currentEntityIds: View = [];
        const entities = this.entityComponentList.Items;

        for (let i = 0; i < entities.length; ++i)
        {
            if (entities[i] !== undefined)
            {
                currentEntityIds.push(i);
            }
        }

        for (let i = 0; i < currentEntityIds.length; ++i)
        {
            if (this.testValidViewEntity(currentEntityIds[i], componentTypes, filter))
            {
                entityIds.push(currentEntityIds[i]);
            }
        }
        
        const key = this.views.Add(entityIds);
        this.viewConfig[key] = { componentTypes, filter };

        for (const componentType of componentTypes)
        {
            if (componentType.TypeId === undefined)
            {
                this.RegisterComponentType(componentType);
            }
            
            if (!this.mappedViews[componentType.TypeId])
            {
                this.mappedViews[componentType.TypeId] = [];
            }
            this.mappedViews[componentType.TypeId].push(key);
        }

        return key;
    }

    public GetView(key: ViewKey): readonly EntityId[]
    {
        return this.views.Get(key) ?? [];
    }
    
    public GetViewIterator<E extends Entity, T1 extends Component>(key: ViewKey, componentTypes: readonly [Class<T1>]): ViewIterator<E, [T1]>
    public GetViewIterator<E extends Entity, T1 extends Component, T2 extends Component>(key: ViewKey, componentTypes: readonly [Class<T1>, Class<T2>]): ViewIterator<E, [T1, T2]>
    public GetViewIterator<E extends Entity, T1 extends Component, T2 extends Component, T3 extends Component>(key: ViewKey, componentTypes: readonly [Class<T1>, Class<T2>, Class<T3>]): ViewIterator<E, [T1, T2, T3]>
    public GetViewIterator<E extends Entity, T extends Component[]>(key: ViewKey, componentTypes: readonly Class<T[number]>[]): ViewIterator<E, T>
    {
        const elements: [Entity, ...Component[]] = new Array(componentTypes.length + 1) as [E, ...T];
        const view = this.GetView(key);
        let index = 0;
        const entityManager = this;
        
        return {
            [Symbol.iterator]: function() {
                
                return {
                    next: (): ViewIteratorValue<E, T> => {
                        if (index >= view.length)
                        {
                            return { done: true, value: undefined };
                        }

                        elements[0] = entityManager.GetEntity<E>(view[index])!;
                        for (let i = 0; i < componentTypes.length; ++i)
                        {
                            elements[i + 1] = entityManager.GetComponent(view[index], componentTypes[i].TypeId)!;
                        }

                        index++;
                        return { done: false, value: elements as [E, ...T] };
                    }
                }
            }
        }
    }
    //#endregion

    //#region Group
    public RegisterGroup<T1 extends Component, T2 extends Component>(
        components: readonly [Class<T1>, Class<T2>]
    ): ViewKey
    public RegisterGroup<T1 extends Component, T2 extends Component>(
        components: readonly [Class<T1>, Class<T2>],
        filter1: ViewFilter<[T1]>,
        filter2: ViewFilter<[T2]>
    ): ViewKey
    
    public RegisterGroup<T1 extends Component, T2 extends Component, T3 extends Component>(
        components: readonly [Class<T1>, Class<T2>, Class<T3>]
    ): ViewKey
    public RegisterGroup<T1 extends Component, T2 extends Component, T3 extends Component>(
        components: readonly [Class<T1>, Class<T2>, Class<T3>],
        filter1: ViewFilter<[T1]>,
        filter2: ViewFilter<[T2]>,
        filter3: ViewFilter<[T3]>
    ): ViewKey

    public RegisterGroup<T extends Component[]>(...args:any[]): ViewKey
    {        
        const key = this.views.Add([]);

        return key;
    }    
    //#endregion

    //#region Utils
    private testValidViewEntity(entityId: EntityId, componentTypes: readonly Class<Component>[], filter: ViewFilter): boolean
    {
        const components: Component[] = [];

        for (let i = 0; i < componentTypes.length; ++i)
        {
            if (!this.HasComponent(entityId, componentTypes[i].TypeId!))
            {
                return false
            }
            
            components.push(this.GetComponent(entityId, componentTypes[i].TypeId!)!);
        }

        return filter.apply(undefined, [this.GetEntity(entityId), ...components]);
    }
    //#endregion
   
    //#endregion

    //#region Scene Management
    private readonly scenes: Scene[] = [];
    
    public AddScene(scene: Scene): Game
    {
        this.scenes[scene.Id] = scene;

        return this;
    }

    public GetScene<T extends Scene = Scene>(sceneId: SceneId): T | undefined
    {
        return this.scenes[sceneId] as T;
    }

    public SetScene(sceneId: SceneId): Game
    {
        const newScene = this.scenes[sceneId];
        
        if (newScene && this._currentScene?.Id !== newScene.Id)
        {
            this._currentScene = newScene;
            newScene.Init();
        }

        return this;
    }

    public RemoveScene(sceneId: SceneId): Game
    {
        this.scenes[sceneId].Stop();
        delete this.scenes[sceneId];

        return this;
    }
    //#endregion

    //#region Asset Management
    private readonly assets: Map<string, Asset> = new Map();
    
    public RegisterAsset<T extends Asset>(assetType: Type<T>, asset: T): Game
    {
        if (this.assets.has(assetType.name))
        {
            throw new AssetNameExists(assetType.name);
        }

        this.assets.set(assetType.name, asset);

        return this;
    }

    
    // public async LoadAsset<T extends Asset>(assetType: Type<T>): Promise<boolean>
    // {
    //     const asset = this.assets.get(assetType.name);

    //     if (!asset)
    //     {
    //         return false;
    //     }

    //     await asset.Load(this, this._protocol);
    //     return true;
    // }

    // public GetAsset<T extends Asset>(assetType: Type<T>): T | undefined
    // {
    //     return this.assets.get(assetType.name) as T;
    // }

    // public UnloadAsset<T extends Asset>(assetType: Type<T>): void
    // {
    //     const asset = this.assets.get(assetType.name);

    //     if (asset)
    //     {
    //         asset.Unload(this);
    //     }
    // }

    // public DestroyAsset<T extends Asset>(assetType: Type<T>): void
    // {
    //     const asset = this.assets.get(assetType.name);

    //     if (asset)
    //     {
    //         asset.Destroy(this);
    //         this.assets.delete(assetType.name);
    //     }
    // }
    //#endregion

    // public GetPrefab<T extends Prefab = Prefab>(prefabType: Type<T>, name: string): T| undefined
    // {
    //     return this._prefabs[prefabType.name][name] as T;
    // }
}

export type EntityEntry =
{
    entity: Entity;
    parent: EntityId;
    children: EntityId[];
}

export class AssetNameExists extends Error
{
    constructor(name: string)
    {
        super(`Asset with name "${name}" has already been registered`);
    }
}

export type View = EntityId[];
export type ViewKey = number;
export type ViewFilter<T extends readonly any[] = readonly any[]> = (enity: Entity, ...args: T) => boolean;
export type ViewConfig =
{ 
    componentTypes: readonly Class<Component>[],
    filter: ViewFilter 
};
export type ViewIteratorValue<E extends Entity, T extends Component[]> = 
{
    done: false,
    value: readonly [E, ...T]
} | {
    done: true,
    value: undefined
};
export type ViewIterator<E extends Entity, T extends Component[]> = 
{
    [Symbol.iterator]():
    {
        next(): ViewIteratorValue<E, T>
    }
};
