import { Asset } from "@fwge/core";

export class TextAsset extends Asset
{
    private readonly _source: string;

    private _content: string = '';
    public get Content()
    {
        return this._content;
    }

    constructor(source: string)
    {
        super();
        this._source = source;
    }

    public Reset(): void
    {
        this._content = '';
    }

    public Load(protocol?: (...args: any[]) => Promise<Blob>): void
    {
        if (protocol)
        {
            protocol(this._source).then(x => x.text()).then(text => this._content = text);
        }
        else
        {
            fetch(this._source).then(x => x.text().then(text => this._content = text));
        }
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
