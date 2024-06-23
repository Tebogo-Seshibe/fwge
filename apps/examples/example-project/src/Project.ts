import { Game, type GameConfig } from "@fwge/core";
import { EditorScene, Scene1 } from "./scenes";

export class Project extends Game
{
    constructor() {
        super({
            scenes: [
                EditorScene,
                Scene1,
            ],
            startupScene: 0,
            height: 1080,
            width: 1920,
        })
    }
}