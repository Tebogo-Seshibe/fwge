import { Entity } from "../ecs/Entity"
import { Class, Constructor, EntityId, IConstruct, nextId, RegistryType, SceneId } from "../ecs/Registry"
import { System } from "../ecs/System"
import { Game } from "./Game"

interface SceneConstructor<T extends System, U extends any[], Constructor>
{
    type: Constructor
    args?: U
}

export interface IScene
{
    systems: Class<System>[]
    entities: Class<Entity>[]
}

export class Scene extends RegistryType
{
    readonly Game: Game
    readonly Entities: Map<EntityId, Entity> = new Map()
    readonly Systems: System[] = []

    #running: boolean = false

    constructor(game: Game)
    constructor(game: Game, config: IScene)
    constructor(game: Game, config?: IScene)
    {
        super(Scene)

        this.Game = game

        config = {
            entities: config?.entities ?? [],
            systems: config?.systems ?? []
        }

        for (const SystemConstructor of config.systems)
        {
            this.AddSystem(new SystemConstructor(this))
        }

        for (const EntityConstructor of config.entities)
        {
            this.CreateEntity(EntityConstructor)
        }
    }
    
    public Init(): void
    {
        for (const [ , entity] of this.Entities)
        {
            for (const system of this.Systems)
            {
                system.OnUpdateEntity(entity)
            }
        }

        for (const system of this.Systems)
        {
            system.Init()
        }
    }
    
    public Start(): void
    {
        if (!this.#running)
        {
            this.#running = true
            for (const system of this.Systems)
            {
                system.onStart()
            }
        }
    }

    public Update(delta: number): void
    {
        for (const system of this.Systems)
        {
            system.Update(delta)
        }
    }

    public Stop(): void
    {
        if (this.#running)
        {
            for (const system of this.Systems)
            {
                system.onStop()
                system.Reset()
            }
            this.#running = false
        }
    }
    
    public AddSystem(system: System)
    {
        this.Systems.push(system)
    }

    //#region Entity Logic
    public CreateEntity(): Entity
    public CreateEntity<T extends Entity>(constructor: Constructor<T, [Scene]>): T
    public CreateEntity<T extends Entity>(constructor?: Constructor<T, [Scene]>): T
    {
        const entity = constructor ? new constructor(this) : new Entity(this)
        this.Entities.set(entity.Id, entity)
        entity.OnCreate()
        this.OnEntity(entity)

        return entity as T
    }

    public GetEntity(entityId: EntityId): Entity | undefined
    {
        return this.Entities.get(entityId)
    }

    public RemoveEntity(entityId: EntityId): void
    public RemoveEntity(entity: Entity): void
    public RemoveEntity(arg: EntityId | Entity): void
    {
        const entity = typeof arg === 'number'
            ? this.GetEntity(arg)
            : arg

        if (entity && this.Entities.has(entity.Id))
        {
            this.Entities.delete(entity.Id)
            this.OnEntity(entity)
            entity.OnDestroy()
        }
    }

    public OnEntity(entity: Entity): void
    {
        if (this.#running)
        {
            for (const system of this.Systems)
            {
                system.OnUpdateEntity(entity)
            }
        }
    }
    //#endregion
}
