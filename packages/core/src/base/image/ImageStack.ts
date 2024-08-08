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
    
    public Load(game: Game): void
    {
        throw new Error("Method not implemented.");
    }

    public Unload(game: Game): void
    {
        throw new Error("Method not implemented.");
    }

    public Destroy(game: Game): void
    {
        throw new Error("Method not implemented.");
    }
}
