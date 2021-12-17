import { isPowerOf2 } from "../atoms/helpers/Math"
import { Colour4 } from "../colour/Colour4"
import { Component } from "../ecs/Component"
import { GL } from "../ecs/Game"

export enum ImageMapType
{
    TEXTURE,
    NORMAL,
    SPECULAR
}

interface IMaterial
{
    ambient: Colour4
    diffuse: Colour4
    specular: Colour4
    alpha: number
    shininess: number
    imagemap?: string
    normalmap?: string
    specularmap?: string
}

export class Material extends Component
{
    public Ambient: Colour4
    public Diffuse: Colour4
    public Specular: Colour4
    public Alpha: number
    public Shininess: number

    public set ImageMap(src: string | null)
    {
        GL.deleteTexture(this._imageTexture)

        if (src)
        {
            this._imageTexture = GL.createTexture()
            ApplyImage(this._imageTexture!, src)
        }
    }
    public set NormalMap(src: string | null)
    {
        GL.deleteTexture(this._normalTexture)

        if (src)
        {
            this._normalTexture = GL.createTexture()
            ApplyImage(this._normalTexture!, src)
        }
    }
    public set SpecularMap(src: string | null)
    {
        GL.deleteTexture(this._specularTexture)

        if (src)
        {
            this._specularTexture = GL.createTexture()
            ApplyImage(this._specularTexture!, src)
        }
    }

    private _imageTexture: WebGLTexture | null = null
    public get ImageTexture(): WebGLTexture | null
    {
        return this._imageTexture
    }
    private _normalTexture: WebGLTexture | null = null
    public get NormalTexture(): WebGLTexture | null
    {
        return this._normalTexture
    }
    private _specularTexture: WebGLTexture | null = null
    public get SpecularTexture(): WebGLTexture | null
    {
        return this._specularTexture
    }

    constructor(args: IMaterial)
    {
        super(Material)

        const {
            ambient = new Colour4(0.50, 0.50, 0.50, 1.0),
            diffuse = new Colour4(0.65, 0.65, 0.65, 1.0),
            specular = new Colour4(0.75, 0.75, 0.75, 1.0),
            alpha = 1.0,
            shininess = 32.0,
            imagemap, normalmap, specularmap
        } = args

        this.Ambient = ambient
        this.Diffuse = diffuse
        this.Specular = specular

        this.Alpha = alpha
        this.Shininess = shininess

        this.ImageMap = imagemap ?? null
        this.NormalMap = normalmap ?? null
        this.SpecularMap = specularmap ?? null
    }

}

function ApplyImage(texture: WebGLTexture, src: string): void
{
    const img: HTMLImageElement = new Image()

    GL.bindTexture(GL.TEXTURE_2D, texture);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));

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

        GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
        GL.bindTexture(GL.TEXTURE_2D, null);
    }

    img.src = src
}