import { GL } from "@fwge/common"

export enum DepthType
{
    INT16,
    INT24,
    FLOAT32
}
interface IRenderAttachment
{

}

interface IDepthAttachment extends IRenderAttachment
{
    type: DepthType
}
interface IColourAttachment extends IRenderAttachment
{
    
}

interface IAttachment
{
    height: number
    width: number
    colour: IColourAttachment | undefined,
    depth: IDepthAttachment | undefined
}
interface IRenderTarget
{
    attachments:IAttachment[]
}

function getAttachmentIndex(index: number) {

    switch (index)
    {
        case 0: return GL.COLOR_ATTACHMENT0
        case 1: return GL.COLOR_ATTACHMENT1
        case 2: return GL.COLOR_ATTACHMENT2
        case 3: return GL.COLOR_ATTACHMENT3
        case 4: return GL.COLOR_ATTACHMENT4
        case 5: return GL.COLOR_ATTACHMENT5
        case 6: return GL.COLOR_ATTACHMENT6
        case 7: return GL.COLOR_ATTACHMENT7
        case 8: return GL.COLOR_ATTACHMENT8
        case 9: return GL.COLOR_ATTACHMENT9
        case 10: return GL.COLOR_ATTACHMENT10
        case 11: return GL.COLOR_ATTACHMENT11
        case 12: return GL.COLOR_ATTACHMENT12
        case 13: return GL.COLOR_ATTACHMENT13
        case 14: return GL.COLOR_ATTACHMENT14
        case 15: return GL.COLOR_ATTACHMENT15
        default: return -1
    }
}

export class RenderTarget
{

    public readonly Framebuffer: WebGLFramebuffer
    public readonly ColourTextures: Array<WebGLTexture | undefined> = new Array(8)
    public readonly DepthStencilTextures: Array<WebGLTexture | undefined> = new Array(8)

    constructor(config: IRenderTarget)
    {
        this.Framebuffer = GL.createFramebuffer()!

        for (let i = 0; i < config.attachments.length; ++i)
        {
            const height = config.attachments[i].height ?? 256
            const width = config.attachments[i].width ?? 256
            const colourAttachment = config.attachments[i].colour
            const depthAttachment = config.attachments[i].depth

            if (colourAttachment)
            {
                const texture = GL.createTexture()!
                GL.bindTexture(GL.TEXTURE_2D, texture)
                GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, width, height, 0, GL.RGBA, GL.UNSIGNED_BYTE, null)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)

                GL.bindFramebuffer(GL.FRAMEBUFFER, this.Framebuffer)
                GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, texture, 0)
                GL.bindFramebuffer(GL.FRAMEBUFFER, null)

                this.ColourTextures[i] = texture
            }
            
            if (depthAttachment)
            {  
                // const depthStencilTexture = GL.createTexture()!
                // GL.bindTexture(GL.TEXTURE_2D, depthStencilTexture)
                // GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
                // GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
                // GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
                // GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
                // GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, width, height, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array(width * height * 4))
                // GL.bindTexture(GL.TEXTURE_2D, null)
                
                const renderBuffer = GL.createRenderbuffer()!
                
                GL.bindRenderbuffer(GL.RENDERBUFFER, renderBuffer)
                GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, width, height)
                GL.bindRenderbuffer(GL.RENDERBUFFER, null)

                // this.DepthStencilTextures[i] = undefined
            }
        }
        
        console.log(GL.checkFramebufferStatus(GL.FRAMEBUFFER) === GL.FRAMEBUFFER_COMPLETE)
        console.log(this)
    }
}
