import { ColourType, DepthType, RenderPipelineStep, RenderTarget, Shader } from "@fwge/core"

export class Invert extends RenderPipelineStep
{
    constructor(width: number, height: number, input: string, output: string)
    {
        super(
        {
            name: output,
            input: [ input ],
            shader: new Shader(
                `#version 300 es
                #pragma vscode_glsllint_stage: vert
    
                layout(location = 0) in vec2 A_Position;

                out vec2 V_UV;
    
                void main(void)
                {
                    gl_Position = vec4(A_Position, 0.0, 1.0);
                    V_UV = A_Position * 0.5 + 0.5;
                }`,
                `#version 300 es
                #pragma vscode_glsllint_stage: frag
    
                precision highp float;
    
                in vec2 V_UV;

                layout(location = 0) out vec4 O_FragColour;
    
                uniform sampler2D U_${input}_Colour[1];
    
                void main(void)
                {
                    O_FragColour += 1.0 - texture(U_${input}_Colour[0], V_UV);
                }`
            ),
            output: new RenderTarget(
            { 
                colour: [ ColourType.BYTE_RGBA ],
                depth: DepthType.NONE,
                height,
                width,
            })
        })
    }
}
