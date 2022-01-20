import { Camera } from "../components/Camera"
import { IUpdateable } from "../atoms/Updateable"
import { Entity } from "./Entity"
import { Class, Constructor, EntityId, Registry, SceneId } from "./Registry"
import { System } from "./System"

export class Scene implements IUpdateable
{
    static #sceneId: SceneId = 0

    #entities: Entity[] = []
    #cameras: Camera[] = []
    #mainCamera?: Camera
    #systems: Map<Class<System>, System> = new Map()

    readonly Id: SceneId = Scene.#sceneId++

    get Camera(): Camera | undefined
    {
        return this.#mainCamera
    }

    Init(): void
    {
        if (this.#cameras.length === 0)
        {
            throw new Error('No cameras in the scene')
        }

        if (!this.#mainCamera)
        {
            this.#mainCamera = this.#cameras[0]
        }
        
        for (const [ , system ] of this.#systems)
        {
            system.Init()
        }
    }
    
    Start(): void
    {
        for (const [ , system ] of this.#systems)
        {
            system.Start()
        }
    }

    Update(delta: number): void
    {
        for (const [ , system ] of this.#systems)
        {
            system.Update(delta)
        }
    }

    Stop(): void
    {
        for (const [ , system ] of this.#systems)
        {
            system.Stop()
        }
    }
    
    RegisterSystems<T extends System>(...systems: Constructor<T, [Scene]>[]): Scene
    {
        systems.forEach(system =>
        {
            if (Registry.getComponentType(this.Id, system.name) === -1)
            {
                Registry.registerComponentType(this.Id, system.name)
                this.#systems.set(system as Class<T>, new system(this))
            }
        })

        return this
    }
    
    CreateEntity(): Entity
    {
        const entity = new Entity(this)

        this.#entities.push(entity)
        this.OnEntity(entity)

        return entity
    }

    GetEntity(entityId: EntityId): Entity | undefined
    {
        return this.#entities.find(entity => entity?.Id === entityId)
    }

    RemoveEntity(entityId: EntityId): void
    RemoveEntity(entity: Entity): void
    RemoveEntity(arg: EntityId | Entity): void
    {
        const entity = typeof arg === 'number'
            ? this.GetEntity(arg)
            : arg

        if (entity && this.#entities.includes(entity))
        {
            this.#entities = this.#entities.filter(x =>  entity.Id === x.Id)
            this.OnEntity(entity)
        }
    }

    OnEntity(entity: Entity): void
    {
        this.#cameras = this.#cameras.filter(camera => camera.Parent)

        if (entity.HasComponent(Camera))
        {
            this.#cameras.push(entity.GetComponent(Camera)!)
        }

        for (const [, system] of this.#systems)
        {
            system.OnUpdateEntity(entity)
        }
    }
}
