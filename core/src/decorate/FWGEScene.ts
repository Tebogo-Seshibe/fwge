import { Scene } from "../base"
import { Class, Entity, System } from "../ecs"


export interface SceneConfig
{
    systems: Class<System>[]
    entities: Class<Entity>[]
}

export function FWGEScene(config: SceneConfig): ClassDecorator
{
    return function <TFunction extends Function>(target: TFunction): void
    {        
        const OnInit = Reflect.get(target.prototype, 'OnInit') as Function
        delete target.prototype['OnInit']
        Reflect.set(target.prototype, 'OnInit', function (this: Scene)
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
                newEntity.OnCreate()
                this['_entities'].set(newEntity.Id, newEntity)
            }

            OnInit()
        })
    }
}
