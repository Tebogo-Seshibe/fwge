import { DefaultWindow, Game, Scene } from "@fwge/core";
import { ActionInputMovementSystem } from "../systems/ActionInputMovementSystem";
import { Player } from "../entities";

export class Test extends Scene
{
    constructor(game: Game)
    {
        super(game,
        {
            windows: [ DefaultWindow ],
            systems: [ ActionInputMovementSystem ],
            entities: [ Player ],
        });
    }
}
