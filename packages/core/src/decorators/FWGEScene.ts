import { Constructor } from "@fwge/ecs";
import { Game, IScene, Scene } from "../base";
import { DecoratorManager } from "./DecoratorManager";

export function FWGEScene<T extends Scene>(config: IScene): <TConstructor extends new (game: Game, config: IScene) => T>(constructor: TConstructor) => TConstructor | void
{
    return function<TConstructor extends new (game: Game, config: IScene) => T>(base: TConstructor): TConstructor | void
    {
        DecoratorManager.Scene.push({ name: base.name, class: base as any as Constructor<Scene>, config });

        return new Proxy(base,
        {
            construct(constructor, args, _2)
            {
                const sceneConfig = DecoratorManager.Scene.find(x => x.name === base.name)?.config ?? config;
                console.log({constructor, args, _2 });
                return new constructor(args[0], sceneConfig);
            },
        });
    }
}