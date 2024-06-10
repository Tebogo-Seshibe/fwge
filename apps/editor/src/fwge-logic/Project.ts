import { Game, type GameConfig } from "@fwge/core";
import { EditorScene, Scene1 } from "./scenes";

export class Project extends Game
{
    constructor(config: Omit<GameConfig, 'scenes' | 'startupScene'>) {
        super({
            ...config,
            scenes: [
                EditorScene,
                Scene1,
            ],
            startupScene: 0
        })
    }
}