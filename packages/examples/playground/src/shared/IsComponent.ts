import { Class, Component, Constructor, Entity } from "@fwge/core"

export function IsComponent<K extends Component>(defaultValue: K): PropertyDecorator
export function IsComponent<K extends Component, V extends any>(constructor: Constructor<K, V[]>, ...args: V[]): PropertyDecorator
export function IsComponent<K extends Component, V extends any>(constructor: K | Constructor<K, V[]>, ...args: V[]): PropertyDecorator
{
    return (target: Object, propertyKey: string | symbol): void =>
    {
        const OnCreate = Reflect.get(target, 'OnCreate') as Function
        Reflect.set(target, 'OnCreate', function (this: Entity)
        {
            let component: K | undefined = ('Id' in constructor)
                ? constructor
                : new constructor(...args)

            delete (this as any)[propertyKey]
            Object.defineProperty(this, propertyKey,
            {
                get: () => component,
                set: (v: K) =>
                {
                    this.RemoveComponent(constructor as Class<K>)
                    this.AddComponent(v)
                    component = v
                }
            })
            this.AddComponent(component)
            OnCreate.apply(this)
        })
    }
}