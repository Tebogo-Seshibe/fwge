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

    constructor(vertexShaderSrc: string, fragmentShaderSrc: string)
    {
        super(ShaderAsset);
        
        this._vertexShaderSrc = vertexShaderSrc;
        this._fragmentShaderSrc = fragmentShaderSrc;
    }

    Reset(): void { }
    
    Load(protocol?: (...args: any[]) => Promise<Blob>): void
    {
        let [vs, fs] = ['', ''];
        let promise;

        console.time(`Load: ${this.Type.name}`)
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
        
        promise.then(() => {
            this._shader = new Shader(vs, fs);
            console.timeEnd(`Load: ${this.Type.name}`)
        });
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