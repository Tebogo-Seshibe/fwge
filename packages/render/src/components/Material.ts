import { ShaderAsset } from "../base"
import { Colour3, Colour4, GL, isPowerOf2, Vector3 } from "@fwge/common"
import { SharedComponent } from "@fwge/core"

export enum BlendMode
{
    NONE,
    ADDITIVE,
    SUBTRACTIVE,
    MULTIPLICATIVE
}

// type Range<
//     Digits extends number,
//     Result extends Array<unknown> = []
// > = (Result['length'] extends Digits
//     ? Result
//     : Range<Digits, [...Result, Result['length']]>)

// type ColourUnitType = `0.${Range<999>[number]}` | '1.0'
// type ColourUnit<Value extends number> = `${Value}` extends ColourUnitType ? Value : never
// type NumberRange = Range<999>[number]


// type Between<
//     Min extends number, 
//     Max extends number
// > = Min > Max ? never : number;

// let a: ColourUnit<0.0>


interface IMaterial
{
    ambient?: [number, number, number, number]
    diffuse?: [number, number, number, number]
    specular?: [number, number, number, number]
    colour?: [number, number, number] | Colour3 | Vector3
    alpha?: number
    shininess?: number
    imagemap?: string
    normalmap?: string
    specularmap?: string
    shader?: ShaderAsset
}

export class Material extends SharedComponent
{
    readonly Ambient: Colour4
    readonly Diffuse: Colour4
    readonly Specular: Colour4
    readonly Colour: Colour3
    Alpha: number
    Shininess: number
    HasTransparency: boolean = false

    readonly Textures: WebGLTexture[] = new Array(16).fill(null)

    _imageTexture: WebGLTexture | null = null
    _normalTexture: WebGLTexture | null = null
    _specularTexture: WebGLTexture | null = null

    public Shader: ShaderAsset | null = null

    get HasImageMap()
    {
        return this._imageTexture !== null
    }

    set ImageMap(src: string | null | WebGLTexture)
    {
        GL.deleteTexture(this._imageTexture)

        if (src instanceof WebGLTexture)
        {
            this._imageTexture = src
        }
        else if (src)
        {
            this.HasTransparency = src.includes('.png') || src.includes('.tga')
            this._imageTexture = GL.createTexture()
            this._applyImage(this._imageTexture!, src)
        }
        else 
        {
            this._imageTexture = null
        }
    }

    set NormalMap(src: string | null)
    {
        GL.deleteTexture(this._normalTexture)

        if (src)
        {
            this._normalTexture = GL.createTexture()
            this._applyImage(this._normalTexture!, src)
        }
    }

    set SpecularMap(src: string | null)
    {
        GL.deleteTexture(this._specularTexture)

        if (src)
        {
            this._specularTexture = GL.createTexture()
            this._applyImage(this._specularTexture!, src)
        }
    }

    get ImageTexture(): WebGLTexture | null
    {
        return this._imageTexture
    }

    get NormalTexture(): WebGLTexture | null
    {
        return this._normalTexture
    }

    get SpecularTexture(): WebGLTexture | null
    {
        return this._specularTexture
    }

    constructor()
    constructor(material: IMaterial)
    constructor(args: IMaterial = { })
    {
        super(Material)

        args.ambient = args.ambient ?? [0.5, 0.5, 0.5, 1]
        args.diffuse = args.diffuse ?? [0.65, 0.65, 0.65, 1]
        args.specular = args.specular ?? [0.75, 0.75, 0.75, 1]
        args.colour = args.colour ?? [0.75, 0.75, 0.75]

        this.Ambient = new Colour4(args.ambient[0], args.ambient[1], args.ambient[2], args.ambient[3])
        this.Diffuse = new Colour4(args.diffuse[0], args.diffuse[1], args.diffuse[2], args.diffuse[3])
        this.Specular = new Colour4(args.specular[0], args.specular[1], args.specular[2], args.specular[3])
        this.Colour = new Colour3(args.specular[0], args.specular[1], args.specular[2])

        this.Alpha = args.alpha ?? 1.0
        this.Shininess = args.shininess ?? 1.0
        this.ImageMap = args.imagemap ?? null
        this.NormalMap = args.normalmap ?? null
        this.SpecularMap = args.specularmap ?? null
        this.Shader = args.shader ?? null
    }
    
    private _applyImage(texture: WebGLTexture, src: string): void
    {    
        GL.bindTexture(GL.TEXTURE_2D, texture)
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
    
        const img: HTMLImageElement = new Image()
        img.onload = () =>
        {
            GL.bindTexture(GL.TEXTURE_2D, texture)
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, img)
    
            if (isPowerOf2(img.width) && isPowerOf2(img.height))
            {
                GL.generateMipmap(GL.TEXTURE_2D)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
            }
            else
            {
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
            }
    
            GL.bindTexture(GL.TEXTURE_2D, null);
        }
    
        img.src = src
    }

    Bind(): void
    {
        this.Shader!.Bind()
        const shader = this.Shader!
        const material = this!
        
        GL.uniform4fv(this.Shader!.Material!.AmbientColour, this.Ambient)
        GL.uniform4fv(this.Shader!.Material!.DiffuseColour, this.Diffuse)
        GL.uniform4fv(this.Shader!.Material!.SpecularColour, this.Specular)
        GL.uniform1f(this.Shader!.Material!.Shininess, this.Shininess)
        GL.uniform1f(this.Shader!.Material!.Alpha, this.Alpha)   
        shader.SetFloatVector('U_Material.Colour', this.Colour)

        // for (let i = 0; i < this.Textures.length; ++i)
        // {
        //     const texture = this.Textures[i]
        //     if (texture)
        //     {
        //         GL.activeTexture(GL.TEXTURE0 + i)
        //         GL.bindTexture(GL.TEXTURE_2D, texture)
        //     }
        // }
        
        if (material.ImageTexture)
        {
            GL.activeTexture(GL.TEXTURE0)
            GL.bindTexture(GL.TEXTURE_2D, material.ImageTexture)
            GL.uniform1i(shader.Material!.HasImageMap, 1)
            GL.uniform1i(shader.Material!.ImageSampler, 0)
        }
        else
        {
            GL.uniform1i(shader.Material!.HasImageMap, 0)
            GL.activeTexture(GL.TEXTURE0)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }

        if (material.NormalTexture)
        {
            GL.activeTexture(GL.TEXTURE1)
            GL.bindTexture(GL.TEXTURE_2D, material.NormalTexture)
            GL.uniform1i(shader.Material!.BumpSampler, 0)
        }
        else
        {
            GL.activeTexture(GL.TEXTURE1)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }

        if (material.SpecularTexture)
        {
            GL.activeTexture(GL.TEXTURE2)
            GL.bindTexture(GL.TEXTURE_2D, material.SpecularTexture)
            GL.uniform1i(shader.Material!.SpecularSampler, 0)
        }
        else
        {
            GL.activeTexture(GL.TEXTURE2)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }

        // if (this.NormalTexture)
        // {
        //     GL.uniform1i(this.Shader!.Material!., 1)
        //     GL.activeTexture(GL.TEXTURE0)
        //     GL.bindTexture(GL.TEXTURE_2D, this.ImageTexture)
        // }
        // else
        // {
        //     GL.uniform1i(this.Shader!.Material!.HasImageMap, 0)
        // }

        if (!this.HasTransparency)
        {
            GL.disable(GL.BLEND)
        }
        else
        {
            GL.enable(GL.BLEND)
            GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA)
        }
    }

    UnBind(): void
    {
        // for (let i = 0; i < this.Textures.length; ++i)
        // {
        //     const texture = this.Textures[i]
        //     if (texture)
        //     {
        //         GL.activeTexture(GL.TEXTURE0 + i)
        //         GL.bindTexture(GL.TEXTURE_2D, null)
        //     }
        // }

        
        if (this.ImageTexture)
        {
            GL.activeTexture(GL.TEXTURE0)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }

        this.Shader!.UnBind()
    }
}
