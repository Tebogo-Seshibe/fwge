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

            for (const SystemConstructor of config.systems)
            {
                const system = new SystemConstructor()
                
                if ('_materials' in system)
                {
                    console.log(system)
                    console.log(system.Init)
                }
                
                this['_systems'].push(system)
            }

            for (const EntityConstructor of config.entities)
            {
                const newEntity = new EntityConstructor(this)
                this['_entities'].set(newEntity.Id, newEntity)
            }

            Init.apply(this)
        }
    }
}
