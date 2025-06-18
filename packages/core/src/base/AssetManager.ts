import { Type } from "@fwge/ecs";
import { Asset } from "./Asset";

export type AssetRegister<T extends Asset> =  
    Type<Asset> |
    Asset |
    { title: string, asset: Type<T>, args: ConstructorParameters<Type<T>> } |
    { title: string, asset: Asset };

export class AssetManager
{
    static readonly assets: Map<string, Asset> = new Map();

    public static Add<T extends Asset>(type: Type<T>): typeof AssetManager
    public static Add<T extends Asset>(name: string, type: Type<T>, ...args: ConstructorParameters<Type<T>>): typeof AssetManager
    public static Add<T extends Asset>(_arg0: string | Type<T>, type?: Type<T>, ...args: ConstructorParameters<Type<T>>): typeof AssetManager
    {
        const name = typeof _arg0 === 'string'
            ? _arg0
            : _arg0.name;
        
        const asset = typeof _arg0 === 'string'
            ? new type!(...args)
            : new _arg0();

        this.assets.set(name, asset);
        return this;
    }

    public static async Init()
    {
        for (const [, asset] of this.assets.entries())
        {
            await asset.Load();
        }
    } 

    public static Register(...assetTypes: AssetRegister<Asset>[]): void
    {
        for (const item of assetTypes)
        {
            let name: string;
            let asset: Asset;

            if ('title' in item)
            {
                name = item.title;
                asset = 'args' in item
                    ? new item.asset(...item.args)
                    : item.asset;
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
