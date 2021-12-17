import { Component } from "./Component"
import { Entity } from "./Entity"
import { Class, EntityId } from "./Registry"
import { Scene } from "./Scene"
import { IUpdateable } from "../atoms/Updateable"

export abstract class System implements IUpdateable
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
    public Update(delta: number): void { }
    public Stop(): void { }

    public OnUpdateEntity(entity: Entity): void
    {
        if (this.IsValid(entity) && !this.entities.has(entity.Id))
        {
            this.entities.add(entity.Id)
        }
        else if (!this.IsValid(entity) && this.entities.has(entity.Id))
        {
            this.entities.delete(entity.Id)
        }
    }

    protected IsValid(entity: Entity): boolean
    {
        let valid = true

        for (const componentType of this.componentTypes)
        {
            valid = valid && entity.HasComponent(componentType)
        }
        
        return valid
    }
}
