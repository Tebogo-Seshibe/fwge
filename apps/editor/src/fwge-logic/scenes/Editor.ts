import { Game, Scene } from "@fwge/core";
import { EditorWindow } from "../EditorWindow";
import { EditorRenderSystem } from "../systems";

export class EditorScene extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [ EditorWindow ],
            entities: [

            ],
            systems: [
                EditorRenderSystem
            ]
        })
    }
}
