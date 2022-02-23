import { Registry, RegistryId } from "../ecs"
import { Script } from "../components/Script"
import { Scene } from "../core/Scene"
import { System } from "../ecs/System"

export class ScriptSystem extends System
{
    constructor(scene: Scene)
    {
        super(scene, Script)
    }

    Start(): void
    {
        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!
            const script = entity.GetComponent(Script)!

            script.Start.call(entity)
        }
    }

    Update(delta: number): void
    {
        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!
            const script = Registry.getEntityComponent(this.scene, entityId, Script)!

            script.Update.call(entity, delta)
        }
    }

    Stop(): void
    {
        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!
            const script = entity.GetComponent(Script)!

            script.End.call(entity)
        }
    }
}
