import { Colour3, Vector3, Vector3Array } from "@fwge/common";
import { Game, ImageAsset, Shader } from "../../base";
import { IMaterial, Material } from "./Material";

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
    normalmap?: string
    specularmap?: string

    projectShadows?: boolean
    receiveShadows?: boolean
}

export class BasicLitMaterial extends Material
{
    static ShaderContent = `
    uniform BasicLitMaterial
    {
        vec3 Colour;
        float Shininess;
        float Alpha;
    
        vec3 Ambient;
        vec3 Diffuse;
        vec3 Specular;
    
        bool HasImageMap;
        bool HasBumpMap;
        bool ReceiveShadows;
    } basicLitMaterial;`

    Shininess: number = 32
    HasTransparency: boolean = false
    readonly Ambient: Colour3 = new Colour3(0.30, 0.30, 0.30)
    readonly Diffuse: Colour3 = new Colour3(0.75, 0.75, 0.75)
    readonly Specular: Colour3 = new Colour3(1.00, 1.00, 1.00)

    // AmbientTexture: Image2D = new Image2D()

    get HasImageMap()
    {
        return this.Textures[0] !== null
    }

    // set ImageMap(src: string | null | WebGLTexture)
    // {
    //     GL.deleteTexture(this.Textures[0])

    //     if (src instanceof WebGLTexture)
    //     {
    //         this.Textures[0] = src
    //     }
    //     else if (src)
    //     {
    //         this.Textures[0] = GL.createTexture()!
    //         this.applyImage(this.Textures[0], src)
    //         this.AmbientTexture.Load(src)
    //     }
    //     else 
    //     {
    //         this.Textures[0] = null
    //     }
    // }

    // set NormalMap(src: string | null | WebGLTexture)
    // {
    //     GL.deleteTexture(this.Textures[1])
        
    //     if (src instanceof WebGLTexture)
    //     {
    //         this.Textures[1] = src
    //     }
    //     else if (src)
    //     {
    //         this.Textures[1] = GL.createTexture()!
    //         this.applyImage(this.Textures[1], src)
    //     }
    //     else 
    //     {
    //         this.Textures[1] = null
    //     }
    // }

    // set SpecularMap(src: string | null | WebGLTexture)
    // {
    //     GL.deleteTexture(this.Textures[2])
        
    //     if (src instanceof WebGLTexture)
    //     {
    //         this.Textures[2] = src
    //     }
    //     else if (src)
    //     {
    //         this.Textures[2] = GL.createTexture()!
    //         this.applyImage(this.Textures[2], src)
    //     }
    //     else 
    //     {
    //         this.Textures[2] = null
    //     }
    // }

    get ImageTexture(): WebGLTexture | null
    {
        return this.ImageTextures[0]?.Loaded
            ? this.ImageTextures[0].Texture
            : ImageAsset.EmptyTexture
    }

    get NormalTexture(): WebGLTexture | null
    {
        return this.ImageTextures[1]?.Loaded
            ? this.ImageTextures[1].Texture
            : ImageAsset.EmptyTexture
    }

    get SpecularTexture(): WebGLTexture | null
    {
        return this.ImageTextures[2]?.Loaded
            ? this.ImageTextures[2].Texture
            : ImageAsset.EmptyTexture
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
        
        if (args.imagemap) {
            this.ImageTextures[0] = new ImageAsset([args.imagemap]);
        }
        if (args.normalmap) {
            this.ImageTextures[1] = new ImageAsset([args.normalmap]);
        }
        if (args.specularmap) {
            this.ImageTextures[2] = new ImageAsset([args.specularmap]);
        }
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
            shader.SetTexture('U_Sampler.Image', this.Textures[0])
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

    BindBlock(): void
    BindBlock(shader: Shader): void
    BindBlock(shader: Shader, block: string, push: boolean): void
    BindBlock(shader: Shader = this.Shader, block = 'BasicLitMaterial', push: boolean = true): void
    {
        shader.SetBufferDataField(block, 'Colour', this.Colour);
        shader.SetBufferDataField(block, 'Shininess', this.Shininess);
        shader.SetBufferDataField(block, 'Alpha', this.Alpha);
        shader.SetBufferDataField(block, 'Ambient', this.Ambient);
        shader.SetBufferDataField(block, 'Diffuse', this.Diffuse);
        shader.SetBufferDataField(block, 'Specular', this.Specular);
        // shader.SetBufferDataField(block, 'HasImageMap', this.ImageMap ? 1 : 0);
        // shader.SetBufferDataField(block, 'HasBumpMap', this.NormalMap ? 1 : 0);
        shader.SetBufferDataField(block, 'ReceiveShadows', this.ReceiveShadows ? 1 : 0);

        if (push)
        {
            shader.PushBufferData(block);
        }
        
        if (this.Textures[0])
        {
            shader.SetTexture('U_Sampler.Image', this.Textures[0]);
        }
        else
        {
            shader.SetTexture('U_Sampler.Image', Material.Empty);
        }

        if (this.Textures[1])
        {
            shader.SetTexture('U_Sampler.Bump', this.Textures[1]);
        }
        else
        {
            shader.SetTexture('U_Sampler.Bump', Material.Empty);
        }

        if (this.Textures[2])
        {
            shader.SetTexture('U_Sampler.Shadow', this.Textures[2]);
        }
        else
        {
            shader.SetTexture('U_Sampler.Shadow', Material.Empty);
        }
    }
}