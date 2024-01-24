import { type Component, type ComponentId, type TypeId } from "./Component";
import { type EntityId } from "./Entity";
import { ListContainer } from "./ListContainer";
import { type Class } from "./types";

export type View = EntityId[];
export type ViewKey = string | symbol | number;
export type ViewFilter<T extends any[] = any[]> = (...args: T) => boolean;
export type ViewConfig = { componentTypes: Class<Component>[], rules: ViewFilter[] };

export class Registry
{
    private static readonly _componentTypes: Class<Component>[] = [];
    private static readonly _componentListContainers: ListContainer<Component>[] = [];
    private static readonly _entityComponentList: ListContainer<(Component | undefined)[]> = new ListContainer<(Component | undefined)[]>(1);

    private static readonly _views: Map<ViewKey, View> = new Map<ViewKey, View>();
    private static readonly _viewConfig: Map<ViewKey, ViewConfig> = new Map<ViewKey, ViewConfig>();
    private static readonly _mappedViews: Map<ComponentId, ViewKey[]> = new Map<ComponentId, ViewKey[]>();

    //#region Entity
    public static CreateEntity(): EntityId
    {
        return this._entityComponentList.Add([]);
    }

    public static DestroyEntity(entityId: EntityId): void
    {
        this._entityComponentList.Remove(entityId);
    }
    //#endregion

    //#region Component
    public static CreateComponent(componentTypeId: TypeId, component: Component): ComponentId
    {
        return this._componentListContainers[componentTypeId].Add(component);
    }

    public static AddComponent(entityId: EntityId, component: Component): void
    {
        const entityList = this._entityComponentList.Get(entityId);

        if (!entityList)
        {
            throw new Error('Attempted to add component to invalid entity id');
        }

        entityList[component.TypeId] = component;

        const possibleViews = this._mappedViews.get(component.TypeId) ?? [];
        for (let i = 0; i < possibleViews.length; ++i)
        {
            const view = this._views.get(possibleViews[i])!;
            const config = this._viewConfig.get(possibleViews[i])!;
            
            if (view.includes(entityId))
            {
                continue;
            }

            if (this.testValidViewEntity(entityId, config.componentTypes, config.rules))
            {
                view.push(entityId)
            }
        }
    }

    public static GetComponent<T extends Component = Component>(entityId: EntityId, componentTypeId: TypeId): T | undefined
    public static GetComponent<T extends Component = Component>(entityId: EntityId, componentType: Class<T>): T | undefined
    public static GetComponent<T extends Component = Component>(entityId: EntityId, componentTypeOrId: TypeId | Class<T>): T | undefined
    {
        const typeId = typeof componentTypeOrId === 'number'
            ? componentTypeOrId
            : componentTypeOrId.TypeId
        const entityList = this._entityComponentList.Get(entityId);

        if (entityList)
        {
            return entityList[typeId] as T;
        }

        return undefined;

    }

    public static HasComponent(entityId: EntityId, componentTypeId: TypeId): boolean
    {
        const entityList = this._entityComponentList.Get(entityId);

        if (entityList)
        {
            return entityList[componentTypeId] !== undefined;
        }

        return false;

    }

    public static RemoveComponent(entityId: EntityId, componentTypeId: TypeId): void
    {
        const entityList = this._entityComponentList.Get(entityId);
        
        if (entityList)
        {
            entityList[componentTypeId] = undefined;
        }

        const possibleViews = this._mappedViews.get(componentTypeId) ?? [];
        for (let i = 0; i < possibleViews.length; ++i)
        {
            const view = this._views.get(possibleViews[i])!;
            const index = view.indexOf(entityId);

            if (index === -1)
            {
                continue;
            }

            view[index] = view[view.length - 1];
            view.pop();
        }
    }
    //#endregion

    //#region Component Type
    public static RegisterComponentType(componentType: Class<Component>): void
    {
        componentType.TypeId = this._componentTypes.length;
        this._componentListContainers[componentType.TypeId] = new ListContainer(1);
        this._componentTypes.push(componentType);
    }

    public static GetRegisteredComponentType(componentTypeId: TypeId): Class<Component>
    {
        return this._componentTypes[componentTypeId];
    }

    public static GetRegisteredComponentTypes(): Class<Component>[]
    {
        return this._componentTypes;
    }
    //#endregion

    //#region View    
    public static RegisterView<T1 extends Component>(key: ViewKey, componentTypes: [Class<T1>]): void
    public static RegisterView<T1 extends Component>(key: ViewKey, componentTypes: [Class<T1>], rules: ViewFilter<[T1]>[]): void
    public static RegisterView<T1 extends Component, T2 extends Component>(key: ViewKey, componentTypes: [Class<T1>, Class<T2>]): void
    public static RegisterView<T1 extends Component, T2 extends Component>(key: ViewKey, componentTypes: [Class<T1>, Class<T2>], rules: ViewFilter<[T1, T2]>[]): void
    public static RegisterView<T1 extends Component, T2 extends Component, T3 extends Component>(key: ViewKey, componentTypes: [Class<T1>, Class<T2>, Class<T3>]): void
    public static RegisterView<T1 extends Component, T2 extends Component, T3 extends Component>(key: ViewKey, componentTypes: [Class<T1>, Class<T2>, Class<T3>], rules: ViewFilter<[T1, T2, T3]>[]): void
    public static RegisterView<T extends Component[]>(key: ViewKey, componentTypes: Class<T[number]>[], rules: ViewFilter<T[number][]>[] = []): void
    {
        const entityIds: View = [];
        for (const componentType of componentTypes)
        {
            if (!this._mappedViews.has(componentType.TypeId))
            {
                this._mappedViews.set(componentType.TypeId, []);
            }
            this._mappedViews.get(componentType.TypeId)!.push(key);
        }

        const currentEntityIds: View = [];
        const entities = this._entityComponentList.All();
        for (let i = 0; i < entities.length; ++i)
        {
            if (entities[i] !== undefined)
            {
                currentEntityIds.push(i);
            }
        }

        for (let i = 0; i < currentEntityIds.length; ++i)
        {
            if (this.testValidViewEntity(currentEntityIds[i], componentTypes, rules))
            {
                entityIds.push(currentEntityIds[i]);
            }
        }
        
        this._views.set(key, entityIds);
        this._viewConfig.set(key, { componentTypes, rules })
    }

    public static GetView(key: ViewKey): View
    {
        return this._views.get(key) ?? [];
    }
    //#endregion

    //#region Utils
    private static testValidViewEntity(entityId: EntityId, componentTypes: Class<Component>[], rules: ViewFilter[]): boolean
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

        for (let i = 0; i < rules.length; ++i)
        {
            if (!rules[i](...components))
            {
                return false;
            }
        }

        return true;
    }
    //#endregion
}
