import { Asset } from "@fwge/core";
import { MTL, MTLLoader, OBJ, OBJLoader } from "@fwge/io";

export class OBJMTLAsset extends Asset
{
    private readonly _objSource: string;
    private readonly _mtlSource: string;

    private _objContent: string = '';
    public get OBJContent()
    {
        return this._objContent;
    }

    private _mtlContent: string = '';
    public get MTLContent()
    {
        return this._mtlContent;
    }

    private _obj: OBJ = {};
    public get OBJ()
    {
        return this._obj;
    }

    private _mtl: MTL = {};
    public get MTL()
    {
        return this._mtl;
    }    

    constructor(obj: string, mtl: string)
    {
        super(OBJMTLAsset);

        this._objSource = obj;
        this._mtlSource = mtl;
    }

    public Reset(): void
    {
        this._objContent = '';
        this._mtlContent = '';
    }

    public async Load(protocol: (...args: any[]) => Promise<Blob | Response> = fetch): Promise<void>
    {
        await Promise.allSettled([
            protocol(this._objSource).then(x => x.text()).then(text => this._objContent = text),
            protocol(this._mtlSource).then(x => x.text()).then(text => this._mtlContent = text)
        ]);

        this._obj = OBJLoader(this.OBJContent);
        Object.keys(this._obj).forEach(async key => {
            await this._obj[key].mesh.Load();
        })
        this._mtl = MTLLoader(this.MTLContent);
        Object.keys(this._mtl).forEach(async key => {
            const promises = this._mtl[key].ImageTextures.filter(Boolean).map(image => image!.Load());
            await Promise.all(promises);
        })
    }
    
    public Unload(): void
    {
        throw new Error("Method not implemented.");
    }
    
    public Destroy(): void
    {
        throw new Error("Method not implemented.");
    }
}
