import { FixedLengthArray } from "@fwge/common";
import { Component } from "./Component";

export type Head<T extends unknown[]> = T[0];
export type Tail<T extends unknown[]> = T extends [Head<T>, ...infer TailType] ? TailType : never;

export type ViewKey = string | symbol | number;
export type GroupKey = string | symbol | number;
export type TypeId = number;
export type EntityId = number;
export type ComponentId = number;
export type ViewFilter<T extends any[] = any[]> = (...args: T) => boolean;
export type View = EntityId[];
export type ViewGroup<T extends any[] = any[]> = (...args: T) => ComponentId;
export type ViewConfig = { componentTypes: Class<Component>[], rules: ViewFilter[] };
export type Group<
    Depth extends number,
    Count extends unknown[] = FixedLengthArray<number, Depth>
> = 
    Count['length'] extends 0 
    ? EntityId[]
    : Map<ComponentId, Group<Depth, Tail<Count>>
>;

export type Class<T = {}> =
{
    new(...args: any[]): T;
    prototype: Partial<T>;
    TypeId?: TypeId;
};

export type Constructor<T, U extends ConstructorParameters<Class<T>>> =
{
    new(...args: U): T;
    prototype: Partial<T>;
    TypeId?: TypeId;
};

export class Registry
{
    private static readonly EMPTY_VIEW: View = [];
    private static readonly EMPTY_GROUP: Group<1> = new Map();

    private static entityIdIndex: EntityId = 0;
    private static freeIds: number[] = [];

    private static componentIds: ComponentId[] = [];
    private static components: (Component | undefined)[][] = [];
    private static componentInstances: (Component | undefined)[][] = [];
    private static componentTypeIndex: number = 0;

    private static readonly views: Map<ViewKey, View> = new Map();
    private static readonly viewConfig: Map<ViewKey, ViewConfig> = new Map();
    private static readonly mappedViews: Map<ComponentId, ViewKey[]> = new Map();

    private static readonly groups: Map<ViewKey, Group<number>> = new Map();
    private static readonly groupConfig: Map<ViewKey, ViewConfig> = new Map();
    private static readonly mappedGroups: Map<ComponentId, GroupKey[]> = new Map();

    static registerComponents(...componentTypes: Class<Component>[]): void
    {
        for (const componentType of componentTypes)
        {
            componentType.TypeId = this.componentTypeIndex;
            this.componentIds.push(0);
            this.components[this.componentTypeIndex] = [];
            this.componentInstances[this.componentTypeIndex] = [];
            this.componentTypeIndex++;
        }
    }

    static createEntity(): EntityId
    {
        let entityId: EntityId;
    
        if (this.freeIds.length > 0)
        {
            entityId = this.freeIds.pop()!;
        }
        else
        {
            entityId = this.entityIdIndex++;
        }

        return entityId;
    }

    static removeEntity(entityId: EntityId): void
    {
        for (let i = 0; i < this.components.length; ++i)
        {
            this.components[i][entityId] = undefined;
        }

        this.freeIds.push(entityId);
    }

    static createComponent<T extends Component>(component: T): ComponentId
    {
        const componentId = this.componentIds[component.TypeId]++;
        this.componentInstances[component.TypeId][componentId] = component;
        
        return componentId;
    }

    static deleteComponent<T extends Component>(component: T): void
    {
        this.componentInstances[component.TypeId][component.Id] = undefined;
    }

    static addComponent<T extends Component>(entityId: EntityId, component: T): void
    {
        this.components[component.TypeId][entityId] = component;

        const views = this.mappedViews.get(component.TypeId) ?? [];
        for (const key of views)
        {
            const view = this.views.get(key) ?? [];
            if (view.includes(entityId))
            {
                continue;
            }
            
            const config = this.viewConfig.get(key)!;
            if (this.testValidViewEntity(entityId, config.componentTypes, config.rules))
            {
                view.push(entityId);
            }
        }


        const groups = this.mappedGroups.get(component.TypeId) ?? [];
        for (const key of groups)
        {
            const config = this.groupConfig.get(key)!
            if (!this.testValidViewEntity(entityId, config.componentTypes, config.rules))
            {
                continue;
            }

            let group = this.groups.get(key)! as any as Map<ComponentId, any>;
            for (let i = 0; i < config.componentTypes.length - 1; ++i)
            {
                const component = this.getComponent(entityId, config.componentTypes[i])!;

                if (!group.has(component.Id))
                {
                    group.set(component.Id, new Map<ComponentId, any>());
                }

                group = group.get(component.Id)  as any as Map<ComponentId, any>;
            }
            const lastComponent = Registry.getComponent(entityId, config.componentTypes.last)!;
            group.get(lastComponent.Id).push(entityId);
            
        }
    }

    static hasComponent<T extends Component>(entityId: EntityId, componentType: Class<T>): boolean;
    static hasComponent<T extends Component>(entityId: EntityId, componentTypeId: TypeId): boolean;
    static hasComponent<T extends Component>(entityId: EntityId, componentTypeOrTypeId: Class<T> | TypeId): boolean
    {
        const typeId = typeof componentTypeOrTypeId === 'number'
            ? componentTypeOrTypeId
            : componentTypeOrTypeId.TypeId!

        return !!this.components[typeId][entityId];
    }

    static getComponent<T extends Component>(entityId: EntityId, componentType: Class<T>): T | undefined;
    static getComponent<T extends Component>(entityId: EntityId, componentTypeId: TypeId): T | undefined;
    static getComponent<T extends Component>(entityId: EntityId, componentTypeOrTypeId: Class<T> | TypeId): T | undefined
    {
        const typeId = typeof componentTypeOrTypeId === 'number'
            ? componentTypeOrTypeId
            : componentTypeOrTypeId.TypeId!

        return this.components[typeId][entityId] as T | undefined;
    }

    static getComponentInstance<T extends Component>(componentId: ComponentId, componentType: Class<T>): T | undefined;
    static getComponentInstance<T extends Component>(componentId: ComponentId, componentTypeId: TypeId): T | undefined;
    static getComponentInstance<T extends Component>(componentId: ComponentId, componentTypeOrTypeId: Class<T> | TypeId): T | undefined
    {
        const typeId = typeof componentTypeOrTypeId === 'number'
            ? componentTypeOrTypeId
            : componentTypeOrTypeId.TypeId!

        return this.componentInstances[typeId][componentId] as T | undefined;
    }

    static getAllComponents(entityId: EntityId): Component[]
    {
        const components: Component[] = [];

        for (let i = 0; i < this.components.length; ++i)
        {
            if (this.components[i][entityId])
            {
                components.push(this.components[i][entityId]!);
            }
        }

        return components;
    }

    static removeComponent<T extends Component>(entityId: EntityId, componentType: Class<T>): T;
    static removeComponent<T extends Component>(entityId: EntityId, componentTypeId: TypeId): T;
    static removeComponent<T extends Component>(entityId: EntityId, componentTypeOrTypeId: Class<T> | TypeId): T
    {
        const typeId = typeof componentTypeOrTypeId === 'number'
            ? componentTypeOrTypeId
            : componentTypeOrTypeId.TypeId!

        const component = this.components[typeId][entityId];
        this.components[typeId][entityId] = undefined;
        
        const views = this.mappedViews.get(typeId) ?? [];
        for (const key of views)
        {
            const view = this.views.get(key) ?? [];
            if (!view.includes(entityId))
            {
                continue;
            }
            
            const config = this.viewConfig.get(key)!;
            if (this.testValidViewEntity(entityId, config.componentTypes, config.rules))
            {
                view.splice(view.indexOf(entityId), 1);
            }
        }

        return component as T;
    }

    static registerView<T1 extends Component>(key: ViewKey, componentTypes: [Class<T1>]): void
    static registerView<T1 extends Component>(key: ViewKey, componentTypes: [Class<T1>], rules: ViewFilter<[T1]>[]): void
    static registerView<T1 extends Component, T2 extends Component>(key: ViewKey, componentTypes: [Class<T1>, Class<T2>]): void
    static registerView<T1 extends Component, T2 extends Component>(key: ViewKey, componentTypes: [Class<T1>, Class<T2>], rules: ViewFilter<[T1, T2]>[]): void
    static registerView<T1 extends Component, T2 extends Component, T3 extends Component>(key: ViewKey, componentTypes: [Class<T1>, Class<T2>, Class<T3>]): void
    static registerView<T1 extends Component, T2 extends Component, T3 extends Component>(key: ViewKey, componentTypes: [Class<T1>, Class<T2>, Class<T3>], rules: ViewFilter<[T1, T2, T3]>[]): void
    static registerView<T extends Component[]>(key: ViewKey, componentTypes: Class<T[number]>[], rules: ViewFilter<T[number][]>[] = []): void
    {
        const entityIds: EntityId[] = [];
        for (const componentType of componentTypes)
        {
            if (!this.mappedViews.has(componentType.TypeId!))
            {
                this.mappedViews.set(componentType.TypeId!, []);
            }
            this.mappedViews.get(componentType.TypeId!)!.push(key);
        }

        const totalEntities = this.components.reduce((curr, arr) => arr.length > curr ? arr.length : curr, 0)
        for (let entityId = 0; entityId < totalEntities; ++entityId)
        {
            if (this.testValidViewEntity(entityId, componentTypes, rules))
            {
                entityIds.push(entityId);
            }
        }
        
        this.views.set(key, entityIds);
        this.viewConfig.set(key, { componentTypes, rules })
    }

    static getView(key: ViewKey): View
    {
        return this.views.get(key) ?? this.EMPTY_VIEW;
    }

    static registerGroup<T1 extends Component, T2 extends Component>(key: GroupKey, componentTypes: [Class<T1>, Class<T2>]): void
    static registerGroup<T1 extends Component, T2 extends Component>(key: GroupKey, componentTypes: [Class<T1>, Class<T2>], rules: ViewFilter<[T1, T2]>[]): void
    static registerGroup<T1 extends Component, T2 extends Component, T3 extends Component>(key: GroupKey, componentTypes: [Class<T1>, Class<T2>, Class<T3>]): void
    static registerGroup<T1 extends Component, T2 extends Component, T3 extends Component>(key: GroupKey, componentTypes: [Class<T1>, Class<T2>, Class<T3>], rules: ViewFilter<[T1, T2, T3]>[]): void
    static registerGroup<T extends Component[]>(key: GroupKey, componentTypes: Class<T[number]>[], rules: ViewFilter<T[number][]>[] = []): void
    {
        const entityIds: EntityId[] = [];
        for (const componentType of componentTypes)
        {
            if (!this.mappedGroups.has(componentType.TypeId!))
            {
                this.mappedGroups.set(componentType.TypeId!, []);
            }
            this.mappedGroups.get(componentType.TypeId!)!.push(key);
        }

        const totalEntities = this.components.reduce((curr, arr) => arr.length > curr ? arr.length : curr, 0)
        for (let entityId = 0; entityId < totalEntities; ++entityId)
        {
            if (this.testValidViewEntity(entityId, componentTypes, rules))
            {
                entityIds.push(entityId);
            }
        }
        
        this.groups.set(key, this.addGroup(componentTypes.first, entityIds, componentTypes.slice(1)));
        this.groupConfig.set(key, { componentTypes, rules })
    }

    private static addGroup<Depth extends number>(baseComponent: Class<Component>, entities: EntityId[], children: Class<Component>[] = []): Group<Depth> | EntityId[]
    {
        const validEntities: EntityId[] = [];

        if (children.length === 0)
        {
            for (let i = 0; i < entities.length; ++i)
            {
                if (this.hasComponent(entities[i], baseComponent))
                {
                    validEntities.push(entities[i]);
                }
            }
            return validEntities;
        }
        else
        {
            const groupedEntities = new Map<ComponentId, EntityId[]>();
            for (let i = 0; i < entities.length; ++i)
            {
                const component = this.getComponent(entities[i], baseComponent);
                if (!component)
                {
                    continue;
                }

                if (!groupedEntities.has(component.Id))
                {
                    groupedEntities.set(component.Id, []);
                }

                groupedEntities.get(component.Id)!.push(entities[i]);
            }
            
            const group = new Map();
            for (const [componentId, entityIds] of groupedEntities)
            {
                group.set(componentId, this.addGroup(children.first, entityIds, children.slice(1)));
            }
            return group as any;
        }
    }

    static getGroup<Depth extends number>(key: GroupKey): Group<Depth>
    {
        return this.groups.get(key) ?? this.EMPTY_GROUP as any;
    }

    private static testValidViewEntity(entityId: EntityId, componentTypes: Class<Component>[], rules: ViewFilter[]): boolean
    {
        const components: Component[] = [];

        for (let i = 0; i < componentTypes.length; ++i)
        {
            if (!this.hasComponent(entityId, componentTypes[i].TypeId!))
            {
                return false
            }
            
            components.push(this.getComponent(entityId, componentTypes[i].TypeId!)!);
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
}
