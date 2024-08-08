import { Shader } from "../shader/Shader"
import { RenderTarget } from "./RenderTarget"

interface IRenderPipelineStep
{
    name: string
    input?: string[]
    shader: Shader
    output: RenderTarget
}

export class RenderPipelineStep
{
    Name: string
    Shader: Shader
    Input: string[]
    Output: RenderTarget
 
    constructor(args: IRenderPipelineStep)
    {
        this.Input = args.input ?? []
        this.Name = args.name
        this.Output = args.output
        this.Shader = args.shader
    }
}
