import { Script } from "../components/Script"
import { System } from "../ecs/System"


export class ScriptSystem extends System
{    
    constructor()
    {
        super({ requiredComponents: [ Script ] })
    }

    Init(): void { }
    
    Start(): void
    {
        for (const entity of this.entities)
        {
            const script = entity.GetComponent(Script)!
            script.Start.call(entity)
        }
    }

    Update(delta: number): void
    {
        for (const entity of this.entities)
        {
            const script = entity.GetComponent(Script)!
            script.Update.call(entity, delta)
        }
    }

    Stop(): void
    {
        for (const entity of this.entities)
        {
            const script = entity.GetComponent(Script)!
            script.End.call(entity)
        }
    }
}
