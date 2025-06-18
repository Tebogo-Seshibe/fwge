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
    static EmptyTexture: WebGLTexture;
    readonly Filtering: TextureFilter;
    readonly WrapMode: WrapMode;
    readonly Texture: WebGLTexture;
    readonly Sources: string[];
    readonly Data: HTMLImageElement;

    constructor(sources: string[], filtering: TextureFilter = TextureFilter.LINEAR, wrapMode: WrapMode = WrapMode.REPEAT)
    {
        super(ImageAsset);

        this.Sources = sources;
        this.Filtering = filtering;
        this.WrapMode = wrapMode;
        this.Texture = GL.createTexture()!;
        this.Data = new Image();
        if (!ImageAsset.EmptyTexture)
        {
            GL.bindTexture(GL.TEXTURE_2D, ImageAsset.EmptyTexture);
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8ClampedArray([255, 0, 255]));
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);
            GL.bindTexture(GL.TEXTURE_2D, null);
        }
    }

    public Init(): void { }
    
    public Reset(): void { }

    public async Load(): Promise<void>
    {
        this.Data.src = this.Sources[0];

        return new Promise((resolve, reject) => {
            this.Data.addEventListener('load', () => {
                GL.bindTexture(GL.TEXTURE_2D, this.Texture);
                GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, this.Data);

                switch(this.Filtering)
                {
                    case TextureFilter.LINEAR:
                        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
                        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
                        break;

                    case TextureFilter.NEAREST:
                        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
                        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
                        break;
                }

                switch (this.WrapMode)
                {
                    case WrapMode.EDGE_CLAMP:
                        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
                        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
                        break;

                    case WrapMode.MIRRORD_REPEAT:
                        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.MIRRORED_REPEAT);
                        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.MIRRORED_REPEAT);
                        break;

                    case WrapMode.REPEAT:
                        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);
                        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);
                        break;
                }

                GL.bindTexture(GL.TEXTURE_2D, null);
                this.loaded = true;
                resolve();
            });

            this.Data.addEventListener('error', () => reject());
        });
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
