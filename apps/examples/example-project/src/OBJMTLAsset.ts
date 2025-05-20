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

    public Load(protocol: (...args: any[]) => Promise<Blob | Response> = fetch): void
    {
        let promise;
        console.time(`Load: ${this.Type.name}`)

        promise = Promise.allSettled([
            protocol(this._objSource).then(x => x.text()).then(text => this._objContent = text),
            protocol(this._mtlSource).then(x => x.text()).then(text => this._mtlContent = text)
        ]);

        promise.then(() => {
            this._obj = OBJLoader(this.OBJContent);
            this._mtl = MTLLoader(this.MTLContent);
            
            console.timeEnd(`Load: ${this.Type.name}`)
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
