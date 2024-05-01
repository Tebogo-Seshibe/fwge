import { Game, Scene } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { EditorWindow } from "../EditorWindow";

export class EditorScene extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [ EditorWindow ],
            entities: [

            ],
            systems: [
                InputSystem
                // EditorRenderSystem
            ]
        })
    }
}
