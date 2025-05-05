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

export class ImageAsset extends Asset
{
    readonly Filtering: TextureFilter;
    readonly WrapMode: WrapMode;
    readonly Texture: WebGLTexture;
    readonly Sources: string[];

    constructor(sources: string[], filtering: TextureFilter = TextureFilter.LINEAR, wrapMode: WrapMode = WrapMode.REPEAT)
    {
        super(ImageAsset);

        this.Sources = sources;
        this.Filtering = filtering;
        this.WrapMode = wrapMode;
        this.Texture = GL.createTexture()!;
    }
    
    public Reset(): void
    {
        GL.bindTexture(GL.TEXTURE_2D, this.Texture);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8ClampedArray([255, 0, 255]));
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);
        GL.bindTexture(GL.TEXTURE_2D, null);
    }

    public Load(): void
    {
        throw new Error('Method not implemented');
    }

    public Unload(): void
    {
        throw new Error('Method not implemented');
    }

    public Destroy(): void
    {
        throw new Error('Method not implemented');
    }    
}
