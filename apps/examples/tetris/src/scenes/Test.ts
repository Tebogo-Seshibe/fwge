import { DefaultWindow, Game, Scene } from "@fwge/core";
import { ActionInputMovementSystem, RenderSystem } from "../systems";
import { Player } from "../entities";

export class Test extends Scene
{
    constructor(game: Game)
    {
        super(game,
        {
            windows: [ DefaultWindow ],
            systems: [ 
                ActionInputMovementSystem,
                RenderSystem
            ],
            entities: [ 
                Player,
            ],
        });
    }
}
