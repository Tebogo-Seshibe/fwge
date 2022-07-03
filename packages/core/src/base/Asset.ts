import { AssetId, Class, nextId, RegistryType, TypeId } from "../ecs"

export class Asset extends RegistryType
{
    constructor()
    constructor(assetType: Class<Asset>)
    constructor(type?: Class<Asset>)
    {
        super(new.target as Class<Asset>)
    }
}