import { Component } from "./Component"
import { Entity } from "./Entity"
import { Class, EntityId, Registry, TypeId } from "./Registry"
import { Scene } from "../core/Scene"

export abstract class System
{
    protected scene: Scene
    protected entities: Set<EntityId> = new Set()
    protected componentTypes: Set<Class<Component>> = new Set()
    protected componentTypeIds: TypeId[] = []

    constructor(scene: Scene, ...componentTypes: Class<Component>[])
    {
        this.scene = scene
        this.componentTypes = new Set(componentTypes)
        this.componentTypeIds = componentTypes.map(x => Registry.getComponentType(x))
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
        let valid = this.componentTypes.size > 0

        for (const componentType of this.componentTypes)
        {
            valid = valid && entity.HasComponent(componentType)
        }

        return valid
    }
}
