import { Game, type GameConfig } from "@fwge/core";
import { EditorScene, ProjectScene } from "./scenes";

export class Project extends Game
{
    constructor(config: Omit<GameConfig, 'scenes' | 'startupScene'>) {
        super({
            ...config,
            scenes: [
                EditorScene,
                ProjectScene
            ],
            startupScene: 0
        })
    }
}