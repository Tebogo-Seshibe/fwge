import { Constructor, Type} from "@fwge/ecs";
import { Asset } from "./Asset";

export class AssetManager
{
    private static readonly assets: Map<string, Asset> = new Map();

    public static Register(assetTypes: Type<Asset>[]): void
    {
        for (let i = 0; i < assetTypes.length; ++i)
        {
            const assetType = assetTypes[i];
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
        for (let i = 0; i < assetTypes.length; ++i)
        {
            const assetType = assetTypes[i];
            const asset = this.Get(assetTypes[i]);
            if (!asset)
            {
                throw `Asset with name "${assetType.name}" not found`;
            }

            asset.Unload();
            this.assets.delete(assetType.name);
        }
    }

    public static Get<T extends Asset>(assetType: Type<T>): T
    {
        const asset = this.assets.get(assetType.name);

        if (!asset)
        {
            throw `Asset with name "${assetType.name}" not found`;
        }

        return asset as T;
    }

    public static Load(assetTypes: Type<Asset>[]): void
    {
        for (let i = 0; i < assetTypes.length; ++i)
        {
            const asset = this.Get(assetTypes[i]);
            asset.Load();
        }
    }
    
    public static Unload(assetTypes: Type<Asset>[]): void
    {
        for (let i = 0; i < assetTypes.length; ++i)
        {
            const asset = this.Get(assetTypes[i]);
            asset.Unload();
            asset.Reset();
        }
    }
}