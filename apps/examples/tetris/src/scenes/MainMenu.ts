import { DefaultWindow, Game, Scene } from "@fwge/core";

export class MainMenu extends Scene
{
    constructor(game: Game)
    {
        super(game,
        {
            windows: [ DefaultWindow ],
            systems: [],
            entities: [],
        });
    }
}
