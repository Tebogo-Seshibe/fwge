import { GL } from "@fwge/common";
import { Asset } from "../Asset";
import { Game } from "../Game";

export enum TextureFilter
{
    LINEAR,
    NEAREST
}

export enum WrapMode
{
    REPEAT,
    MIRRORD_REPEAT,
    EDGE_CLAMP
}

export abstract class ImageAsset implements Asset
{
    readonly Filtering: TextureFilter;
    readonly WrapMode: WrapMode;
    readonly Texture: WebGLTexture;
    readonly Sources: string[];

    constructor(sources: string[], filtering: TextureFilter = TextureFilter.LINEAR, wrapMode: WrapMode = WrapMode.REPEAT)
    {
        this.Sources = sources;
        this.Filtering = filtering;
        this.WrapMode = wrapMode;
        this.Texture = GL.createTexture()!;
    }
    
    public abstract Load(game: Game): void;
    public abstract Unload(game: Game): void;
    public abstract Destroy(game: Game): void;
    
    // protected BindDefaultImageData(): void
    // {        
    //     GL.bindTexture(GL.TEXTURE_2D, this.Texture);
    //     GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
    //     GL.bindTexture(GL.TEXTURE_2D, null);
    // }
}
