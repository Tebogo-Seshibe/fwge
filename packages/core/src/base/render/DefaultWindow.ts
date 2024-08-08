import { Game } from "../Game";
import { RenderWindow } from "./RenderWindow";

export class DefaultWindow extends RenderWindow
{
    constructor(game: Game)
    {
        super(game);
    }
}
