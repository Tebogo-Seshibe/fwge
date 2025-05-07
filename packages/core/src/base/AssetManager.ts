import { Type } from "@fwge/ecs";
import { Asset } from "./Asset";

export class AssetManager
{
    private static readonly assets: Map<string, Asset> = new Map();

    public static Register(assetTypes: Type<Asset>[]): void
    {
        for (const assetType of assetTypes)
        {
            if (this.assets.has(assetType.name))
            {
                console.error(`Asset with name "${assetType.name}" already registered`);
                continue;
            }

            const asset = new assetType();
            this.assets.set(assetType.name, asset);
            asset.Reset();
        }
    }

    public static Unregister(assetTypes: Type<Asset>[]): void
    {
        for (const assetType of assetTypes)
        {
            const asset = this.Get(assetType);
            asset?.Unload();
            this.assets.delete(assetType.name);
        }
    }

    public static Get<T extends Asset>(assetType: Type<T>): T | undefined
    {
        return this.assets.get(assetType.name) as T;
    }

    public static Load(assetTypes: Type<Asset>[]): void
    {
        for (const assetType of assetTypes)
        {
            const asset = this.Get(assetType);
            asset?.Load();
        }
    }
    
    public static Unload(assetTypes: Type<Asset>[]): void
    {
        for (const assetType of assetTypes)
        {
            const asset = this.Get(assetType);
            asset?.Unload();
            asset?.Reset();
        }
    }
}