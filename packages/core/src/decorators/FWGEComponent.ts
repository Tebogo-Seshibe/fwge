import 'reflect-metadata'
import { Class, Component, Entity, SharedComponent } from "../ecs"
import { GetMetadata } from './utils'

export function FWGEComponent<K extends Component>(): PropertyDecorator
export function FWGEComponent<K extends Component>(defaultValue: K): PropertyDecorator
export function FWGEComponent<K extends Component>(name: string): PropertyDecorator
export function FWGEComponent<K extends Component>(arg?: K | string): PropertyDecorator
{
    return function (target: Object, propertyKey: string | symbol): void
    {
        const metadata = GetMetadata(target, propertyKey)
        const componentType = metadata['design:type']! as Class<K>
        const entity = (target as Entity)
        if (!componentType || !(componentType?.prototype instanceof Component))
        {
            throw new Error(`Decorator not placed on component type. ${target.constructor.name}['${propertyKey as string}']: ${componentType.name}`)
        }

        const OnCreate = (target as any)['OnCreate'] as (this: Entity) => void        
        entity['OnCreate'] = function ()
        {
            let component: K | undefined = undefined
            
            if (typeof arg === 'string')
            {
                component = this.Scene.Game.GetFromLibrary(
                    componentType as any as Class<SharedComponent>,
                    arg
                ) as K | undefined
            }
            else if (arg instanceof Component)
            {
                component = arg
            }

            delete (this as any)[propertyKey]
            Object.defineProperty(this, propertyKey,
            {
                get: () => component,
                set: (v: K) =>
                {
                    this.RemoveComponent(componentType)
                    if (v)
                    {
                        this.AddComponent(v)
                    }
                    component = v
                }
            })

            if (component)
            {
                this.AddComponent(component)
            }

            OnCreate.apply(this)
        }
    }
}