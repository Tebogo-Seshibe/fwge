import { DefaultWindow, Game, Scene, ScriptSystem } from "@fwge/core";
import { EditorRenderSystem, ProjectRenderSystem } from "../systems";
import { Grid } from "../entities/Grid";
import { EditorViewer } from "../entities/EditorViewer";
import { InputSystem } from "@fwge/input";
import { Environment } from "../entities/Environment";

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
                Environment
            ],
            systems: [
                InputSystem,
                ScriptSystem,
                EditorRenderSystem,
                ProjectRenderSystem,
            ]
        })
    }
}
