import { Game } from '../base';
import { type Class } from './Class';
import { type Component, type TypeId } from './Component';

export type EntityId = number;

export class Entity
{
    public readonly Game: Game;
    public readonly Id: EntityId;

    public Name: string;
    public Active: boolean = true;

    constructor(game: Game)
    constructor(game: Game, name: string)
    constructor(game: Game, name: string = new.target.name)
    {
        this.Game = game;
        this.Name = name;
        this.Id = game.CreateEntity(this);
    }

    public Init(): void
    {
        for (let component of this.GetAllComponentsAsList())
        {
            component.Init();
        }
    }
    public Destroy(): void
    {
        this.Game.DestroyEntity(this.Id);
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

        this.Game.AddChild(this.Id, entityId);

        return this;
    }
    
    public GetChild<T extends Entity = Entity>(childId: EntityId): T
    {
        return this.Game.GetChild(this.Id, childId) as T;
    }
    
    public GetChildren(): readonly Entity[]
    {
        return this.Game.GetChildren(this.Id);
    }

    public RemoveChild(entityId: EntityId): Entity
    public RemoveChild(entity: Entity): Entity
    public RemoveChild(entity: Entity | EntityId): Entity
    {
        const entityId = typeof entity === 'number'
            ? entity
            : entity.Id;

        this.Game.AddChild(this.Id, entityId);

        return this;
    }
    //#endregion

    //#region Component
    public AddComponent<T extends Component>(component: T): Entity
    {
        this.Game.AddComponent(this.Id, component);

        return this;
    }

    public AddComponents(...components: readonly Component[]): Entity
    {
        for (let i = 0; i < components.length; ++i)
        {
            this.Game.AddComponent(this.Id, components[i]);
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

        return this.Game.GetComponent(this.Id, componentTypeId) as T;
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
            const componentType = this.Game.GetRegisteredComponentType(componentTypeId);

            components[componentType.name] = this.Game.GetComponent(this.Id, componentTypeId);
        }

        return components;
    }
    
    public GetAllComponents(): Record<string, Component>
    {
        const components: Record<string, Component> = {};
        const componentTypes = this.Game.GetRegisteredComponentTypes();
        
        for (let i = 0; i < componentTypes.length; ++i)
        {
            const component = this.Game.GetComponent(this.Id, componentTypes[i].TypeId);
            if (component)
            {
                components[componentTypes[i].name] = component;
            }
        }
            
        return components;
    }

    public GetAllComponentsAsList(): readonly Component[]
    {
        const components: Component[] = [];
        const componentTypes = this.Game.GetRegisteredComponentTypes();
        
        for (let i = 0; i < componentTypes.length; ++i)
        {
            const component = this.Game.GetComponent(this.Id, componentTypes[i].TypeId);
            if (component)
            {
                components.push(component);
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

        return this.Game.HasComponent(this.Id, componentTypeId);
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

            if (!this.Game.HasComponent(this.Id, componentTypeId))
            {
                return false;
            }
        }
        
        return true;
    }

    public RemoveComponent<T extends Component>(componentType: Class<T>): Entity
    {
        this.Game.RemoveComponent(this.Id, componentType.TypeId!);
        
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

            this.Game.RemoveComponent(this.Id, componentTypeId);
        }

        return this;
    }

    public RemoveAllComponents(): Entity
    {
        const componentTypes = this.Game.GetRegisteredComponentTypes();
        
        for (let i = 0; i < componentTypes.length; ++i)
        {
            this.Game.RemoveComponent(this.Id, componentTypes[i].TypeId);
        }

        return this;
    }
    //#endregion
}
