import { IUpdateable } from "../atoms/Updateable"
import { Camera } from "../entities/Camera"
import { Light } from "../entities/lights/Light"
import { Component } from "./Component"
import { Entity } from "./Entity"
import { Class, Constructor, EntityId, Registry, SceneId } from "./Registry"
import { System } from "./System"

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
    public CreateEntity(): Entity
    public CreateEntity<T extends Entity, U extends any[]>(constructor: Constructor<T, [Scene, ...U]>, ...args: U): T
    public CreateEntity<T extends Entity, U extends any[]>(constructor?: Constructor<T, [Scene, ...U]>, ...args: U): T | Entity
    {
        const entity = constructor 
            ? new constructor(this, ...args)
            : new Entity(this)
            
        if (entity instanceof Camera)
        {
            this._cameras.push(entity)
        }
        else if (entity instanceof Light)
        {
            this._lights.push(entity)
        }
        else
        {
            this._entities.push(entity)
            this.OnEntity(entity)
        }

        return entity
    }

    public GetEntity(entityId: EntityId): Entity | undefined
    {
        return this._entities.find(entity => entity?.Id === entityId)
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
