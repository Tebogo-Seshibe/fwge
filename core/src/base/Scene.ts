import { Entity } from "../ecs/Entity"
import { Class, Constructor, EntityId, Registry, SceneId } from "../ecs/Registry"
import { System } from "../ecs/System"

export class Scene
{
    private static sceneId: SceneId = 0

    private _registry: Registry
    public get Registry()
    {
        return this._registry
    }

    public get Context()
    {
        return this._context
    }

    private _context?: HTMLCanvasElement
    private _entities: Entity[] = []
    private _systems: Map<Class<System>, System> = new Map()

    readonly Id: SceneId = Scene.sceneId++
    constructor(registry: Registry)
    {
        this._registry = registry
    }

    Init(): void
    {        
        this._systems.forEach(system => system.Init())
    }
    
    Start(): void
    {
        this._systems.forEach(system => system.Start())
    }

    Update(delta: number): void
    {
        this._systems.forEach(system => system.Update(delta))
    }

    Stop(): void
    {
        this._systems.forEach(system => system.Stop())
    }
    
    RegisterSystems<T extends System>(...systems: Constructor<T, [Scene]>[]): void
    {
        systems.forEach(system =>
        {
            this._systems.set(system as Class<T>, new system(this))
        })
    }

    SetContext(canvas?: HTMLCanvasElement): void
    {
        this._context = canvas
    }
    
    CreateEntity(): Entity
    CreateEntity<T extends Entity, K extends any[]>(constructor: Constructor<T, [Scene, ...K]>, ...args: K): T
    CreateEntity<T extends Entity, K extends any[]>(constructor?: Constructor<T, [Scene, ...K]>, ...args: K): T
    {
        const entity = constructor ? new constructor(this, ...args) : new Entity(this)
        this._entities.push(entity)
        this.OnEntity(entity)

        return entity as T
    }

    GetEntity(entityId: EntityId): Entity | undefined
    {
        return this._entities.find(entity => entity?.Id === entityId)
    }

    RemoveEntity(entityId: EntityId): void
    RemoveEntity(entity: Entity): void
    RemoveEntity(arg: EntityId | Entity): void
    {
        const entity = typeof arg === 'number'
            ? this.GetEntity(arg)
            : arg

        if (entity && this._entities.includes(entity))
        {
            this._entities = this._entities.filter(x =>  entity.Id === x.Id)
            this.OnEntity(entity)
        }
    }

    OnEntity(entity: Entity): void
    {
        for (const [, system] of this._systems)
        {
            system.OnUpdateEntity(entity)
        }
    }
}
