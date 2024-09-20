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
    
    public async Load(game: Game): Promise<void>
    {
        throw new Error('Method not implemented');
    }

    public async Unload(game: Game): Promise<void>
    {
        throw new Error('Method not implemented');
    }

    public async Destroy(game: Game): Promise<void>
    {
        throw new Error('Method not implemented');
    }    
}
