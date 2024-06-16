import { DefaultWindow, Game, Scene } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { EditorViewer } from "../entities/EditorViewer";
import { Environment } from "../entities/Environment";
import { ProjectRenderSystem } from "../systems";

export class Scene1 extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [ DefaultWindow ],
            entities: [
            ],
            sharedEntities: [
                { type: EditorViewer, name: 'EditorViewer' },
                { type: Environment, name: 'Environment' }
            ],
            systems: [
                InputSystem,
                // ProjectRenderSystem,
            ],
        })
    }
}
