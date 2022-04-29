import { Colour4, ShaderAsset } from "../base"
import { GL, isPowerOf2 } from "@fwge/common"
import { SharedComponent } from "@fwge/core"

interface IMaterial
{
    ambient?: Colour4 | [number, number, number, number]
    diffuse?: Colour4 | [number, number, number, number]
    specular?: Colour4 | [number, number, number, number]
    alpha?: number
    shininess?: number
    imagemap?: string
    normalmap?: string
    specularmap?: string
}

export class Material extends SharedComponent
{
    _ambient: Colour4 = new Colour4()
    _diffuse: Colour4 = new Colour4()
    _specular: Colour4 = new Colour4()
    _alpha: number
    _shininess: number
    _imageTexture: WebGLTexture | null = null
    _normalTexture: WebGLTexture | null = null
    _specularTexture: WebGLTexture | null = null
    _hasTransparency: boolean = false

    public Shader: ShaderAsset | null = null

    get HasTransparency(): boolean
    {
        return this._hasTransparency
    }

    get Ambient(): Colour4
    {
        return this._ambient
    }

    set Ambient(ambient: Colour4 | [number, number, number, number])
    {
        this._ambient = new Colour4(ambient[0], ambient[1], ambient[2], ambient[3])
    }

    get Diffuse(): Colour4
    {
        return this._diffuse
    }

    set Diffuse(diffuse: Colour4 | [number, number, number, number])
    {
        this._diffuse = new Colour4(diffuse[0], diffuse[1], diffuse[2], diffuse[3])
    }

    get Specular(): Colour4
    {
        return this._specular
    }

    set Specular(specular: Colour4 | [number, number, number, number])
    {
        this._specular = new Colour4(specular[0], specular[1], specular[2], specular[3])
    }

    get Alpha(): number
    {
        return this._alpha
    }

    set Alpha(alpha: number)
    {
        this._alpha = alpha
    }

    get Shininess(): number
    {
        return this._shininess
    }

    set Shininess(shininess: number)
    {
        this._shininess = shininess
    }

    get HasImageMap()
    {
        return this._imageTexture !== null
    }

    set ImageMap(src: string | null)
    {
        GL.deleteTexture(this._imageTexture)

        if (src)
        {
            this._hasTransparency = src.includes('.png')
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
        super()

        args.ambient = args.ambient ?? [0.50, 0.50, 0.50, 1.0]
        args.diffuse = args.diffuse ?? [0.65, 0.65, 0.65, 1.0]
        args.specular = args.specular ?? [0.75, 0.75, 0.75, 1.0]

        this._ambient.Set(args.ambient[0], args.ambient[1], args.ambient[2], args.ambient[3])
        this._diffuse.Set(args.diffuse[0], args.diffuse[1], args.diffuse[2], args.diffuse[3])
        this._specular.Set(args.specular[0], args.specular[1], args.specular[2], args.specular[3])
        this._alpha = args.alpha ?? 1.0
        this._shininess = args.shininess ?? 1.0

        this.ImageMap = args.imagemap ?? null
        this.NormalMap = args.normalmap ?? null
        this.SpecularMap = args.specularmap ?? null
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
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST)
            }
            else
            {
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
            }
    
            GL.bindTexture(GL.TEXTURE_2D, null);
        }
    
        img.src = src
    }
}
