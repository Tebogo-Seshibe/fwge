import { IImage2D } from "./Image2D"
import { ImageAsset } from "./ImageAsset"

export interface IImageStack extends Array<IImage2D> { }

export class ImageStack extends ImageAsset
{
    constructor(config: IImageStack)
    {
        super()
    }
}
