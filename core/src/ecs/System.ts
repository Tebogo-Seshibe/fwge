import { Scene } from "../base/Scene"
import { Component } from "./Component"
import { Entity } from "./Entity"
import { Class, EntityId, Registry, TypeId } from "./Registry"

export abstract class System
{
    protected entities: Entity[] = []
    protected componentTypes: Set<Class<Component>> = new Set()

    constructor(protected scene: Scene, ...componentTypes: Class<Component>[])
    {
        this.componentTypes = new Set(componentTypes)
    }

    public Init(): void { }
    public Start(): void { }
    public Update(_: number): void { }
    public Stop(): void { }

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

    private IsValidEntity(entity: Entity): boolean
    {
        let valid = this.componentTypes.size > 0

        for (const componentType of this.componentTypes)
        {
            valid = valid && entity.HasComponent(componentType)
        }

        return valid
    }
}
