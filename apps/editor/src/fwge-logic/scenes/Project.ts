import { Game, Scene } from "@fwge/core";
import { EditorWindow } from "../EditorWindow";
import { EditorRenderSystem } from "../systems";
import { FPSController } from "../entities";

export class ProjectScene extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [ EditorWindow ],
            entities: [
                FPSController
            ],    
            systems: [
                EditorRenderSystem,
            ]
        })
    }
}
