import { Class, Type } from "@fwge/ecs";

export class Asset
{
    public readonly Type: Class<Asset>;

    constructor()
    constructor(assetType: Type<Asset>)
    constructor(assetType: Type<Asset> = new.target)
    {
        this.Type = assetType as Class<Asset>;
    }

    Load(...sources: string[]): void { }
    Save(): void { }
}
