import { Class, RegistryType } from "../ecs"

export class Asset
{
    public readonly Type: Class<Asset>

    constructor()
    constructor(assetType: Class<Asset>)
    constructor(type?: Class<Asset>)
    {
        this.Type = type ?? new.target
    }

    Load(...sources: string[]): void { }
    Save(): void { }
}
