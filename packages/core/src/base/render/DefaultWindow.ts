import { Scene } from "../Scene"
import { RenderWindow } from "./RenderWindow"

export class DefaultWindow extends RenderWindow
{
    constructor(scene: Scene)
    {
        super(scene, { resolution: [scene.Game.Width, scene.Game.Height] })
    }
}
