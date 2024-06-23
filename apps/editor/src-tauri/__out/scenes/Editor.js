import { DefaultWindow, Scene, ScriptSystem } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { EditorViewer } from "../entities/EditorViewer";
import { Environment } from "../entities/Environment";
import { GeneralAreaLight } from "../entities/GeneralAreaLight";
import { Sun } from "../entities/Sun";
import { ProjectRenderSystem } from "../systems";
export const EditorSceneId = 0;
export class EditorScene extends Scene {
    constructor(game) {
        super(game, {
            windows: [DefaultWindow],
            entities: [
            // Grid,
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
        });
    }
}
