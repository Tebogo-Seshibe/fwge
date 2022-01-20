import { Material, Mesh, Shader, Tag, Transform } from "../components"
import { Component } from "./Component"
import { Entity } from "./Entity"
import { Class, EntityId } from "./Registry"
import { Scene } from "./Scene"

export abstract class System
{
    protected scene: Scene
    protected entities: Set<EntityId> = new Set()
    protected componentTypes: Set<Class<Component>> = new Set()

    constructor(scene: Scene, ...componentTypes: Class<Component>[])
    {
        this.scene = scene
        this.componentTypes = new Set(componentTypes)
    }

    public Init(): void { }
    public Start(): void { }
    public Update(_: number): void { }
    public Stop(): void { }

    public OnUpdateEntity(entity: Entity): void
    {
        const isValid = this.#IsValidEntity(entity)
    
        if (isValid && !this.entities.has(entity.Id))
        {
            this.entities.add(entity.Id)
        }
        else if (!isValid && this.entities.has(entity.Id))
        {
            this.entities.delete(entity.Id)
        }
    }

    #IsValidEntity(entity: Entity): boolean
    {
        let valid = true

        for (const componentType of this.componentTypes)
        {
            valid = valid && entity.HasComponent(componentType)
        }

        return valid
    }
}
