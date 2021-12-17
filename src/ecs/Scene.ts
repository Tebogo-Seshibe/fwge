import { Camera } from "../atoms/Camera"
import { IUpdateable } from "../atoms/Updateable"
import { Component } from "./Component"
import { Entity } from "./Entity"
import { GL } from "./Game"
import { Class, Constructor, EntityId, Registry, SceneId } from "./Registry"
import { System } from "./System"

export class Scene implements IUpdateable
{
    private entities: Entity[] = []
    private cameras: Camera[] = []
    private mainCamera?: Camera
    public Systems: Map<Class<System>, System> = new Map()
    
    public get Camera(): Camera | undefined
    {
        return this.mainCamera
    }

    constructor(
        public readonly Id: SceneId
    ) { }

    //#region Control
    public Init(): void
    {
        if (this.cameras.length === 0)
        {
            throw new Error('No cameras in the scene')
        }

        if (!this.mainCamera)
        {
            this.mainCamera = this.cameras[0]
        }
          
        GL.canvas.height = 1080
        GL.canvas.width = 1920
        
        for (const [ , system ] of this.Systems)
        {
            system.Init()
        }
    }
    
    public Start(): void
    {
        for (const [ , system ] of this.Systems)
        {
            system.Start()
        }
    }

    public Update(delta: number): void
    {
        for (const [ , system ] of this.Systems)
        {
            system.Update(delta)
        }
    }

    public Stop(): void
    {
        for (const [ , system ] of this.Systems)
        {
            system.Stop()
        }
    }
    //#endregion
    
    //#region System
    public RegisterSystems<T extends System>(...systems: Constructor<T, [Scene]>[]): Scene
    {
        systems.forEach(system =>
        {
            if (Registry.getComponentType(this.Id, system.name) === -1)
            {
                Registry.registerComponentType(this.Id, system.name)
                this.Systems.set(system as Class<T>, new system(this))
            }
        })

        return this
    }

    public RegisterComponents(...components: Class<Component>[]): Scene
    {
        components.forEach(component =>
        {
            if (Registry.getComponentType(this.Id, component.name) === -1)
            {
                Registry.registerComponentType(this.Id, component.name)
            }
        })

        return this
    }
    //#endregion
    
    //#region Entity
    public CreateEntity(): Entity
    {
        const entity = new Entity(this, this.entities.length)
        this.entities.push(entity)
        this.OnEntity(entity)

        return entity
    }

    public GetEntity(entityId: EntityId): Entity | undefined
    {
        return this.entities[entityId]
    }

    public CreateCamera(): Camera
    {
        const camera = new Camera(this)
        this.cameras.push(camera)

        return camera
    }

    public RemoveEntity(entityId: EntityId): void
    public RemoveEntity(entity: Entity): void
    public RemoveEntity(arg: EntityId | Entity): void
    {
        // if ()
        // Registry.
    }

    public OnEntity(entity: Entity): void
    {
        
        for (const [, system] of this.Systems)
        {
            system.OnUpdateEntity(entity)
        }
    }
    //#endregion
}
