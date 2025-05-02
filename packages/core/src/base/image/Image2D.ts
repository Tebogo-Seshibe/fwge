import { GL, isPowerOf2 } from "@fwge/common";
import { ImageAsset, TextureFilter, WrapMode } from "./ImageAsset";

export interface IImage2D
{
    source: string
    filtering?: TextureFilter
    wrapMode?: WrapMode
}
export class Image2D extends ImageAsset
{
    private image: HTMLImageElement | undefined;

    constructor(config: IImage2D)
    {
        super([config.source], config.filtering, config.wrapMode)
        // this.BindDefaultImageData();
    }

    public SetFileSource(source: string): void
    {
        this.Sources[0] = source;
    }

    public async Load(): Promise<void>
    {
        this.image = new Image();
        this.image.addEventListener('load', this.BindLoadedImageData.bind(this));
        this.image.src = this.Sources[0];
    }

    public async Unload(): Promise<void>
    {
        this.image!.src = undefined!;
        this.image = undefined!
    }

    public async Destroy(): Promise<void>
    {
        
    }

    private BindLoadedImageData(): void
    {
        this.image!.removeEventListener('load', this.BindLoadedImageData.bind(this));
        
        GL.bindTexture(GL.TEXTURE_2D, this.Texture);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, this.image!.width, this.image!.height, 0, GL.RGBA, GL.UNSIGNED_BYTE, this.image!.buffer());
    
        if (isPowerOf2(this.image!.width) && isPowerOf2(this.image!.height))
        {
            GL.generateMipmap(GL.TEXTURE_2D);

            switch (this.Filtering)
            {
                case TextureFilter.LINEAR:
                    // GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
                    break
                    
                case TextureFilter.NEAREST:
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST_MIPMAP_NEAREST);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
                    break;
            }
        }
        else
        {
            switch (this.Filtering)
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
        }
        
        switch (this.WrapMode)
        {
            case WrapMode.REPEAT:
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);
                break;

            case WrapMode.MIRRORD_REPEAT:
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.MIRRORED_REPEAT);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.MIRRORED_REPEAT);
                break;

            case WrapMode.EDGE_CLAMP:
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
                break;
        }

        GL.bindTexture(GL.TEXTURE_2D, null);
    }
}
