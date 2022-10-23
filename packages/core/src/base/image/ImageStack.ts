import { IImage2D } from "./Image2D"
import { ImageTexture } from "./ImageTexture"

export interface IImageStack extends Array<IImage2D> { }

export class ImageStack extends ImageTexture
{
    constructor(config: IImageStack)
    {
        super()
    }
}
