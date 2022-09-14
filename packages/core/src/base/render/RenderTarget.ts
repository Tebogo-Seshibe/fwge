import { Colour4, GL } from "@fwge/common"

export enum ColourType
{
    NONE = 0,
    UINT_RGB = 1,
    UINT_RGBA = 2,
    FLOAT_RGB = 3,
    FLOAT_RGBA = 4,
}

export enum DepthType
{
    NONE = 5,
    INT16 = 6,
    INT24 = 7,
    INT24_8 = 8,
    FLOAT32 = 9,
    FLOAT32_8 = 10,
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
            case ColourType.UINT_RGB:
                return GL.RGB

            case ColourType.UINT_RGBA:
                return GL.RGBA

            case ColourType.FLOAT_RGB:
                return GL.RGB32F

            case ColourType.FLOAT_RGBA:
                return GL.RGBA32F
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
    if (type <= DepthType.NONE)
    {
        switch (type as ColourType)
        {
            case ColourType.UINT_RGB:
                return GL.RGB

            case ColourType.UINT_RGBA:
                return GL.RGBA
        
            default:
                return GL.RGB16F
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
                
                if (colourType === ColourType.UINT_RGB || colourType === ColourType.UINT_RGBA)
                {

                    GL.texImage2D(GL.TEXTURE_2D, 0, format, this.Width, this.Height, 0, attachmentType, GL.UNSIGNED_BYTE, null)
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
                }
                else
                {
                    // GL.getExtension('EXT_color_buffer_float')
                    GL.getExtension('OES_texture_float')
                    GL.texImage2D(GL.TEXTURE_2D, 0, format, this.Width, this.Height, 0, attachmentType, GL.FLOAT, null)
                }

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
                GL.drawBuffers(config.colour.map(() => GL.NONE))
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
/**
 * 
export class RenderTarget
{
    private _config!: IRenderTarget
    private _height!: number
    private _width!: number

    private _colourAttachments: WebGLTexture[] = []
    private _depthAttachment: WebGLTexture | null = null
    
    public readonly Framebuffer: WebGLFramebuffer = GL.createFramebuffer()!
    public readonly ClearColour: Colour4 = new Colour4()
    
    get Height(): number
    {
        return this._height
    }

    get Width(): number
    {
        return this._width
    }

    get ColourAttachments(): WebGLTexture[]
    {
        return this._colourAttachments
    }

    get DepthAttachment(): WebGLTexture | null
    {
        return this._depthAttachment
    }

    constructor(config: IRenderTarget)
    {
        this.Reset(config)
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

    Reset(updatedConfig: IRenderTarget)
    {
        this._config = updatedConfig
        console.log(this._config)

        GL.bindFramebuffer(GL.FRAMEBUFFER, this.Framebuffer)
        this._config.colour.forEach((_, index) => this.createColourTexture(index))
        this.createDepthTexture()
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
        console.log(this)
    }

    private createColourTexture(index: number)
    {
        const colourType = this._config.colour[index]
        const attachmentType = getAttachmentType(colourType)
        const format = getFormatType(colourType)
        const attachmentIndex = getAttachmentIndex(index)

        const texture = GL.createTexture()!
        GL.bindTexture(GL.TEXTURE_2D, texture)
        
        if (colourType === ColourType.UINT_RGB || colourType === ColourType.UINT_RGBA)
        {

            GL.texImage2D(GL.TEXTURE_2D, 0, format, this.Width, this.Height, 0, attachmentType, GL.UNSIGNED_BYTE, null)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
        }
        else
        {
            // GL.getExtension('EXT_color_buffer_float')
            GL.getExtension('OES_texture_float')
            GL.texImage2D(GL.TEXTURE_2D, 0, format, this.Width, this.Height, 0, attachmentType, GL.FLOAT, null)
        }

        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
        GL.framebufferTexture2D(GL.FRAMEBUFFER, attachmentIndex, GL.TEXTURE_2D, texture, 0)

        this._colourAttachments[index] = texture
        console.log(texture)
    }

    private createDepthTexture()
    {
        const attachmentType = getAttachmentType(this._config.depth)
        const format = getFormatType(this._config.depth)

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

        this._depthAttachment = texture
        console.log(texture)
    }
}

 */