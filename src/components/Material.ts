import { isPowerOf2 } from "../atoms/helpers/Math"
import { Colour4 } from "../atoms"
import { Component } from "../ecs/Component"
import { GL } from "../ecs/GL"

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
    Ambient: Colour4
    Diffuse: Colour4
    Specular: Colour4
    Alpha: number
    Shininess: number

    set ImageMap(src: string | null)
    {
        GL.deleteTexture(this.#imageTexture)

        if (src)
        {
            this.#imageTexture = GL.createTexture()
            ApplyImage(this.#imageTexture!, src)
        }
    }

    set NormalMap(src: string | null)
    {
        GL.deleteTexture(this.#normalTexture)

        if (src)
        {
            this.#normalTexture = GL.createTexture()
            ApplyImage(this.#normalTexture!, src)
        }
    }

    set SpecularMap(src: string | null)
    {
        GL.deleteTexture(this.#specularTexture)

        if (src)
        {
            this.#specularTexture = GL.createTexture()
            ApplyImage(this.#specularTexture!, src)
        }
    }

    #imageTexture: WebGLTexture | null = null
    get ImageTexture(): WebGLTexture | null
    {
        return this.#imageTexture
    }

    #normalTexture: WebGLTexture | null = null
    get NormalTexture(): WebGLTexture | null
    {
        return this.#normalTexture
    }

    #specularTexture: WebGLTexture | null = null
    get SpecularTexture(): WebGLTexture | null
    {
        return this.#specularTexture
    }

    constructor()
    constructor(material: IMaterial)
    constructor(args: IMaterial =
    {
        ambient: new Colour4(0.50, 0.50, 0.50, 1.0),
        diffuse: new Colour4(0.65, 0.65, 0.65, 1.0),
        specular: new Colour4(0.75, 0.75, 0.75, 1.0),
        alpha: 1.0,
        shininess: 1.0
    })
    {
        super()

        this.Ambient = args.ambient
        this.Diffuse = args.diffuse
        this.Specular = args.specular
        this.Alpha = args.alpha
        this.Shininess = args.shininess
        this.ImageMap = args.imagemap ?? null
        this.NormalMap = args.normalmap ?? null
        this.SpecularMap = args.specularmap ?? null
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