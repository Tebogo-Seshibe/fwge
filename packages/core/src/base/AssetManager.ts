import { Class, Constructor, Type } from "@fwge/ecs";
import { Asset } from "./Asset";
import { Args } from "./Game";

export type AssetRegister =  
    Type<Asset> |
    Asset |
    { title: string, asset: Type<Asset> } |
    { title: string, asset: Asset };

export class AssetManager
{
    static readonly assets: Map<string, Asset> = new Map();

    public static Example<T extends Asset, U extends any[]>(name: string, type: Constructor<T, U>, ...args: U)
    {
        const asset = new type(...args);
        this.assets.set(name, asset);
    }

    public static Register(...assetTypes: AssetRegister[]): void
    {
        for (const item of assetTypes)
        {
            let name: string;
            let asset: Asset;

            if ('title' in item)
            {
                name = item.title;
                asset = item.asset instanceof Asset
                    ? item.asset
                    : new item.asset();
            }
            else if (item instanceof Asset)
            {
                name = item.Type.name;
                asset = item;
            }
            else
            {
                name = item.name;
                asset = new item();
            }
            
            if (this.assets.has(name))
            {
                console.error(`Asset with name "${name}" already registered`);
                continue;
            }
            
            this.assets.set(name, asset);
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

    public static Get<T extends Asset>(assetType: Type<T> | string): T | undefined
    {
        const name = typeof assetType === 'string'
            ? assetType
            : assetType.name;
            
        return this.assets.get(name) as T;
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
