import { DefaultWindow, Game, Scene } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { EditorWindow } from "../EditorWindow";
import { FPSController } from "../entities";

export class ProjectScene extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [ DefaultWindow ],
            entities: [
                FPSController
            ],    
            systems: [
                InputSystem
                // EditorRenderSystem,
            ]
        })
    }
}
