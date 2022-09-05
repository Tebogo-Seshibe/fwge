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

    constructor(filtering: TextureFilter = TextureFilter.NEAREST, wrapMode: WrapMode = WrapMode.EDGE_CLAMP)
    {
        super(ImageTexture)

        this.Filtering = filtering
        this.WrapMode = wrapMode

        GL.bindTexture(GL.TEXTURE_2D, this.Texture)
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
        GL.bindTexture(GL.TEXTURE_2D, null)
    }

    protected applyImage(image: HTMLImageElement): void {}
}
