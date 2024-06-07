import { DefaultWindow, Game, Scene } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { ProjectRenderSystem } from "../systems";
import { Camera } from "../entities/Camera";
import { Environment } from "../entities/Environment";

export class Scene1 extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [ DefaultWindow ],
            entities: [
                Camera,
                Environment
            ],
            systems: [
                InputSystem,
                // ProjectRenderSystem,
            ]
        })
    }
}
