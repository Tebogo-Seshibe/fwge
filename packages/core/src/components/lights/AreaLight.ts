import { ICubemap, Shader } from "../../base"
import { SkyboxTexture } from "../../base/image/SkyboxTexture"
import { StaticMesh } from "../mesh"
import { ILight, Light } from "./Light"

export interface IAreaLight extends ILight
{
    skyBox?: ICubemap    
}

export class AreaLight extends Light
{
    public Skybox: SkyboxTexture | null = null
    public readonly SkyboxShader: Shader = new Shader(
        `#version 300 es
        #pragma vscode_glsllint_stage: vert

        layout (location = 0) in vec3 A_Position;
        out vec3 V_UV;
        
        struct Matrix
        {
            mat4 View;
            mat4 Projection;
        };
        uniform Matrix U_Matrix;
        
        void main(void)
        {
            V_UV = A_Position;
            gl_Position = (U_Matrix.Projection * U_Matrix.View * vec4(A_Position, 1.0)).xyww;
        }
        `,
        `#version 300 es
        #pragma vscode_glsllint_stage: frag

        precision highp float;
        precision highp samplerCube;

        in vec3 V_UV;
        layout(location = 0) out vec4 O_FragColour;
        
        uniform samplerCube U_Skybox;
        void main(void)
        {
            O_FragColour.rgb = texture(U_Skybox, V_UV).rgb;
            O_FragColour.a = 1.0;
        }
        `
    )
    public readonly SkyboxMesh: StaticMesh = new StaticMesh(
    {
        position:
        [
            [-1.0,  1.0,  1.0],
            [-1.0, -1.0,  1.0],
            [ 1.0, -1.0,  1.0],
            [ 1.0,  1.0,  1.0],
            [ 1.0,  1.0,  1.0],
            [ 1.0, -1.0,  1.0],
            [ 1.0, -1.0, -1.0],
            [ 1.0,  1.0, -1.0],
            [ 1.0,  1.0, -1.0],
            [ 1.0, -1.0, -1.0],
            [-1.0, -1.0, -1.0],
            [-1.0,  1.0, -1.0],
            [-1.0,  1.0, -1.0],
            [-1.0, -1.0, -1.0],
            [-1.0, -1.0,  1.0],
            [-1.0,  1.0,  1.0],
            [-1.0,  1.0, -1.0],
            [-1.0,  1.0,  1.0],
            [ 1.0,  1.0,  1.0],
            [ 1.0,  1.0, -1.0],
            [-1.0, -1.0,  1.0],
            [-1.0, -1.0, -1.0],
            [ 1.0, -1.0, -1.0],
            [ 1.0, -1.0,  1.0],
        ],
        index:
        [
            0,  1,  2,  0,  2,  3,
            4,  5,  6,  4,  6,  7,
            8,  9, 10,  8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23,
        ]
    })

    constructor()
    constructor(light: IAreaLight)
    constructor(light: IAreaLight = { })
    {
        super(light.colour, light.intensity)

        if (light.skyBox)
        {
            this.Skybox = new SkyboxTexture(light.skyBox)
        }

        {   
            `
                [R] [G] [B] [intensity]
            `
        }
    }

    override Bind(shader: Shader, index: number = 0): void
    {
        shader.SetBufferData('AreaLight', this.BufferData, index * this.BufferData.length)

        if (this.Skybox)
        {
            shader.SetBool('HasAmbientEnvironmentMap', true)
            shader.SetTexture('AmbientEnvironmentMap', this.Skybox.Texture, false, true)
        }
        else
        {
            shader.SetBool('HasAmbientEnvironmentMap', false)
        }

        shader.SetFloatVector('U_AreaLight.Colour', this.Colour)
        shader.SetFloat('U_AreaLight.Intensity', this.Intensity)
    }
}
