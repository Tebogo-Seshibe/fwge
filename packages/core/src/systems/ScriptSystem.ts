import { Script } from "../components/Script";
import { Registry, System } from "@fwge/ecs";

export class ScriptSystem extends System
{
    private allScripts!: number;
    
    Init(): void
    { 
        this.allScripts = Registry.RegisterView([Script]);
    }
    
    Start(): void
    {
        for (const entityId of Registry.GetView(this.allScripts))
        {
            const script = Registry.GetComponent(entityId, Script)!;
            const entity = Registry.GetEntity(entityId)!;
            script.Start.call(entity);
        }
    }

    Update(delta: number): void
    {
        for (const entityId of Registry.GetView(this.allScripts))
        {
            if (!Registry.IsEntityActive(entityId))
            {
                continue;   
            }

            const script = Registry.GetComponent(entityId, Script)!;
            const entity = Registry.GetEntity(entityId)!;
            script.Update.call(entity, delta);
        }
    }

    Stop(): void
    {
        for (const entityId of Registry.GetView(this.allScripts))
        {
            const script = Registry.GetComponent(entityId, Script)!;
            const entity = Registry.GetEntity(entityId)!;
            script.End.call(entity);
        }
    }
}
