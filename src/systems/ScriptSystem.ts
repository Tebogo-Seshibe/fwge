import { Script } from "../components/Script"
import { Scene } from "../ecs/Scene"
import { System } from "../ecs/System"

export class ScriptSystem extends System
{
    constructor(scene: Scene)
    {
        super(scene, Script)
    }

    public Start(): void
    {
        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!
            const script = entity.GetComponent(Script)!

            script.Start.call(entity)
        }
    }

    public Update(delta: number): void
    {
        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!
            const script = entity.GetComponent(Script)!

            script.Update.call(entity, delta)
        }
    }

    public Stop(): void
    {
        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!
            const script = entity.GetComponent(Script)!

            script.End.call(entity)
        }
    }
}
