import { Game } from "../Game";
import { ImageAsset } from "./ImageAsset";

export interface ICubemap
{
    source: string
}

export class Cubemap extends ImageAsset
{
    constructor(config: ICubemap)
    {
        super([config.source])
        // this.BindDefaultImageData();
    }

    public Load(game: Game): void
    {
        const image = new Image()
        image.onload = () => this.applyImage(image, game.GL)
        image.src = this.Sources[0]
    }
    
    public Unload(): void
    {
        throw new Error("Method not implemented.");
    }

    public Destroy(): void
    {
        throw new Error("Method not implemented.");
    }

    protected applyImage(image: HTMLImageElement, GL: WebGL2RenderingContext): void
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