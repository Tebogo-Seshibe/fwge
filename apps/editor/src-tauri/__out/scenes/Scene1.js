import { DefaultWindow, Scene } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { EditorViewer } from "../entities/EditorViewer";
import { Environment } from "../entities/Environment";
import { Sun } from "../entities/Sun";
import { GeneralAreaLight } from "../entities/GeneralAreaLight";
export class Scene1 extends Scene {
    constructor(game) {
        super(game, {
            windows: [DefaultWindow],
            entities: [],
            sharedEntities: [
                { type: GeneralAreaLight, name: 'GeneralAreaLight' },
                { type: EditorViewer, name: 'EditorViewer' },
                { type: Sun, name: 'Sun' },
                { type: Environment, name: 'Environment' }
            ],
            systems: [
                InputSystem,
                // ProjectRenderSystem,
            ],
        });
    }
}
