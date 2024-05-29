import { DefaultWindow, Game, Scene } from "@fwge/core";
import { EditorRenderSystem } from "../systems";
import { Grid } from "../entities/Grid";
import { EditorViewer } from "../entities/EditorViewer";
import { InputSystem } from "@fwge/input";

export const EditorSceneId = 0;
export class EditorScene extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [ DefaultWindow ],
            entities: [
                EditorViewer,
                Grid,
            ],
            systems: [
                InputSystem,
                EditorRenderSystem
            ]
        })
    }
}
