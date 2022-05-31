import { Class, Component, Constructor, Entity, SharedComponent } from "../ecs"

export function FWGEComponent<K extends Component>(defaultValue: K): PropertyDecorator
export function FWGEComponent<K extends Component>(type: Class<K>): PropertyDecorator
export function FWGEComponent<K extends Component>(type: Class<K>, name: string): PropertyDecorator
export function FWGEComponent<K extends Component, V extends any[]>(constructor: Constructor<K, V>, args: V): PropertyDecorator
export function FWGEComponent<K extends Component, V extends any[]>(arg: K |  Constructor<K, V>, args?: string | V): PropertyDecorator
{
    return function (target: Object, propertyKey: string | symbol): void
    {
        const entity = (target as Entity)
        const OnCreate = (target as any)['OnCreate'] as (this: Entity) => void        
        entity['OnCreate'] = function ()
        {
            let component: K | undefined = undefined
            
            if (args && typeof args === 'string' && arg instanceof Function)
            {
                const componentType = arg as any as Class<SharedComponent>
                const componentName = args

                component = this.Scene.Game.GetFromLibrary(componentType, componentName) as K | undefined
            }
            else if (arg instanceof Component)
            {
                component = arg
            }
            else if (args)
            {
                component = new (arg as Constructor<K, V>)(...args as V)
            }

            delete (this as any)[propertyKey]
            Object.defineProperty(this, propertyKey,
            {
                get: () => component,
                set: (v: K) =>
                {
                    this.RemoveComponent(arg as Class<K>)
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