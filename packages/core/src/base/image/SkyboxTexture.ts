import { GL } from "@fwge/common"
import { ImageTexture } from "./ImageTexture"

export interface ISkyboxTexture
{
    source: string
}

export class SkyboxTexture extends ImageTexture
{
    constructor(config: ISkyboxTexture)
    {
        super()

        if (config.source)
        {
            this.Load(config.source)
        }
        else
        {
            GL.bindTexture(GL.TEXTURE_2D, this.Texture)
            for (let i = 0; i < 6; ++i)
            {
                GL.texImage2D(GL.TEXTURE_CUBE_MAP_POSITIVE_X, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]))
            }
            GL.bindTexture(GL.TEXTURE_2D, null)
        }

    }

    Load(source: string): void
    {
        const image = new Image()
        image.onload = () => this.applyImage(image)
        image.src = source
    }

    protected applyImage(image: HTMLImageElement): void
    {
        const size = image.height / 3

        GL.bindTexture(GL.TEXTURE_CUBE_MAP, this.Texture)

        GL.texImage2D(GL.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, GL.RGBA, size, size, 0, GL.RGBA, GL.UNSIGNED_BYTE, image.buffer(size, 0, size, size))
        GL.texImage2D(GL.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, GL.RGBA, size, size, 0, GL.RGBA, GL.UNSIGNED_BYTE, image.buffer(size, size * 2, size, size))
        GL.texImage2D(GL.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, GL.RGBA, size, size, 0, GL.RGBA, GL.UNSIGNED_BYTE, image.buffer(0, size, size, size))
        GL.texImage2D(GL.TEXTURE_CUBE_MAP_POSITIVE_X, 0, GL.RGBA, size, size, 0, GL.RGBA, GL.UNSIGNED_BYTE, image.buffer(size * 2, size, size, size))
        GL.texImage2D(GL.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, GL.RGBA, size, size, 0, GL.RGBA, GL.UNSIGNED_BYTE, image.buffer(size, size, size, size))
        GL.texImage2D(GL.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, GL.RGBA, size, size, 0, GL.RGBA, GL.UNSIGNED_BYTE, image.buffer(size * 3, size, size, size))

        GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MIN_FILTER, GL.LINEAR)            
        GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
        GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
        GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
        GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_R, GL.CLAMP_TO_EDGE)

        GL.bindTexture(GL.TEXTURE_CUBE_MAP, null)
    }
}