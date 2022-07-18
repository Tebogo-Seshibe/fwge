import { Scene } from "../base"
import { Script } from "../components/Script"
import { Entity, getComponent } from "../ecs"
import { System } from "../ecs/System"

export class ScriptSystem extends System
{
    private _scripts: Map<number, Set<number>> = new Map()

    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [ Script ] })
    }

    Init(): void { }
    
    Start(): void
    {
        for (const [ scriptId, entityIds ] of this._scripts)
        {
            const script = getComponent(Script, scriptId)

            for (const entityId of entityIds)
            {
                script.Start.call(this.Scene.GetEntity(entityId)!)
            }
        }
    }

    Update(delta: number): void
    {
        for (const [ scriptId, entityIds ] of this._scripts)
        {
            const script = getComponent(Script, scriptId)
            
            for (const entityId of entityIds)
            {
                script.Update.call(this.Scene.GetEntity(entityId)!, delta   )
            }
        }
    }

    Stop(): void
    {
        for (const [ scriptId, entityIds ] of this._scripts)
        {
            const script = getComponent(Script, scriptId)
            
            for (const entityId of entityIds)
            {
                script.End.call(this.Scene.GetEntity(entityId)!)
            }
        }
    }

    override OnUpdateEntity(entity: Entity): void
    {
        super.OnUpdateEntity(entity)

        const script = entity.GetComponent(Script)
        if (script)
        {
            const entities = this._scripts.get(script.Id) ?? new Set()
            this._scripts.set(script.Id, new Set([entity.Id, ...entities]))
        }
    }
}
