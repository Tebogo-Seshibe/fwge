import { GL, isPowerOf2 } from "@fwge/common"
import { ImageTexture, TextureFilter, WrapMode } from "./ImageTexture"

export class Image2D extends ImageTexture
{
    constructor()
    {
        super()
    }

    Load(...sources: string[]): void
    {
        const img = new Image()
        img.onload = () => this.applyImage(img)
        img.src = sources[0] 
    }

    protected applyImage(image: HTMLImageElement, filtering: TextureFilter = TextureFilter.NEAREST, wrapMode: WrapMode = WrapMode.EDGE_CLAMP): void
    {
        GL.bindTexture(GL.TEXTURE_2D, this.Texture)
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image)
    
        if (isPowerOf2(image.width) && isPowerOf2(image.height))
        {
            GL.generateMipmap(GL.TEXTURE_2D)

            switch (filtering)
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
            switch (filtering)
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
        
        switch (wrapMode)
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
