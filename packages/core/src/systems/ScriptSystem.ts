import { Script } from "../components/Script";
import { System } from "../ecs";

export class ScriptSystem extends System
{
    private allScripts!: number;
    
    Init(): void
    { 
        this.allScripts = this.Game.RegisterView([Script]);
    }
    
    Start(): void
    {
        for (const entityId of this.Game.GetView(this.allScripts))
        {
            const script = this.Game.GetComponent(entityId, Script)!;
            const entity = this.Game.GetEntity(entityId)!;
            script.Start.call(entity);
        }
    }

    Update(delta: number): void
    {
        for (const entityId of this.Game.GetView(this.allScripts))
        {
            if (!this.Game.IsEntityActive(entityId))
            {
                continue;   
            }

            const script = this.Game.GetComponent(entityId, Script)!;
            const entity = this.Game.GetEntity(entityId)!;
            script.Update.call(entity, delta);
        }
    }

    Stop(): void
    {
        for (const entityId of this.Game.GetView(this.allScripts))
        {
            const script = this.Game.GetComponent(entityId, Script)!;
            const entity = this.Game.GetEntity(entityId)!;
            script.End.call(entity);
        }
    }
}
