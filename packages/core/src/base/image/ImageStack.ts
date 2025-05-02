import { IImage2D } from "./Image2D";
import { ImageAsset } from "./ImageAsset";

export interface IImageStack extends Array<IImage2D> { }

export class ImageStack extends ImageAsset
{
    constructor(config: IImageStack)
    {
        super([])
    }
    
    public async Load(): Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    public async Unload(): Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    public async Destroy(): Promise<void>
    {
        throw new Error("Method not implemented.");
    }
}
