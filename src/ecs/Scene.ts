import { Camera } from "../entities/Camera"
import { IUpdateable } from "../atoms/Updateable"
import { Component } from "./Component"
import { Entity } from "./Entity"
import { GL } from "./Game"
import { Class, Constructor, EntityId, Registry, SceneId, Tail } from "./Registry"
import { System } from "./System"
import { Light } from "entities/lights/Light"

export class Scene implements IUpdateable
{
    private _entities: Array<Entity | undefined> = []
    private _cameras: Camera[] = []
    private _lights: Light[] = []
    private _mainCamera?: Camera
    private _systems: Map<Class<System>, System> = new Map()
    
    public get Camera(): Camera | undefined
    {
        return this._mainCamera
    }

    constructor(public readonly Id: SceneId) { }

    //#region Control
    public Init(): void
    {
        if (this._cameras.length === 0)
        {
            throw new Error('No cameras in the scene')
        }

        if (!this._mainCamera)
        {
            this._mainCamera = this._cameras[0]
        }
          
        GL.canvas.height = 1080
        GL.canvas.width = 1920
        
        for (const [ , system ] of this._systems)
        {
            system.Init()
        }
    }
    
    public Start(): void
    {
        for (const [ , system ] of this._systems)
        {
            system.Start()
        }
    }

    public Update(delta: number): void
    {
        for (const [ , system ] of this._systems)
        {
            system.Update(delta)
        }
    }

    public Stop(): void
    {
        for (const [ , system ] of this._systems)
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
                this._systems.set(system as Class<T>, new system(this))
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
    public CreateEntity<T extends Entity, U extends any[]>(constructor: Constructor<T, [Scene, ...U]>, ...args: U): T
    {
        console.log(constructor)
        console.log(args)

        const entity = new constructor(this, ...args)
        this._entities.push(entity)
        this.OnEntity(entity)

        return entity
    }

    public GetEntity(entityId: EntityId): Entity | undefined
    {
        return this._entities[entityId]
    }

    public RemoveEntity(entityId: EntityId): void
    public RemoveEntity(entity: Entity): void
    public RemoveEntity(arg: EntityId | Entity): void
    {
        const entity = typeof arg === 'number'
            ? this.GetEntity(arg)
            : arg

        if (entity)
        {
            this._entities[entity.Id] = undefined
            this.OnEntity(entity)
        }
    }

    public OnEntity(entity: Entity): void
    {
        
        for (const [, system] of this._systems)
        {
            system.OnUpdateEntity(entity)
        }
    }
    //#endregion
}
