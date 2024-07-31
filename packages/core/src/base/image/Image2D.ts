import { GL, isPowerOf2 } from "@fwge/common"
import { ImageAsset, TextureFilter, WrapMode } from "./ImageAsset"

export interface IImage2D
{
    source: string
    filtering?: TextureFilter
    wrapMode?: WrapMode
}
export class Image2D extends ImageAsset
{
    private imageUrl: string;
    private image: HTMLImageElement | undefined;

    constructor(config: IImage2D)
    {
        super(config.filtering, config.wrapMode)
        
        this.imageUrl = config.source;
        this.BindDefaultImageData();
    }

    override Load(): void
    {
        this.image = new Image();
        this.image.addEventListener('load', this.BindLoadedImageData.bind(this));
    }

    override Unload(): void
    {
        this.image!.src = undefined!;
        this.image = undefined!
    }

    private BindDefaultImageData(): void
    {        
        GL.bindTexture(GL.TEXTURE_2D, this.Texture);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
        GL.bindTexture(GL.TEXTURE_2D, null);
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
