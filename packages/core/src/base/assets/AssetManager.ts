import { Asset } from "./Asset";

export class AssetManager 
{
    static assetMap: Map<string, Asset> = new Map();
    
    static RegisterAsset<T extends Asset>(name: string, asset: T): boolean
    {
        if (this.assetMap.has(name))
        {
            return false;
        }

        this.assetMap.set(name, asset);
        return true;
    }

    
    static LoadAsset(name: string): boolean
    {
        const asset = this.assetMap.get(name);

        if (!asset)
        {
            return false;
        }

        asset.Load();
        return true;
    }

    static GetAsset<T extends Asset = Asset>(name: string): T | undefined
    {
        return this.assetMap.get(name) as T;
    }

    static UnloadAsset(name: string): void
    {
        const asset = this.assetMap.get(name);

        if (asset)
        {
            asset.Unload();
        }
    }
}