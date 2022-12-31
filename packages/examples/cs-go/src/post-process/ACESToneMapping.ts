import { ColourType, DepthType, RenderPipelineStep, RenderTarget, Shader } from "@fwge/core"

export class ACESToneMapping extends RenderPipelineStep
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
    
                vec3 ACES(vec3 colour)
                {
                    const float slope = 12.0;
                    const float a = 2.51;
                    const float b = 0.03;
                    const float c = 2.43;
                    const float d = 0.59;
                    const float e = 0.14;

                    vec4 x = vec4(colour, (colour.r * 0.299) + (colour * 0.587) + (colour * 0.0114));
                    vec4 tonemap = clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
                    float t = x.a;
                    t = t * t / (slope + t);

                    return mix(tonemap.rgb, tonemap.aaa, t);
                }

                void main(void)
                {
                    vec4 colour = texture(U_${input}_Colour[0], V_UV);
                    O_FragColour.rgb = ACES(colour.rgb);
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
