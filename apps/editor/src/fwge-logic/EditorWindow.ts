import { RenderPipelineMode, RenderWindow, Scene } from "@fwge/core";

export class EditorWindow extends RenderWindow
{
    constructor(scene: Scene)
    {
        super(scene, {
            resolution: [scene.Game.Width, scene.Game.Height],
            renderPipelineMode: RenderPipelineMode.FORWARD
        });
    }
}
