import { Type } from "@fwge/ecs";

export class Asset
{
    public readonly Type: Type<Asset>;

    constructor()
    constructor(assetType: Type<Asset>)
    constructor(assetType: Type<Asset> = new.target)
    {
        this.Type = assetType;
    }

    Load(): void 
    {
        throw new Error("Method not overriden");
    }

    Unload(): void 
    {
        throw new Error("Method not overriden");
    }
    
    Destroy(): void
    {
        throw new Error("Method not overriden");
    }
}
