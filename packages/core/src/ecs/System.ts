import { Scene } from "../base/Scene"
import { Component } from "./Component"
import { Entity } from "./Entity"
import { Class } from "./Registry"

let _systemTypeId: number = 0
interface ISystem
{
    async?: boolean
    tickRate?: number
    requiredComponents: Class<Component>[]
}

export abstract class System
{
    public readonly Type: Class<System>
    private readonly _tickRate: number
    private readonly _async: boolean

    private _prevTick: number = -1
    private _currTick: number = -1
    private _tickId: number = -1
    private _scene: Scene | undefined

    public readonly entities: Entity[] = []
    public readonly requiredComponents: Set<Class<Component>> = new Set()

    public get scene(): Scene
    {
        if (!this._scene)
        { 
            throw new Error(`No scene assinged to current system of type "${this.Type.name}"`)
        }

        return this._scene
    }

    public setScene(newScene: Scene)
    {
        this._scene = newScene
    }

    constructor(config: ISystem)
    {
        this.Type = new.target as Class<System>
        if (this.Type._typeId === undefined)
        {
            this.Type._typeId = _systemTypeId++
        }
        this._async = config.async ?? false
        this._tickRate = config.tickRate ?? 60
        this.requiredComponents = new Set(config.requiredComponents)
    }

    public abstract Init(): void
    public abstract Start(): void
    public abstract Update(_: number): void
    public abstract Stop(): void
    
    //#region Control Logic
    public Reset()
    {
        this.entities.empty()
    }
    public onStart()
    {
        if (this._async)
        {
            this._prevTick = Date.now()
            this._currTick = Date.now()
            window.setInterval(this.onUpdate.bind(this), this._tickRate)
        }

        this.Start()
    }

    protected onUpdate()
    {
        this._prevTick = this._currTick
        this._currTick = Date.now()

        this.Update((this._currTick - this._prevTick) / 1000)
    }

    public onStop()
    {
        if (this._async)
        {
            this._prevTick = -1
            this._currTick = -1
            window.clearInterval(this._tickId)
        }

        this.Stop()
    }
    //#endregion

    //#region Entity Logic
    public OnUpdateEntity(entity: Entity): void
    {
        const isValid = this.IsValidEntity(entity)
    
        if (isValid && !this.entities.includes(entity))
        {
            this.entities.push(entity)
        }
        else if (!isValid && this.entities.includes(entity))
        {
            const entityIndex = this.entities.indexOf(entity)
            this.entities.swap(entityIndex, this.entities.length - 1)
            this.entities.pop()
        }
    }

    protected IsValidEntity(entity: Entity): boolean
    {
        let valid = this.requiredComponents.size > 0

        for (const componentType of this.requiredComponents)
        {
            valid = valid && entity.HasComponent(componentType)
        }

        return valid
    }
    //#endregion
}