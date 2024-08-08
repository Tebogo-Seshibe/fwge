import { Asset } from "./Asset";
import { Game } from "./Game";
import { Shader } from "./shader/Shader";

export class ShaderAsset implements Asset
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
        this._vertexShaderSrc = vertexShaderSrc;
        this._fragmentShaderSrc = fragmentShaderSrc;
    }

    Load(game: Game): void
    {
        this.LoadVertexShaderText(game.GL);
    }

    private LoadVertexShaderText(gl: WebGL2RenderingContext): void
    {
        const script = new HTMLScriptElement();
        script.addEventListener('load', this.LoadFragmentShaderText.bind(this, gl, script.innerHTML));
        script.src = this._vertexShaderSrc;
    }
    private LoadFragmentShaderText(gl: WebGL2RenderingContext, vs: string): void
    {
        const script = new HTMLScriptElement();
        script.addEventListener('load', this.CreateShader.bind(this, gl, vs, script.innerHTML));
        script.src = this._fragmentShaderSrc;
    }
    private CreateShader(gl: WebGL2RenderingContext, vs: string, fs: string): void 
    {
        this._shader = new Shader(vs, fs);
        this._shader.Init(gl);
    }

    Unload(game: Game): void
    {
        // throw new Error("Method not implemented.");
    }
    Destroy(game: Game): void
    {
        // throw new Error("Method not implemented.");
    }

}