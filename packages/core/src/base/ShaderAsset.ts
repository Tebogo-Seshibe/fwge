import { Asset } from "./Asset";
import { Game } from "./Game";
import { Shader } from "./shader/Shader";

export class ShaderAsset extends Asset
{
    private _shader: Shader | undefined;

    private _vertexShaderSrc: string;
    private _fragmentShaderSrc: string;

    public get Shader(): Shader | undefined
    {
        return this._shader;
    }

    constructor(vertexShaderSrc: string, fragmentShaderSrc: string, private readonly name: string = 'Shader')
    {
        super(ShaderAsset);
        
        this._vertexShaderSrc = vertexShaderSrc;
        this._fragmentShaderSrc = fragmentShaderSrc;
    }

    Reset(): void { }
    
    async Load(protocol?: (...args: any[]) => Promise<Blob>)
    {
        let [vs, fs] = ['', ''];
        let promise;

        if (protocol)
        {
            promise = Promise.all([
                protocol(this._vertexShaderSrc).then(x => x.text()).then(text => vs = text),
                protocol(this._fragmentShaderSrc).then(x => x.text().then(text => fs = text))
            ]);
        }
        else
        {
            promise = Promise.all([
                fetch(this._vertexShaderSrc).then(x => x.text().then(text => vs = text)),
                fetch(this._fragmentShaderSrc).then(x => x.text().then(text => fs = text))
            ]);
        }
        
        await promise;
        this._shader = new Shader(vs, fs, this.name);
        this._shader.Init();
        this.loaded = true;
    }

    Unload(): void
    {
        // throw new Error("Method not implemented.");
    }
    
    Destroy(): void
    {
        // throw new Error("Method not implemented.");
    }

}''