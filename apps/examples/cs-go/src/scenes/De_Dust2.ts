import { DefaultWindow, Game, Scene } from "@fwge/core";

export class De_Dust2 extends Scene
{
    constructor(game: Game)
    {
        super(game,
        {
            windows: [ new DefaultWindow() ],
            systems: [],
            entities: [],
        })
    }
}
