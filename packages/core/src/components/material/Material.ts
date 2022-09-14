import { Shader } from "../../base/Shader"
import { Colour3, GL, isPowerOf2 } from "@fwge/common"
import { SharedComponent } from "../../ecs"
import { ImageTexture } from "../../base"

export enum BlendMode
{
    NONE,
    ADDITIVE,
    SUBTRACTIVE,
    MULTIPLICATIVE
}

export enum RenderType
{
    OPAQUE,
    TRANSPARENT,
    EMISSIVE
}

export interface IMaterial
{
    shader: Shader
    renderType?: RenderType
}

export class Material extends SharedComponent
{
    static Empty: WebGLTexture

    Shader: Shader
    RenderType: RenderType
    readonly Colour: Colour3 = new Colour3(0.8)
    readonly Textures: Array<WebGLTexture | null> = new Array(8).fill(null)
    readonly ImageTextures: Array<ImageTexture | null> = new Array(8).fill(null)

    constructor(shader: Shader, renderType?: RenderType)
    {
        super(Material)

        this.Shader = shader
        this.RenderType = renderType ?? RenderType.OPAQUE

        if (!Material.Empty)
        {
            Material.Empty = GL.createTexture()!
            GL.bindTexture(GL.TEXTURE_2D, Material.Empty)
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
            GL.generateMipmap(GL.TEXTURE_2D)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST_MIPMAP_NEAREST)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST)
            GL.bindTexture(GL.TEXTURE_2D, null)            
        }
    }
    
    protected applyImage(texture: WebGLTexture, src: string): void
    {    
        GL.bindTexture(GL.TEXTURE_2D, texture)
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
    
        const img: HTMLImageElement = new Image()
        img.onload = () =>
        {
            setTimeout(() =>
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
        
                GL.bindTexture(GL.TEXTURE_2D, null)
            })
        }
    
        img.src = src
    }

    Bind(): void
    {
        this.Shader!.Bind()

        if (this.RenderType === RenderType.OPAQUE)
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
        for (let i = 0; i < this.Textures.length; ++i)
        {
            const texture = this.Textures[i]
            if (texture)
            {
                GL.activeTexture(GL.TEXTURE0 + i)
                GL.bindTexture(GL.TEXTURE_2D, null)
            }
        }

        this.Shader!.UnBind()
    }
}
