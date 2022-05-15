import { Entity } from "../ecs/Entity"
import { Constructor, EntityId, nextId, SceneId } from "../ecs/Registry"
import { System } from "../ecs/System"

export class Scene
{
    public readonly Id: SceneId
    
    public get Context()
    {
        return this._context
    }

    private _context?: HTMLCanvasElement
    private _entities: Map<EntityId, Entity> = new Map()
    private _systems!: System[]
    private running: boolean = false

    constructor()
    {
        this.Id = nextId(new.target)
    }

    OnInit() { }
    
    Init(): void
    {
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
    
    Start(): void
    {
        this.running = true
        for (const system of this._systems)
        {
            system.onStart()
        }
    }

    Update(delta: number): void
    {
        for (const system of this._systems)
        {
            system.Update(delta)
        }
    }

    Stop(): void
    {
        for (const system of this._systems)
        {
            system.onStop()
            system.Reset()
        }
        this.running = false
    }
    
    UseSystem<T extends System>(system: T): Scene
    {
        if (!this._systems)
        {
            this._systems = []
        }

        this._systems.push(system)
        return this
    }
    
    SetContext(canvas?: HTMLCanvasElement): void
    {
        this._context = canvas
    }
    
    //#region Entity Logic
    CreateEntity(): Entity
    CreateEntity<T extends Entity, K extends any[]>(constructor: Constructor<T, [Scene, ...K]>, ...args: K): T
    CreateEntity<T extends Entity, K extends any[]>(constructor?: Constructor<T, [Scene, ...K]>, ...args: K): T
    {
        const entity = constructor ? new constructor(this, ...args) : new Entity(this)
        this._entities.set(entity.Id, entity)
        this.OnEntity(entity)
        entity.OnCreate()

        return entity as T
    }

    GetEntity(entityId: EntityId): Entity | undefined
    {
        return this._entities.get(entityId)
    }

    RemoveEntity(entityId: EntityId): void
    RemoveEntity(entity: Entity): void
    RemoveEntity(arg: EntityId | Entity): void
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

    OnEntity(entity: Entity): void
    {
        if (this.running)
        {
            for (const system of this._systems)
            {
                system.OnUpdateEntity(entity)
            }
        }
    }
    //#endregion
}
