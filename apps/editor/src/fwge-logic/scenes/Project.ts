import { DefaultWindow, Game, Scene } from "@fwge/core";
import { InputSystem } from "@fwge/input";

export class ProjectScene extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [ DefaultWindow ],
            entities: [
            ],    
            systems: [
                InputSystem
            ]
        })
    }
}
