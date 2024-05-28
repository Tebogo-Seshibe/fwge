import { DefaultWindow, Game, Scene } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { ProjectRenderSystem } from "../systems";

export const ProjectSceneId = 1;
export class ProjectScene extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            windows: [ DefaultWindow ],
            entities: [
            ],    
            systems: [
                InputSystem,
                ProjectRenderSystem
            ]
        })
    }
}
