import { Component } from "./Component";

export type ViewKey = string | symbol | number;
export type TypeId = number;
export type EntityId = number;
export type ComponentId = number;
export type ViewFilter<T extends any[] = any[]> = (...args: T) => boolean;
export type ViewGroup<T extends any[] = any[]> = (...args: T) => ComponentId;

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
    private static readonly ENTITY_SIZE = 128;

    private static entities: Int32Array = new Int32Array(Registry.ENTITY_SIZE).fill(-1);
    private static freeIds: number[] = [];

    private static componentIds: ComponentId[] = [];
    private static components: (Component | undefined)[][] = [];
    private static componentTypeIndex: number = 0;

    private static views: Map<ViewKey, number[]> = new Map();
    private static viewConfig: Map<ViewKey, { componentTypes: Class<Component>[], rules: ViewFilter[] }> = new Map();
    private static mappedViews: Map<ComponentId, ViewKey[]> = new Map();

    static registerComponents(...componentTypes: Class<Component>[]): void
    {
        for (const componentType of componentTypes)
        {
            componentType.TypeId = this.componentTypeIndex++;
            this.componentIds.push(0);
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
            entityId = this.entities.findIndex(x => x === -1);

            if (entityId === -1)
            {
                const newBuffer = new Int32Array(this.entities.length + Registry.ENTITY_SIZE).fill(-1);
                newBuffer[this.entities.length] = 0;
                newBuffer.set(this.entities);
                this.entities = newBuffer;
            }
        }

        this.components[entityId] = [];

        return entityId;
    }

    static createComponent<T extends Component>(componentType: Class<T>): ComponentId
    static createComponent<T extends Component>(componentTypeId: TypeId): ComponentId
    static createComponent<T extends Component>(componentTypeOrTypeId: Class<T> | TypeId): ComponentId
    {
        const typeId = typeof componentTypeOrTypeId === 'number'
            ? componentTypeOrTypeId
            : componentTypeOrTypeId.TypeId!
        
        return this.componentIds[typeId]++;
    }

    static addComponent<T extends Component>(entityId: EntityId, component: T): void
    {
        if ((this.entities[entityId] & component.TypeId) === 0)
        {
            this.entities[entityId] += component.TypeId;
        }

        this.components[entityId][component.TypeId] = component;

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
    }

    static hasComponent<T extends Component>(entityId: EntityId, componentType: Class<T>): boolean;
    static hasComponent<T extends Component>(entityId: EntityId, componentTypeId: TypeId): boolean;
    static hasComponent<T extends Component>(entityId: EntityId, componentTypeOrTypeId: Class<T> | TypeId): boolean
    {
        const typeId = typeof componentTypeOrTypeId === 'number'
            ? componentTypeOrTypeId
            : componentTypeOrTypeId.TypeId!

        return (this.entities[entityId] & typeId) > 0;
    }

    static getComponent<T extends Component>(entityId: EntityId, componentType: Class<T>): T | undefined;
    static getComponent<T extends Component>(entityId: EntityId, componentTypeId: TypeId): T | undefined;
    static getComponent<T extends Component>(entityId: EntityId, componentTypeOrTypeId: Class<T> | TypeId): T | undefined
    {
        const typeId = typeof componentTypeOrTypeId === 'number'
            ? componentTypeOrTypeId
            : componentTypeOrTypeId.TypeId!

        return this.components[entityId][typeId] as T | undefined;
    }    

    static removeComponent<T extends Component>(entityId: EntityId, componentType: Class<T>): void;
    static removeComponent<T extends Component>(entityId: EntityId, componentTypeId: TypeId): void;
    static removeComponent<T extends Component>(entityId: EntityId, componentTypeOrTypeId: Class<T> | TypeId): void
    {
        const typeId = typeof componentTypeOrTypeId === 'number'
            ? componentTypeOrTypeId
            : componentTypeOrTypeId.TypeId!

        if ((this.entities[entityId] & typeId) === 0)
        {
            return;
        }

        this.entities[entityId] -= typeId;
        this.components[entityId][typeId] = undefined;
        
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

        for (const entityId of this.entities)
        {
            if (this.testValidViewEntity(entityId, componentTypes, rules))
            {
                entityIds.push(entityId);
            }
        }
        
        this.views.set(key, entityIds);
        this.viewConfig.set(key, { componentTypes, rules })
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

    static getView(key: ViewKey): number[]
    {
        return this.views.get(key) ?? [];
    }
}
