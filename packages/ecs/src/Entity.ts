import { type Component, type TypeId } from './Component';
import { Registry } from './Registry';
import { type Class } from './Class';

export type EntityId = number;

export class Entity
{
    public readonly Id: EntityId;
    public Name: string;

    constructor()
    {
        this.Id = Registry.CreateEntity(this);
        this.Name = new.target.name;
    }

    public Init(): void {}
    public Destroy(): void
    {
        Registry.DestroyEntity(this.Id);
    }

    public As<T extends Entity>(): T
    {
        return this as unknown as T;
    }

    //#region Children
    public AddChild(entityId: EntityId): Entity
    public AddChild(entity: Entity): Entity
    public AddChild(entity: Entity | EntityId): Entity
    {
        const entityId = typeof entity === 'number'
            ? entity
            : entity.Id;

        Registry.AddChild(this.Id, entityId);

        return this;
    }
    
    public GetChild<T extends Entity = Entity>(childId: EntityId): T
    {
        return Registry.GetChild(this.Id, childId) as T;
    }
    
    public GetChildren(): readonly Entity[]
    {
        return Registry.GetChildren(this.Id);
    }

    public RemoveChild(entityId: EntityId): Entity
    public RemoveChild(entity: Entity): Entity
    public RemoveChild(entity: Entity | EntityId): Entity
    {
        const entityId = typeof entity === 'number'
            ? entity
            : entity.Id;

        Registry.AddChild(this.Id, entityId);

        return this;
    }
    //#endregion

    //#region Component
    public AddComponent<T extends Component>(component: T): Entity
    {
        Registry.AddComponent(this.Id, component);

        return this;
    }

    public AddComponents(...components: readonly Component[]): Entity
    {
        for (let i = 0; i < components.length; ++i)
        {
            Registry.AddComponent(this.Id, components[i]);
        }

        return this;
    }

    public GetComponent<T extends Component>(componentType: Class<T>): T | undefined
    public GetComponent<T extends Component>(typeId: TypeId): T | undefined
    public GetComponent<T extends Component>(componentTypeOrId: Class<T> | TypeId): T | undefined
    {
        const componentTypeId = typeof componentTypeOrId === 'number'
            ? componentTypeOrId
            : componentTypeOrId.TypeId;

        return Registry.GetComponent(this.Id, componentTypeId) as T;
    }
    
    public GetComponents(...componentTypes: readonly Class<Component>[]): Record<string, Component | undefined>
    public GetComponents(...typeIds: readonly TypeId[]): Record<string, Component | undefined>
    public GetComponents(...componentTypesOrIds: readonly Class<Component>[] | readonly TypeId[]): Record<string, Component | undefined>
    {
        const components: Record<string, Component | undefined> = {};

        for (let i = 0; i < componentTypesOrIds.length; ++i)
        {
            const componentTypesOrId = componentTypesOrIds[i];
            const componentTypeId = typeof componentTypesOrId === 'number'
                ? componentTypesOrId
                : componentTypesOrId.TypeId;
            const componentType = Registry.GetRegisteredComponentType(componentTypeId);

            components[componentType.name] = Registry.GetComponent(this.Id, componentTypeId);
        }

        return components;
    }
    
    public GetAllComponents(): Record<string, Component>
    {
        const components: Record<string, Component> = {};
        const componentTypes = Registry.GetRegisteredComponentTypes();
        
        for (let i = 0; i < componentTypes.length; ++i)
        {
            const component = Registry.GetComponent(this.Id, componentTypes[i].TypeId);
            if (component)
            {
                components[componentTypes[i].name] = component;
            }
        }
            
        return components;
    }

    public HasComponent<T extends Component>(componentType: Class<T>): boolean;
    public HasComponent<T extends Component>(typeId: TypeId): boolean;
    public HasComponent<T extends Component>(componentTypeOrId: Class<T> | TypeId): boolean
    {
        const componentTypeId = typeof componentTypeOrId === 'number'
            ? componentTypeOrId
            : componentTypeOrId.TypeId;

        return Registry.HasComponent(this.Id, componentTypeId);
    }

    public HasComponents(...componentTypes: readonly Class<Component>[]): boolean;
    public HasComponents(...typeIds: readonly TypeId[]): boolean;
    public HasComponents(...componentTypesOrIds: readonly Class<Component>[] | readonly TypeId[]): boolean
    {
        for (let i = 0; i < componentTypesOrIds.length; ++i)
        {
            const componentTypesOrId = componentTypesOrIds[i];
            const componentTypeId = typeof componentTypesOrId === 'number'
                ? componentTypesOrId
                : componentTypesOrId.TypeId;

            if (!Registry.HasComponent(this.Id, componentTypeId))
            {
                return false;
            }
        }
        
        return true;
    }

    public RemoveComponent<T extends Component>(componentType: Class<T>): Entity
    {
        Registry.RemoveComponent(this.Id, componentType.TypeId!);
        
        return this;
    }

    public RemoveComponents(...componentTypes: readonly Class<Component>[]): Entity
    public RemoveComponents(...typeIds: readonly TypeId[]): Entity
    public RemoveComponents(...componentTypesOrIds: readonly Class<Component>[] | readonly TypeId[]): Entity
    {
        for (let i = 0; i < componentTypesOrIds.length; ++i)
        {
            const componentTypesOrId = componentTypesOrIds[i];
            const componentTypeId = typeof componentTypesOrId === 'number'
                ? componentTypesOrId
                : componentTypesOrId.TypeId;

            Registry.RemoveComponent(this.Id, componentTypeId);
        }

        return this;
    }

    public RemoveAllComponents(): Entity
    {
        const componentTypes = Registry.GetRegisteredComponentTypes();
        
        for (let i = 0; i < componentTypes.length; ++i)
        {
            Registry.RemoveComponent(this.Id, componentTypes[i].TypeId);
        }

        return this;
    }
    //#endregion
}
