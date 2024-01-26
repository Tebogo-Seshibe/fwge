import { type Component, type ComponentId, type TypeId } from "./Component";
import { type Entity, type EntityId } from "./Entity";
import { ListContainer } from "./ListContainer";
import { type Class } from "./types";

export type View = EntityId[];
export type ViewKey = number;
export type ViewFilter<T extends readonly any[] = readonly any[]> = (...args: T) => boolean;
export type ViewConfig = { componentTypes: readonly Class<Component>[], filter: ViewFilter };

export type EntityEntry =
{
    entity: Entity;
    parent: EntityId;
    children: EntityId[];
}

export class Registry
{
    //#region Properties
    private static readonly _entityGraph: (EntityEntry | undefined)[] = [];
    private static readonly _componentTypes: Class<Component>[] = [];
    private static readonly _componentListContainers: ListContainer<Component>[] = [];
    private static readonly _entityComponentList: ListContainer<(Component | undefined)[]> = new ListContainer<(Component | undefined)[]>(1);

    private static readonly _views: ListContainer<View> = new ListContainer<View>();
    private static readonly _viewConfig: ViewConfig[] = [];
    private static readonly _mappedViews: number[][] = [];
    //#endregion

    //#region Entity
    public static CreateEntity<T extends Entity = Entity>(entity: T): EntityId
    {
        const entityId = this._entityComponentList.Add([]);

        this._entityGraph[entityId] = {
            entity: entity,
            children: [],
            parent: -1,
        };

        return entityId;
    }

    public static GetEntity<T extends Entity = Entity>(entityId: EntityId): T | undefined
    {
        return this._entityGraph[entityId]?.entity as T;
    }

    public static AddChild(parentId: EntityId, childId: EntityId): void
    {
        const parent = this._entityGraph[parentId];
        const child = this._entityGraph[childId];

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
    
    public static GetChild(parentId: EntityId, childId: EntityId): Entity
    {
        const childrenList = this._entityGraph[parentId]?.children ?? [];

        return this._entityGraph[childrenList[childId]]!.entity!;
    }
    
    public static GetChildren(entityId: EntityId): readonly Entity[]
    {
        const children: Entity[] = [];
        const childrenList = this._entityGraph[entityId]?.children ?? [];

        for (let i = 0; i < childrenList.length; ++i)
        {
            children.push(this._entityGraph[childrenList[i]]!.entity!);
        }
        
        return children;
    }

    public static GetChildrenIds(entityId: EntityId): readonly EntityId[]
    {
        const children: EntityId[] = [];
        const childrenList = this._entityGraph[entityId]?.children ?? [];

        for (let i = 0; i < childrenList.length; ++i)
        {
            children.push(childrenList[i]);
        }
        
        return children;
    }

    public static RemoveChild(parentId: EntityId, childId: EntityId): void
    {
        const parent = this._entityGraph[parentId];
        const child = this._entityGraph[childId];

        if (!parent || !child)
        {
            return;
        }

        const childIndex = parent.children.indexOf(childId);

        if (childIndex !== -1)
        {
            parent.children[childIndex] = parent.children[parent.children.length - 1];
            parent.children.pop();
        }

        child.parent = -1;
    }

    public static DestroyEntity(entityId: EntityId): void
    {
        const entity = this._entityGraph[entityId];
        this._entityGraph[entityId] = undefined;

        if (!entity)
        {
            return;
        }

        for (let i = 0; i < entity.children.length; ++i)
        {
            const child = this._entityGraph[entity.children[i]];

            if (child)
            {
                child.parent = -1;
            }
        }
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

        const possibleViews = this._mappedViews[component.TypeId] ?? [];
        for (let i = 0; i < possibleViews.length; ++i)
        {
            const view = this._views.Get(possibleViews[i])!;
            const config = this._viewConfig[possibleViews[i]];
            
            if (view.includes(entityId))
            {
                continue;
            }

            if (this.testValidViewEntity(entityId, config.componentTypes, config.filter))
            {
                view.push(entityId)
            }
        }
        this._mappedViews[component.TypeId] = possibleViews;
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

        const possibleViews = this._mappedViews[componentTypeId] ?? [];
        for (let i = 0; i < possibleViews.length; ++i)
        {
            const view = this._views.Get(possibleViews[i])!;
            const index = view.indexOf(entityId);

            if (index === -1)
            {
                continue;
            }

            view[index] = view[view.length - 1];
            view.pop();
        }
        this._mappedViews[componentTypeId] = possibleViews;
    }
    //#endregion

    //#region Component Type
    public static RegisterComponentType(componentType: Class<Component>): void
    {
        (componentType as any).TypeId = this._componentTypes.length;
        this._componentListContainers[componentType.TypeId] = new ListContainer(1);
        this._componentTypes.push(componentType);
    }

    public static GetRegisteredComponentType(componentTypeId: TypeId): Class<Component>
    {
        return this._componentTypes[componentTypeId];
    }

    public static GetRegisteredComponentTypes(): readonly Class<Component>[]
    {
        return this._componentTypes;
    }
    //#endregion

    //#region View    
    public static RegisterView<T1 extends Component>(componentTypes: readonly [Class<T1>]): ViewKey
    public static RegisterView<T1 extends Component>(componentTypes: readonly [Class<T1>], filter: ViewFilter<[T1]>): ViewKey
    public static RegisterView<T1 extends Component, T2 extends Component>(componentTypes: readonly [Class<T1>, Class<T2>]): ViewKey
    public static RegisterView<T1 extends Component, T2 extends Component>(componentTypes: readonly [Class<T1>, Class<T2>], filter: ViewFilter<[T1, T2]>): ViewKey
    public static RegisterView<T1 extends Component, T2 extends Component, T3 extends Component>(componentTypes: readonly [Class<T1>, Class<T2>, Class<T3>]): ViewKey
    public static RegisterView<T1 extends Component, T2 extends Component, T3 extends Component>(componentTypes: readonly [Class<T1>, Class<T2>, Class<T3>], filter: ViewFilter<[T1, T2, T3]>): ViewKey
    public static RegisterView<T extends Component[]>(componentTypes: readonly Class<T[number]>[], filter: ViewFilter<T[number][]> = () => true): ViewKey
    {
        const entityIds: View = [];
        const currentEntityIds: View = [];
        const entities = this._entityComponentList.Items;

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
        
        const key = this._views.Add(entityIds);
        this._viewConfig[key] = { componentTypes, filter };

        for (const componentType of componentTypes)
        {
            if (!this._mappedViews[componentType.TypeId])
            {
                this._mappedViews[componentType.TypeId] = [];
            }
            this._mappedViews[componentType.TypeId].push(key);
        }

        return key;
    }

    public static GetView(key: ViewKey): readonly EntityId[]
    {
        return this._views.Get(key) ?? [];
    }
    //#endregion

    //#region Utils
    private static testValidViewEntity(entityId: EntityId, componentTypes: readonly Class<Component>[], filter: ViewFilter): boolean
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

        return filter.call(undefined, components);
    }
    //#endregion
}
