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

    async Load(game: Game, protocol?: (...args: any[]) => Promise<Blob>): Promise<void>
    {
        try
        {
            let [vs, fs] = ['', ''];

            if (protocol)
            {
                [vs, fs] = await Promise.all([
                    protocol(this._vertexShaderSrc).then(x => x.text()),
                    protocol(this._fragmentShaderSrc).then(x => x.text())
                ])
            }
            else
            {
                [vs, fs] = await Promise.all([
                    fetch(protocol + this._vertexShaderSrc).then(x => x.text()),
                    fetch(protocol + this._fragmentShaderSrc).then(x => x.text())
                ]);
            }
            
            this._shader = new Shader(vs, fs);
            this._shader.Init();
        }
        catch(e)
        {
            alert("Failed to load shader files: " + e)
        }
    }

    async Unload(game: Game): Promise<void>
    {
        // throw new Error("Method not implemented.");
    }
    
    async Destroy(game: Game): Promise<void>
    {
        // throw new Error("Method not implemented.");
    }

}''