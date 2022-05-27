import { Scene } from "../base"
import { Class, Entity, System } from "../ecs"

export interface SceneConfig
{
    systems: Class<System>[]
    entities: Class<Entity>[]
}

export function FWGEScene(config: SceneConfig)
{
    return function (target: Class<Scene>): void
    {        
        const Init = target.prototype['Init'] as (this: Scene) => void
        target.prototype['Init'] = function (this: Scene)
        {           
            if (!this['_systems'])
            {
                this['_systems'] = []
            }

            if (!this['_entities'])
            {
                this['_entities'] = new Map()
            }

            for (const system of config.systems)
            {
                this['_systems'].push(new system())
            }

            for (const entity of config.entities)
            {
                const newEntity = new entity(this)
                this['_entities'].set(newEntity.Id, newEntity)
            }

            console.log(Init)
            Init.apply(this)
        }
    }
}
