import { Game, GameConfig } from "../base";
import { DecoratorManager } from "./DecoratorManager";
import { GetMetadata } from "./utils";

export function FWGEGame<T extends Game>(config: GameConfig): <TConstructor extends new (...args: any[]) => T>(constructor: TConstructor) => TConstructor | void
{
    return function<TConstructor extends new (...args: any[]) => T>(base: TConstructor): TConstructor | void
    {
        DecoratorManager.Game  = config;
        console.log(GetMetadata(base))
        
        return new Proxy(base,
        {
            construct(constructor, _1, _2)
            {
                const game = new constructor();
                // game.Init(config);
                return game;
            },
        });
    }
}
