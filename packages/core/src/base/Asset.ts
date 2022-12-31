import { Class } from "../ecs";

export type AssetType<T extends Asset = Asset> = Class<T>;

export class Asset
{
    public readonly Type: AssetType

    constructor()
    constructor(assetType: AssetType)
    constructor(type?: AssetType)
    {
        this.Type = type ?? new.target
    }

    Load(...sources: string[]): void { }
    Save(): void { }
}
