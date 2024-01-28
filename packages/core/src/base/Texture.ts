import { Asset } from "../base"

export enum TextureFormat
{
    RGBA_BYTE,
    RGB_BYTE,
    RGBA_SHORT,
    RGB_SHORT_1A,
    RGB_SHORT,
    LUMINANCE_ALPHA,
    LUMINANCE,
    ALPHA,
}

export enum FilterMode
{
    NEAREST,
    LINEAR,
    MIP_NEAREST_NEAREST,
    MIP_NEAREST_LINEAR,
    MIP_LINEAR_NEAREST,
    MIP_LINEAR_LINEAR
}

export enum WrapMode
{
    REPEAT,
    MIRRORD_REPEAT,
    EDGE_CLAMP
}

export class Texture extends Asset
{
    // readonly Texture: WebGLTexture = GL.createTexture()!
    private _width: number = 0
    private _height: number = 0
    private _depth: number = 0

    get Width(): number
    {
        return this._width
    }
    
    get Height(): number
    {
        return this._height
    }

    get Depth(): number
    {
        return this._depth
    }
    
    constructor(width: number, height: number, textureFormat: TextureFormat)
    {
        super(Texture)

        // let format: number
        // let type: number
        
        // GL.vertexAjj
        
        // switch (textureFormat)
        // {
        //     case TextureFormat.RGBA_BYTE:
        //         format = GL.RGBA
        //         type = GL.UNSIGNED_BYTE
        //         break
        // }
        // GL.bindTexture(GL.TEXTURE_2D, this.Texture)
        // if (_2 !== undefined)
        // {
            
        // }
        // else if (_1 !== undefined)
        // {

        // }
        // else
        // {

        // }
        // GL.bindTexture(GL.TEXTURE_2D, null)
    }
}

// const texture = GL.createTexture()!
// GL.texImage2D(GL.TEXTURE_2D, 0, format, this.Width, this.Height, 0, attachmentType, GL.UNSIGNED_BYTE, null)
// GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
// GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
// GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
// GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
// GL.framebufferTexture2D(GL.FRAMEBUFFER, attachmentIndex, GL.TEXTURE_2D, texture, 0)
// return texture


// GL.bindTexture(GL.TEXTURE_2D, texture)
// GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, img)

// if (isPowerOf2(img.width) && isPowerOf2(img.height))
// {
//     GL.generateMipmap(GL.TEXTURE_2D)
//     GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST)
//     GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
// }
// else
// {
//     GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
//     GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
//     GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
//     GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
// }

// GL.bindTexture(GL.TEXTURE_2D, null);

// const texture = GL.createTexture()!
// GL.bindTexture(GL.TEXTURE_2D, texture)
// GL.texImage2D(GL.TEXTURE_2D, 0, GL.DEPTH_COMPONENT32F, this.Width, this.Height, 0, GL.DEPTH_COMPONENT, GL.FLOAT, null)
// GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST)
// GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST)
// GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
// GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
// GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.TEXTURE_2D, texture, 0)

// if (this.ColourAttachments.length === 0)
// {
//     GL.drawBuffers([GL.NONE])
//     GL.readBuffer(GL.NONE)
// }

// this.DepthAttachment = texture