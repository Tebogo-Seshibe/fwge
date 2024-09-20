import { Game } from "../Game";
import { IImage2D } from "./Image2D"
import { ImageAsset } from "./ImageAsset"

export interface IImageStack extends Array<IImage2D> { }

export class ImageStack extends ImageAsset
{
    constructor(config: IImageStack)
    {
        super([])
    }
    
    public async Load(game: Game): Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    public async Unload(game: Game): Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    public async Destroy(game: Game): Promise<void>
    {
        throw new Error("Method not implemented.");
    }
}
