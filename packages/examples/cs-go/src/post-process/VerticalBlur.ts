import { ColourType, DepthType, RenderPipelineStep, RenderTarget, Shader } from "@fwge/core"

export class VerticalBlur extends RenderPipelineStep
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
                out vec2 V_Blur_Coords[11];
    
                uniform float U_Height;
                void main(void)
                {
                    gl_Position = vec4(A_Position, 0.0, 1.0);
                    V_UV = A_Position * 0.5 + 0.5;
                    
                    float pixelSize = 1.0 / U_Height;
                    for (int i = -5; i < 5; i++)
                    {
                        V_Blur_Coords[i + 5] = V_UV + vec2(0.0, pixelSize * float(i));
                    }
                }`,
                `#version 300 es
                #pragma vscode_glsllint_stage: frag
    
                precision highp float;
    
                in vec2 V_UV;
                in vec2 V_Blur_Coords[11];

                layout(location = 0) out vec4 O_FragColour;
    
                uniform sampler2D U_${input}_Colour[1];
    
                void main(void)
                {
                    O_FragColour = vec4(0.0);
                    O_FragColour += texture(U_${input}_Colour[0], V_Blur_Coords[0]) * 0.0093;
                    O_FragColour += texture(U_${input}_Colour[0], V_Blur_Coords[1]) * 0.028002;
                    O_FragColour += texture(U_${input}_Colour[0], V_Blur_Coords[2]) * 0.065984;
                    O_FragColour += texture(U_${input}_Colour[0], V_Blur_Coords[3]) * 0.121703;
                    O_FragColour += texture(U_${input}_Colour[0], V_Blur_Coords[4]) * 0.175713;
                    O_FragColour += texture(U_${input}_Colour[0], V_Blur_Coords[5]) * 0.198596;
                    O_FragColour += texture(U_${input}_Colour[0], V_Blur_Coords[6]) * 0.175713;
                    O_FragColour += texture(U_${input}_Colour[0], V_Blur_Coords[7]) * 0.121703;
                    O_FragColour += texture(U_${input}_Colour[0], V_Blur_Coords[8]) * 0.065984;
                    O_FragColour += texture(U_${input}_Colour[0], V_Blur_Coords[9]) * 0.028002;
                    O_FragColour += texture(U_${input}_Colour[0], V_Blur_Coords[10]) * 0.0093;
                }`
            ),
            output: new RenderTarget(
            { 
                colour: [ ColourType.UINT_RGBA ],
                depth: DepthType.NONE,
                height,
                width,
            })
        })
    }
}
