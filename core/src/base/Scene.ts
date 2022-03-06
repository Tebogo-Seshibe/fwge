import { Entity } from "../ecs/Entity"
import { Class, Constructor, EntityId, Registry, SceneId } from "../ecs/Registry"
import { System } from "../ecs/System"

export class Scene
{
    private static sceneId: SceneId = 0

    #registry: Registry
    public get Registry()
    {
        return this.#registry
    }

    public get Context()
    {
        return this.context
    }

    private context?: HTMLCanvasElement
    private entities: Entity[] = []
    private systems: Map<Class<System>, System> = new Map()

    readonly Id: SceneId = Scene.sceneId++
    constructor(registry: Registry)
    {
        this.#registry = registry
    }

    Init(): void
    {        
        this.systems.forEach(system => system.Init())
    }
    
    Start(): void
    {
        this.systems.forEach(system => system.Start())
    }

    Update(delta: number): void
    {
        this.systems.forEach(system => system.Update(delta))
    }

    Stop(): void
    {
        this.systems.forEach(system => system.Stop())
    }
    
    RegisterSystems<T extends System>(...systems: Constructor<T, [Scene]>[]): void
    {
        systems.forEach(system =>
        {
            this.systems.set(system as Class<T>, new system(this))
        })
    }

    SetContext(canvas?: HTMLCanvasElement): void
    {
        this.context = canvas
    }
    
    CreateEntity(): Entity
    CreateEntity<T extends Entity, K extends any[]>(constructor: Constructor<T, [Scene, ...K]>, ...args: K): T
    CreateEntity<T extends Entity, K extends any[]>(constructor?: Constructor<T, [Scene, ...K]>, ...args: K): T
    {
        const entity = constructor ? new constructor(this, ...args) : new Entity(this)
        this.entities.push(entity)
        this.OnEntity(entity)

        return entity as T
    }

    GetEntity(entityId: EntityId): Entity | undefined
    {
        return this.entities.find(entity => entity?.Id === entityId)
    }

    RemoveEntity(entityId: EntityId): void
    RemoveEntity(entity: Entity): void
    RemoveEntity(arg: EntityId | Entity): void
    {
        const entity = typeof arg === 'number'
            ? this.GetEntity(arg)
            : arg

        if (entity && this.entities.includes(entity))
        {
            this.entities = this.entities.filter(x =>  entity.Id === x.Id)
            this.OnEntity(entity)
        }
    }

    OnEntity(entity: Entity): void
    {
        for (const [, system] of this.systems)
        {
            system.OnUpdateEntity(entity)
        }
    }
}
