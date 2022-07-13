import { Class, RegistryType } from "../ecs"

export interface IAssetLoader
{

}

export class Asset extends RegistryType
{
    constructor()
    constructor(assetType: Class<Asset>)
    constructor(type?: Class<Asset>)
    {
        super(new.target as Class<Asset>)
    }

    Load(source: IAssetLoader): void { }
    Save(): void { }
}
