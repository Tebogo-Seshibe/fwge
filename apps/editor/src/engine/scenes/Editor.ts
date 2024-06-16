import { DefaultWindow, Game, Scene, ScriptSystem } from "@fwge/core";
import { EditorRenderSystem, ProjectRenderSystem } from "../systems";
import { Grid } from "../entities/Grid";
import { EditorViewer } from "../entities/EditorViewer";
import { InputSystem } from "@fwge/input";
import { Environment } from "../entities/Environment";
import { GeneralAreaLight } from "../entities/GeneralAreaLight";
import { Sun } from "../entities/Sun";

export const EditorSceneId = 0;
export class EditorScene extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [ DefaultWindow ],
            entities: [
                Grid,
            ],
            sharedEntities: [
                { type: GeneralAreaLight, name: 'GeneralAreaLight' },
                { type: Sun, name: 'Sun' },
                { type: EditorViewer, name: 'EditorViewer' },
                { type: Environment, name: 'Environment' }
            ],
            systems: [
                InputSystem,
                ScriptSystem,
                // EditorRenderSystem,
                ProjectRenderSystem,
            ],
        })
    }
}
