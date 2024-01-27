import { Registry, System } from "@fwge/ecs";
import { Script } from "../components/Script";

export class ScriptSystem extends System
{
    private allScripts = Registry.RegisterView([Script]);
    
    Init(): void { }
    
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
