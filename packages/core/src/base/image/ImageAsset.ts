import { GL } from "@fwge/common";
import { Asset } from "../assets/Asset";

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

    constructor(filtering: TextureFilter = TextureFilter.LINEAR, wrapMode: WrapMode = WrapMode.REPEAT)
    {
        super(ImageAsset);

        this.Filtering = filtering;
        this.WrapMode = wrapMode;
        this.Texture = GL.createTexture()!;
    }

    protected applyImage(...images: HTMLImageElement[]): void { }
}
