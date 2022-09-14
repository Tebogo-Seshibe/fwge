import { GL, isPowerOf2 } from "@fwge/common"
import { ImageTexture, TextureFilter, WrapMode } from "./ImageTexture"

export interface IImage2D
{
    source?: string
    filtering?: TextureFilter
    wrapMode?: WrapMode
}
export class Image2D extends ImageTexture
{
    constructor()
    constructor(config: IImage2D)
    constructor(config: IImage2D = {})
    {
        super(config.filtering, config.wrapMode)
        
        if (config.source)
        {
            this.Load(config.source)
        }
        else
        {
            GL.bindTexture(GL.TEXTURE_2D, this.Texture)
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
            GL.bindTexture(GL.TEXTURE_2D, null)
        }
    }

    Load(source: string): void
    {
        const img = new Image()
        img.onload = () => this.applyImage(img)
        img.src = source 
    }

    protected applyImage(image: HTMLImageElement): void
    {
        GL.bindTexture(GL.TEXTURE_2D, this.Texture)
        // GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image.buffer())
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, image.width, image.height, 0, GL.RGBA, GL.UNSIGNED_BYTE, image.buffer())
    
        if (isPowerOf2(image.width) && isPowerOf2(image.height))
        {
            GL.generateMipmap(GL.TEXTURE_2D)

            switch (this.Filtering)
            {
                case TextureFilter.LINEAR:
                    // GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR)
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST)
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
                    break
                    
                case TextureFilter.NEAREST:
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST)
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST_MIPMAP_NEAREST)
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST)
                    break
            }
        }
        else
        {
            switch (this.Filtering)
            {
                case TextureFilter.LINEAR:
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
                    break
            
                case TextureFilter.NEAREST:
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST)
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST)
                    break
            }
        }
        
        switch (this.WrapMode)
        {
            case WrapMode.REPEAT:
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT)
                break

            case WrapMode.MIRRORD_REPEAT:
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.MIRRORED_REPEAT)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.MIRRORED_REPEAT)
                break

            case WrapMode.EDGE_CLAMP:
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
                break
        }

        GL.bindTexture(GL.TEXTURE_2D, null)
    }
}
