import { GL } from "@fwge/common"

enum DepthType
{
    INT16,
    INT24,
    FLOAT32
}
interface IRenderAttachment
{
    heigth: number
    width: number
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
    public readonly Textures: Array<WebGLTexture | undefined>

    constructor(config: IRenderTarget)
    {
        this.Framebuffer = GL.createFramebuffer()!
        this.Textures = new Array(config.attachments.length)

        for (let i = 0; i < config.attachments.length; ++i)
        {
            const colourAttachment = config.attachments[i].colour
            const depthAttachment = config.attachments[i].depth

            let texture: WebGLTexture | undefined = undefined
            
            if (colourAttachment)
            {
                texture = GL.createTexture()!

                GL.bindTexture(GL.TEXTURE_2D, texture)

                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
                GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, colourAttachment.width, colourAttachment.heigth, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array(colourAttachment.width * colourAttachment.heigth * 4))

                GL.bindFramebuffer(GL.FRAMEBUFFER, this.Framebuffer)
                GL.framebufferTexture2D(GL.FRAMEBUFFER, getAttachmentIndex(i), GL.TEXTURE_2D, texture, 0)
                GL.bindFramebuffer(GL.FRAMEBUFFER, null)
                GL.bindTexture(GL.TEXTURE_2D, null)
            }
            
            if (depthAttachment)
            {  
                const renderBuffer = GL.createRenderbuffer()!
                
                GL.bindFramebuffer(GL.FRAMEBUFFER, this.Framebuffer)
                GL.bindRenderbuffer(GL.RENDERBUFFER, renderBuffer)
                GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT, depthAttachment.width, depthAttachment.heigth)
                GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, renderBuffer)
                GL.bindFramebuffer(GL.FRAMEBUFFER, null)
                GL.bindRenderbuffer(GL.RENDERBUFFER, null)
            }
            
            this.Textures[i] = texture
        }
    }
}
