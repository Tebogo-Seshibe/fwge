import { GL } from "@fwge/common";
import type { System } from "@fwge/ecs";

export class EditorRenderSystem implements System
{
    Init(): void{ }
    Start(): void { }
    Stop(): void { }

    Update(_: number)
    {
        GL.enable(GL.DEPTH_TEST);
        GL.enable(GL.CULL_FACE);
        GL.cullFace(GL.BACK);
        GL.depthMask(true);
        

        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        GL.clearColor(1, 0, 0, 1);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    }
}
