import { Colour4, GL } from "@fwge/common"

export enum ColourType
{
    NONE = 0,
    RGB = 1,
    RGBA = 2,
}

export enum DepthType
{
    NONE = 4,
    INT16 = 5,
    INT24 = 6,
    INT24_8 = 7,
    FLOAT32 = 8,
    FLOAT32_8 = 9,
}

interface IRenderTarget
{
    height: number
    width: number
    colour: ColourType[]
    depth: DepthType
    clear?: [number, number, number, number]
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

function getFormatType(colour: ColourType): number
function getFormatType(depth: DepthType): number
function getFormatType(type: ColourType | DepthType): number
{
    if (type <= 4)
    {
        switch (type as ColourType)
        {
            case ColourType.RGB:
                return GL.RGB

            case ColourType.RGBA:
                return GL.RGBA
        }
    }
    else
    {
        switch (type as DepthType)
        {
            case DepthType.INT16:
                return GL.DEPTH_COMPONENT16

            case DepthType.INT24:
                return GL.DEPTH_COMPONENT24

            case DepthType.FLOAT32:
                return GL.DEPTH_COMPONENT32F
                
            case DepthType.INT24_8:
                return GL.DEPTH24_STENCIL8

            case DepthType.FLOAT32_8:
                return GL.DEPTH32F_STENCIL8
        }
    }

    return -1
}


function getAttachmentType(colour: ColourType): number
function getAttachmentType(depth: DepthType): number
function getAttachmentType(type: ColourType | DepthType): number
{
    if (type <= 4)
    {
        switch (type as ColourType)
        {
            case ColourType.RGB:
                return GL.RGB

            case ColourType.RGBA:
                return GL.RGBA
        }
    }
    else
    {
        switch (type as DepthType)
        {
            case DepthType.INT16:
            case DepthType.INT24:
            case DepthType.FLOAT32:
                return GL.DEPTH_ATTACHMENT
                
            case DepthType.INT24_8:
            case DepthType.FLOAT32_8:
                return GL.DEPTH_STENCIL_ATTACHMENT
        }
    }

    return -1
}

function getAttachmentFormat(type: DepthType): number
{
    switch (type)
    {
        case DepthType.INT16:
        case DepthType.INT24:
        case DepthType.FLOAT32:
            return GL.DEPTH_ATTACHMENT
            
        case DepthType.INT24_8:
        case DepthType.FLOAT32_8:
            return GL.DEPTH_STENCIL_ATTACHMENT
    }
    
    return -1
}


export class RenderTarget
{
    public readonly Height: number
    public readonly Width: number
    public readonly ClearColour: Colour4

    public readonly Framebuffer: WebGLFramebuffer | null = null
    public readonly ColourAttachments: WebGLTexture[] = []
    public readonly DepthAttachment: WebGLTexture | null = null
    
    constructor(config: IRenderTarget)
    {
        this.Height = config.height
        this.Width = config.width
        this.ClearColour = config.clear ? new Colour4(config.clear) : new Colour4(0.0)
        
        if (config.colour.length === 0 && config.depth === DepthType.NONE)
        {
            return
        }

        this.Framebuffer = GL.createFramebuffer()!
        GL.bindFramebuffer(GL.FRAMEBUFFER, this.Framebuffer)
        this.ColourAttachments = config.colour.map((colourType, index) =>
        {
            if (colourType !== ColourType.NONE)
            {
                const attachmentType = getAttachmentType(colourType)
                const format = getFormatType(colourType)
                const attachmentIndex = getAttachmentIndex(index)

                const texture = GL.createTexture()!
                GL.bindTexture(GL.TEXTURE_2D, texture)
                GL.texImage2D(GL.TEXTURE_2D, 0, format, this.Width, this.Height, 0, attachmentType, GL.UNSIGNED_BYTE, null)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
                GL.framebufferTexture2D(GL.FRAMEBUFFER, attachmentIndex, GL.TEXTURE_2D, texture, 0)
                return texture
            }
            return null
        }).filter(x => x !== null) as WebGLTexture[]
        
        
        if (config.depth !== DepthType.NONE)
        { 
            const attachmentType = getAttachmentType(config.depth)
            const format = getFormatType(config.depth)

            const texture = GL.createTexture()!
            GL.bindTexture(GL.TEXTURE_2D, texture)
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.DEPTH_COMPONENT32F, this.Width, this.Height, 0, GL.DEPTH_COMPONENT, GL.FLOAT, null)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
            GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.TEXTURE_2D, texture, 0)

            if (this.ColourAttachments.length === 0)
            {
                GL.drawBuffers([GL.NONE])
                GL.readBuffer(GL.NONE)
            }

            this.DepthAttachment = texture
        }

        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    }

    Bind()
    {
        GL.bindFramebuffer(GL.FRAMEBUFFER, this.Framebuffer)
        if (!this.Framebuffer)
        {
            GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
        }
        else
        {
            GL.viewport(0, 0, this.Width, this.Height)
        }
        GL.clearColor(this.ClearColour[0], this.ClearColour[1], this.ClearColour[2], this.ClearColour[3])
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT | GL.STENCIL_BUFFER_BIT)
        // GL.bindTexture(GL.TEXTURE_2D, null)

        
        // GL.bindFramebuffer(GL.FRAMEBUFFER, null)
        // GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
        // GL.clearColor(0,0,0,0)
        // GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)

    }
    
    UnBind()
    {
        for (let i = 0; i < 8; ++i)
        {
            GL.activeTexture(GL.TEXTURE0 + i)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    }
}