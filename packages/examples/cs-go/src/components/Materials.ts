import { Colour3, GL, Vector3 } from "@fwge/common"
import { BasicLitMaterial, IMaterial, Material, RenderType, Shader } from "@fwge/core"
import PrincipledBSDFVert from '/public/shaders/PrincipledBSDF.vert?raw'
import PrincipledBSDFFrag from '/public/shaders/PrincipledBSDF.frag?raw'

export const createBasicMaterial = () => new BasicLitMaterial(
{
    alpha: 1.0,
    shininess: 32,
    renderType: RenderType.TRANSPARENT,
    shader: new Shader(
        `#version 300 es

        layout(location = 0) in vec4 A_Position;
        layout(location = 1) in vec3 A_Normal;
        layout(location = 2) in vec2 A_UV;
        layout(location = 3) in vec4 A_Colour;
        layout(location = 4) in mat4 A_ModelViewMatrix;
        layout(location = 8) in mat3 A_NormalMatrix;

        out vec4 V_Position;
        out vec3 V_Normal;
        out vec2 V_UV;
        out vec4 V_Colour;

        struct Matrix
        {
            mat4 ModelView;
            mat4 View;
            mat4 Projection;
        };
        uniform Matrix U_Matrix;

        void passVertexData()
        {
            V_Position = U_Matrix.ModelView * A_Position;
            V_Normal = A_Normal;
            V_UV = A_UV;
            V_Colour = A_Colour;
        }
        
        void main(void)
        {
            passVertexData();
        
            gl_Position = U_Matrix.Projection * U_Matrix.View * V_Position;
        }
        `,
        
        `#version 300 es
        precision highp float;
        
        in vec4 V_Position;
        in vec3 V_Normal;
        in vec2 V_UV;
        in vec4 V_Colour;
        
        layout(location = 0) out vec4 O_FragColour;            
                            
        struct Material 
        {
            vec4 Ambient;
            vec4 Diffuse;
            vec4 Specular;
            float Shininess;
            float Alpha;

            bool HasImageMap;
            bool HasBumpMap;
        };

        uniform Material U_Material;

        void main(void)
        {
            O_FragColour = vec4(U_Material.Ambient.rgb, U_Material.Alpha);
        }
        `
    ),
})

interface IPrincipledBSDFMaterial extends IMaterial
{
    
    BaseColour?: string | Colour3 | Vector3 | [number, number, number]
    Subsurface?: string | number
    SubsurfaceColour?: string | Colour3 | Vector3 | [number, number, number]
    SubsurfaceRadius?: string | number
    SubsurfaceIOR?: string | number
    SubsurfaceAnisotropy?: string | number
    Metallic?: string | number
    Specular?: string | number
    SpecularTint?: string | number
    Roughness?: string | number    
    Anisotropic?: string | number
    AnisotropicRotation?: string | number
    Sheen?: string | number
    SheenTint?: string | number
    Clearcoat?: string | number
    ClearcoatRoughness?: string | number
    IOR?: string | number
    Transmission?: string | number
    TransmissionRoughness?: string | number
    Emission?: string | number
    EmissionRoughness?: string | number
    Alpha?: string | number    
    Normal?: string | Colour3 | Vector3 | [number, number, number]
    ClearcoatNormal?: string | Colour3 | Vector3 | [number, number, number]
    Tangent?: string | Colour3 | Vector3 | [number, number, number]
}

export const createPrincipledBSDFMaterial = () => new (class PrincipledBSDFMaterial extends Material
{
    readonly BaseColour: Colour3 = new Colour3(1.0)
    Subsurface: number = 0.0
    readonly SubsurfaceColour: Colour3 = new Colour3(0.0)
    SubsurfaceRadius: number = 0.0
    SubsurfaceIOR: number = 0.0
    SubsurfaceAnisotropy: number = 0.0
    Metallic: number = 0.0
    Specular: number = 0.0
    SpecularTint: number = 0.0
    Roughness: number     = 0.0
    Anisotropic: number = 0.0
    AnisotropicRotation: number = 0.0
    Sheen: number = 0.0
    SheenTint: number = 0.0
    Clearcoat: number = 0.0
    ClearcoatRoughness: number = 0.0
    IOR: number = 0.0
    Transmission: number = 0.0
    TransmissionRoughness: number = 0.0
    Emission: number = 0.0
    EmissionRoughness: number = 0.0
    Alpha: number     = 0.0
    readonly Normal: Colour3 = new Colour3(0.0)
    readonly ClearcoatNormal: Colour3 = new Colour3(0.0)
    readonly Tangent: Colour3 = new Colour3(0.0)
    
    set BaseColourMap(src: string | WebGLTexture | null)
    {
        GL.deleteTexture(this.Textures[0])

        if (src instanceof WebGLTexture)
        {
            this.Textures[0] = src
        }
        else if (src)
        {
            this.Textures[0] = GL.createTexture()!
            this.applyImage(this.Textures[0], src)
        }
        else 
        {
            this.Textures[0] = null
        }
    }
    
    set NormalMap(src: string | WebGLTexture | null)
    {
        GL.deleteTexture(this.Textures[1])

        if (src instanceof WebGLTexture)
        {
            this.Textures[1] = src
        }
        else if (src)
        {
            this.Textures[1] = GL.createTexture()!
            this.applyImage(this.Textures[1], src)
        }
        else 
        {
            this.Textures[1] = null
        }
    }

    Bind(): void
    {
        super.Bind()
        const shader = this.Shader
        
        if (this.Textures[0])
        {
            shader.SetTexture('U_Sampler.BaseColourMap', this.Textures[0])
            shader.SetBool('U_BSDF.HasBaseColourSampler', true)
        }
        else
        {
            shader.SetFloatVector('U_BSDF.BaseColour', this.BaseColour)
            shader.SetBool('U_BSDF.HasBaseColourSampler', false)
        }

        if (this.Textures[1])
        {
            shader.SetTexture('U_Sampler.NormalMap', this.Textures[1])
            shader.SetBool('U_BSDF.HasNormalSampler', true)
        }
        else
        {
            shader.SetFloatVector('U_BSDF.Normal', this.BaseColour)
            shader.SetBool('U_BSDF.HasNormalSampler', false)
        }
    }

    constructor(args: IPrincipledBSDFMaterial)
    {
        super(args.shader, args.renderType)

        if (args.BaseColour)
        {
            if (typeof args.BaseColour === 'string')
            {
                this.BaseColourMap = args.BaseColour
            }
            else
            {
                this.BaseColour.Set(args.BaseColour[0], args.BaseColour[1], args.BaseColour[2])
            }
        }

        if (args.Normal)
        {
            if (typeof args.Normal === 'string')
            {
                this.NormalMap = args.Normal
            }
            else
            {
                this.Normal.Set(args.Normal[0], args.Normal[1], args.Normal[2])
            }
        }
        console.log(this)
    }
})(
{
    shader: new Shader(PrincipledBSDFVert, PrincipledBSDFFrag),
    renderType: RenderType.OPAQUE,
    BaseColour: '/img/8k_earth_daymap.jpg',
    Normal: '/img/8k_earth_normal_map.png',
})