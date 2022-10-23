import { Colour3, GL, Vector3, Vector3Array } from "@fwge/common"
import { Shader } from "../../base"
import { Image2D } from "../../base/image"
import { IMaterial, Material } from "./Material"

export interface IBasicLitMaterial extends IMaterial
{
    textures?: string[]
    colour?: [number, number, number] | Colour3 | Vector3
    alpha?: number
    shininess?: number
    
    ambient?: [number, number, number] | Colour3 | Vector3
    diffuse?: [number, number, number] | Colour3 | Vector3
    specular?: [number, number, number] | Colour3 | Vector3

    imagemap?: string
    specularmap?: string
    normalmap?: string

    projectShadows?: boolean
    receiveShadows?: boolean
}

export class BasicLitMaterial extends Material
{
    Shininess: number = 32
    HasTransparency: boolean = false
    readonly Ambient: Colour3 = new Colour3(0.30)
    readonly Diffuse: Colour3 = new Colour3(0.75)
    readonly Specular: Colour3 = new Colour3(1.00)

    AmbientTexture: Image2D = new Image2D()

    get HasImageMap()
    {
        return this.Textures[0] !== null
    }

    set ImageMap(src: string | null | WebGLTexture)
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
            this.AmbientTexture.Load(src)
        }
        else 
        {
            this.Textures[0] = null
        }
    }

    set NormalMap(src: string | null | WebGLTexture)
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

    set SpecularMap(src: string | null | WebGLTexture)
    {
        GL.deleteTexture(this.Textures[2])
        
        if (src instanceof WebGLTexture)
        {
            this.Textures[2] = src
        }
        else if (src)
        {
            this.Textures[2] = GL.createTexture()!
            this.applyImage(this.Textures[2], src)
        }
        else 
        {
            this.Textures[2] = null
        }
    }

    get ImageTexture(): WebGLTexture | null
    {
        return this.Textures[0]
    }

    get NormalTexture(): WebGLTexture | null
    {
        return this.Textures[1]
    }

    get SpecularTexture(): WebGLTexture | null
    {
        return this.Textures[2]
    }

    constructor(args: IBasicLitMaterial)
    {
        super(args.shader, args.renderType)

        if (args.ambient)
        {
            this.Ambient.Set(args.ambient[0], args.ambient[1], args.ambient[2])
        }

        if (args.diffuse)
        {
            this.Diffuse.Set(args.diffuse[0], args.diffuse[1], args.diffuse[2])
        }
        
        if (args.specular)
        {
            this.Specular.Set(args.specular[0], args.specular[1], args.specular[2])
        }

        if (args.colour)
        {
            this.Colour.Set(args.colour as Vector3Array)
        }

        this.Alpha = args.alpha ?? 1.0
        this.Shininess = args.shininess ?? 32
        this.ImageMap = args.imagemap ?? null
        this.NormalMap = args.normalmap ?? null
        this.SpecularMap = args.specularmap ?? null
        this.ReceiveShadows = args.receiveShadows ?? true
        this.ProjectsShadows = args.projectShadows ?? true
    }

    Bind(): void
    Bind(shader: Shader): void
    Bind(shader: Shader = this.Shader): void
    {
        shader.SetFloat(`U_Material.Shininess`, this.Shininess)
        shader.SetFloat(`U_Material.Alpha`, this.Alpha)
        shader.SetBool(`U_Material.ReceiveShadows`, this.ReceiveShadows)
        shader.SetFloatVector('U_Material.Ambient', this.Ambient)
        shader.SetFloatVector('U_Material.Diffuse', this.Diffuse)
        shader.SetFloatVector('U_Material.Specular', this.Specular)
        shader.SetFloatVector('U_Material.Colour', this.Colour)

        if (this.Textures[0])
        {
            // shader.SetTexture('U_Sampler.Image', this.Textures[0])
            shader.SetTexture('U_Sampler.Image', this.AmbientTexture.Texture)
        }
        else
        {
            shader.SetTexture('U_Sampler.Image', Material.Empty)
        }

        if (this.Textures[1])
        {
            shader.SetTexture('U_Sampler.Bump', this.Textures[1])
        }
        else
        {
            shader.SetTexture('U_Sampler.Bump', Material.Empty)
        }

        if (this.Textures[2])
        {
            shader.SetTexture('U_Sampler.Shadow', this.Textures[2])
        }
        else
        {
            shader.SetTexture('U_Sampler.Shadow', Material.Empty)
        }       
    }
}