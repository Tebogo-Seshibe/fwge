import { GL } from "@fwge/common"
import { Asset } from "../Asset"

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

export class ImageTexture extends Asset
{
    readonly Filtering: TextureFilter
    readonly WrapMode: WrapMode
    readonly Texture: WebGLTexture = GL.createTexture()!

    constructor(filtering: TextureFilter = TextureFilter.LINEAR, wrapMode: WrapMode = WrapMode.REPEAT)
    {
        super(ImageTexture)

        this.Filtering = filtering
        this.WrapMode = wrapMode
    }

    protected applyImage(...images: HTMLImageElement[]): void {}
}
