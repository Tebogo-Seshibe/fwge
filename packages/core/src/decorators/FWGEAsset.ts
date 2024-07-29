import { Class, Constructor } from "@fwge/ecs";
import { Asset } from "../base";
import { DecoratorManager } from "./DecoratorManager";

export function FWGEAsset<T extends Asset>(args: {name: string, files: string[] }): <TConstructor extends new (...args: any[]) => T>(constructor: TConstructor) => TConstructor | void
{
    // Resolve resource content here.

    return function<TConstructor extends new (...args: any[]) => T>(base: TConstructor): TConstructor | void
    {        
        DecoratorManager.Assets.push({ name: base.name, class: base as any as Constructor<Asset>, config: [] });

        return new Proxy(base,
        {
            construct(constructor, args, _2)
            {
                return new constructor(args);
            },
        });
    }
}
