import { Colour4 } from "../base"
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
    #ambient!: Colour4
    #diffuse!: Colour4
    #specular!: Colour4
    #alpha!: number
    #shininess!: number
    #imageTexture: WebGLTexture | null = null
    #normalTexture: WebGLTexture | null = null
    #specularTexture: WebGLTexture | null = null

    get Ambient(): Colour4
    {
        return this.#ambient
    }

    set Ambient(ambient: Colour4 | [number, number, number, number])
    {
        this.#ambient = new Colour4(ambient[0], ambient[1], ambient[2], ambient[3])
    }

    get Diffuse(): Colour4
    {
        return this.#diffuse
    }

    set Diffuse(diffuse: Colour4 | [number, number, number, number])
    {
        this.#diffuse = new Colour4(diffuse[0], diffuse[1], diffuse[2], diffuse[3])
    }

    get Specular(): Colour4
    {
        return this.#specular
    }

    set Specular(specular: Colour4 | [number, number, number, number])
    {
        this.#specular = new Colour4(specular[0], specular[1], specular[2], specular[3])
    }

    get Alpha(): number
    {
        return this.#alpha
    }

    set Alpha(alpha: number)
    {
        this.#alpha = alpha
    }

    get Shininess(): number
    {
        return this.#shininess
    }

    set Shininess(shininess: number)
    {
        this.#shininess = shininess
    }

    get HasImageMap()
    {
        return this.#imageTexture !== null
    }

    set ImageMap(src: string | null)
    {
        GL.deleteTexture(this.#imageTexture)

        if (src)
        {
            this.#imageTexture = GL.createTexture()
            ApplyImage(this.#imageTexture!, src)
        }
        else 
        {
            this.#imageTexture = null
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

    get ImageTexture(): WebGLTexture | null
    {
        return this.#imageTexture
    }

    get NormalTexture(): WebGLTexture | null
    {
        return this.#normalTexture
    }

    get SpecularTexture(): WebGLTexture | null
    {
        return this.#specularTexture
    }

    constructor()
    constructor(material: IMaterial)
    constructor(args: IMaterial = { })
    {
        super()

        this.Ambient = args.ambient ?? new Colour4(0.50, 0.50, 0.50, 1.0)
        this.Diffuse = args.diffuse ?? new Colour4(0.65, 0.65, 0.65, 1.0)
        this.Specular = args.specular ?? new Colour4(0.75, 0.75, 0.75, 1.0)
        this.Alpha = args.alpha ?? 1.0
        this.Shininess = args.shininess ?? 1.0
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
