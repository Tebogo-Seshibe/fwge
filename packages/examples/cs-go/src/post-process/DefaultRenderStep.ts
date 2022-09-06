import { ColourType, DepthType, RenderPipelineStep, RenderTarget } from "@fwge/core"

export class DefaultRenderStep extends RenderPipelineStep
{
    constructor(width: number, height: number, output: string)
    {
        super(
        {
            name: output,
            output: new RenderTarget(
            { 
                colour: [ ColourType.UINT_RGBA ],
                depth: DepthType.INT24,
                height,
                width,
            }),
        })
    }
}
