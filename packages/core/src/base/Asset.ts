import { Class, Type } from "@fwge/ecs";

export class Asset
{
    public readonly Name: string;
    public readonly Type: Type<Asset>;

    constructor()
    constructor(name: string)
    constructor(assetType: Type<Asset>)
    constructor(name: string, assetType: Type<Asset>)
    constructor(name: Type<Asset> | string = 'Asset', assetType: Type<Asset> = new.target)
    {
        this.Type = typeof name === 'string'
            ? assetType
            : name;

        this.Name = typeof name === 'string'
            ? name
            : 'Asset';
    }

    Load(...sources: string[]): void { }
    Save(): void { }
}
