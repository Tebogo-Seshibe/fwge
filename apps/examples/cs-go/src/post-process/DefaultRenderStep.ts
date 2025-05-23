import { ColourType, DepthType, RenderPipelineStep, RenderTarget } from "@fwge/core"

export class DefaultRenderStep extends RenderPipelineStep
{
    constructor(width: number, height: number, output: string)
    {
        super(
        {
            name: output,
            shader: null!,
            output: new RenderTarget(
            { 
                colour: [ ColourType.BYTE_RGBA ],
                depth: DepthType.INT24,
                height,
                width,
            }),
        })
    }
}
