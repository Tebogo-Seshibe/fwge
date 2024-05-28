import { DefaultWindow, Game, Scene } from "@fwge/core";
import { EditorRenderSystem } from "../systems";

export class EditorScene extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [ DefaultWindow ],
            entities: [

            ],
            systems: [
                EditorRenderSystem
            ]
        })
    }
}
