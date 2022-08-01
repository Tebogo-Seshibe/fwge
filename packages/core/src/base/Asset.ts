import { Class, RegistryType } from "../ecs"

export class Asset extends RegistryType
{
    constructor()
    constructor(assetType: Class<Asset>)
    constructor(type?: Class<Asset>)
    {
        super(type)
    }

    Load(...sources: string[]): void { }
    Save(): void { }
}
