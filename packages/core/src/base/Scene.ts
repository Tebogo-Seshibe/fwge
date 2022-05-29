import { Entity } from "../ecs/Entity"
import { Constructor, EntityId, SceneId } from "../ecs/Registry"
import { System } from "../ecs/System"
import { Game } from "./Game"

let SceneIds: SceneId = 0

export abstract class Scene
{
    public readonly Id: SceneId = SceneIds++
    
    private _game!: Game
    private _entities: Map<EntityId, Entity> = new Map()
    private _systems: System[] = []
    private _running: boolean = false
    // private _init: boolean = false

    public set Game(game: Game)
    {
        this._game = game
    }

    public get Game(): Game
    {
        return this._game
    }
    
    public Init(): void
    {
        for (const [ , entity] of this._entities)
        {
            entity.OnCreate()
        }

        for (const system of this._systems)
        {
            system.setScene(this)
            for (const [, entity] of this._entities)
            {
                system.OnUpdateEntity(entity)
            }
            system.Init()
        }
    }
    
    public Start(): void
    {
        if (!this._running)
        {
            this._running = true
            for (const system of this._systems)
            {
                system.onStart()
            }
        }
    }

    public Update(delta: number): void
    {
        for (const system of this._systems)
        {
            system.Update(delta)
        }
    }

    public Stop(): void
    {
        if (this._running)
        {
            for (const system of this._systems)
            {
                system.onStop()
                system.Reset()
            }
            this._running = false
        }
    }
    
    //#region Entity Logic
    public CreateEntity(): Entity
    public CreateEntity<T extends Entity, K extends any[]>(constructor: Constructor<T, [Scene, ...K]>, ...args: K): T
    public CreateEntity<T extends Entity, K extends any[]>(constructor?: Constructor<T, [Scene, ...K]>, ...args: K): T
    {
        const entity = constructor ? new constructor(this, ...args) : new Entity(this)
        this._entities.set(entity.Id, entity)
        this.OnEntity(entity)
        entity.OnCreate()

        return entity as T
    }

    public GetEntity(entityId: EntityId): Entity | undefined
    {
        return this._entities.get(entityId)
    }

    public RemoveEntity(entityId: EntityId): void
    public RemoveEntity(entity: Entity): void
    public RemoveEntity(arg: EntityId | Entity): void
    {
        const entity = typeof arg === 'number'
            ? this.GetEntity(arg)
            : arg

        if (entity && this._entities.has(entity.Id))
        {
            this._entities.delete(entity.Id)
            this.OnEntity(entity)
            entity.OnDestroy()
        }
    }

    public OnEntity(entity: Entity): void
    {
        if (this._running)
        {
            for (const system of this._systems)
            {
                system.OnUpdateEntity(entity)
            }
        }
    }
    //#endregion
}
