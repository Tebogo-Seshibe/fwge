import { ColourType, DepthType, RenderPipelineStep, RenderTarget, Shader } from "@fwge/core"

export class GammaCorrection extends RenderPipelineStep
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
    
                vec3 Gamma(vec3 colour)
                {
                    float gamma = 1.0/2.2;
                    colour.x = pow(colour.x, gamma);
                    colour.y = pow(colour.y, gamma);
                    colour.z = pow(colour.z, gamma);
                    return colour;
                }

                void main(void)
                {
                    vec4 colour = texture(U_${input}_Colour[0], V_UV);
                    O_FragColour.rgb = Gamma(colour.rgb);
                    O_FragColour.a = colour.a;
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
