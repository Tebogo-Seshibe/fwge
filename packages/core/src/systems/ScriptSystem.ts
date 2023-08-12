import { Script } from "../components/Script";
import { Registry } from "../ecs";
import { System } from "../ecs/System";

export class ScriptSystem extends System
{
    private allScripts = Symbol();
    
    Init(): void
    {
        Registry.registerView(this.allScripts,[Script])
    }
    
    Start(): void
    {
        for (const entityId of Registry.getView(this.allScripts))
        {
            const script = Registry.getComponent(entityId, Script)!
            script.Start.call(this.Scene.GetEntity(entityId)!)
        }
    }

    Update(delta: number): void
    {
        for (const entityId of Registry.getView(this.allScripts))
        {
            const script = Registry.getComponent(entityId, Script)!
            script.Update.call(this.Scene.GetEntity(entityId)!, delta)
        }
    }

    Stop(): void
    {
        for (const entityId of Registry.getView(this.allScripts))
        {
            const script = Registry.getComponent(entityId, Script)!
            script.End.call(this.Scene.GetEntity(entityId)!)
        }
    }
}
