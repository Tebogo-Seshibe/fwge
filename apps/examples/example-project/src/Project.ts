import { Game } from "@fwge/core";
import { EditorScene, Scene1 } from "./scenes";

export class Project extends Game
{
    constructor() {
        super({
            height: 1080,
            width: 1920,
            canvas() {
                return document.getElementsByTagName('canvas')[0];
            },
            scenes: [
                EditorScene,
                Scene1
            ]
        })
    }
}