import { Scene } from "../base/Scene"
import { Component } from "./Component"
import { Entity } from "./Entity"
import { Class, EntityId, RegistryType } from "./Registry"

interface ISystem
{
    async?: boolean
    tickRate?: number
    requiredComponents: Class<Component>[]
}

export class System extends RegistryType
{
    
    public readonly entityIds: EntityId[] = []
    public readonly requiredComponents: Set<Class<Component>> = new Set()

    public get Scene(): Scene
    {
        if (!this.#scene)
        { 
            throw new Error(`No scene assinged to current system of type "${this.Type.name}"`)
        }

        return this.#scene
    }

    public set Scene(newScene: Scene)
    {
        this.#scene = newScene
    }

    public Init(): void {}
    public Start(): void {}
    public Update(_: number): void {}
    public Stop(): void {}
    
    //#region Control Logic
    public Reset()
    {
        this.entityIds.empty()
    }

    public onStart()
    {
        if (this.#async)
        {
            this.#prevTick = Date.now()
            this.#currTick = Date.now()
            window.setInterval(this.onUpdate.bind(this), this.#tickRate)
        }

        this.Start()
    }

    protected onUpdate()
    {
        this.#prevTick = this.#currTick
        this.#currTick = Date.now()

        this.Update((this.#currTick - this.#prevTick) / 1000)
    }

    public onStop()
    {
        if (this.#async)
        {
            this.#prevTick = -1
            this.#currTick = -1
            window.clearInterval(this.#tickId)
        }

        this.Stop()
    }
    //#endregion

    //#region Entity Logic
    public OnUpdateEntity(entity: Entity): void
    {
        const isValid = this.IsValidEntity(entity)
    
        if (isValid && !this.entityIds.includes(entity.Id))
        {
            this.entityIds.push(entity.Id)
        }
        else if (!isValid && this.entityIds.includes(entity.Id))
        {
            const entityIndex = this.entityIds.indexOf(entity.Id)
            this.entityIds.swap(entityIndex, this.entityIds.length - 1)
            this.entityIds.pop()
        }
    }

    protected IsValidEntity(entity: Entity): boolean
    {
        if (this.requiredComponents.size === 0)
        {
            return false
        }
        
        for (const componentType of this.requiredComponents)
        {
            if (!entity.HasComponent(componentType))
            {
                return false
            }
        }

        return true
    }
    //#endregion

    readonly #tickRate: number = 60
    readonly #async: boolean = false

    #prevTick: number = -1
    #currTick: number = -1
    #tickId: number = -1
    #scene: Scene | undefined    

    constructor(scene: Scene, config: ISystem)
    {
        super(new.target as Class<System>)
        this.#scene = scene
        this.#async = config.async ?? false
        this.#tickRate = config.tickRate ?? 60
        this.requiredComponents = new Set(config.requiredComponents)
    }
}
