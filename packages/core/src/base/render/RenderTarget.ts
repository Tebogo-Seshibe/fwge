import { Colour4, GL } from "@fwge/common"

export interface ColourAttachment
{
    type: 'byte' | 'float'
    format: 'r' | 'rb' | 'rgb' | 'rgba'
}

export type DepthAttachment =
{
    type: 'int'
    depth: 16
} | 
{
    type: 'int'
    depth: 24
    stencil?: true
} | 
{
    type: 'float'
    depth: 32
    stencil?: true
}

export enum ColourType
{
    NONE,
    BYTE_RGB,
    BYTE_RGBA,
    FLOAT_RGB,
    FLOAT_RGBA,
}

export enum DepthType
{
    NONE,
    INT16,
    INT24,
    INT24_INT8,
    FLOAT32,
    FLOAT32_FLOAT8,
}

export interface IRenderTarget
{
    height: number
    width: number
    colour: ColourType[]
    depth: DepthType
    clear?: [number, number, number, number]
}

function colourInternalFormat(colourType: ColourType): number
{
    switch (colourType as ColourType)
    {
        case ColourType.BYTE_RGB:
            return GL.RGB
        
        case ColourType.BYTE_RGBA:
            return GL.RGBA
                
        case ColourType.FLOAT_RGB:
        case ColourType.FLOAT_RGBA:
            return GL.RGBA16F

        default:
            return -1
    }
}

function depthInternalFormat(depthType: DepthType): number
{
    switch (depthType)
    {
        case DepthType.INT16:
            return GL.DEPTH_COMPONENT16

        case DepthType.INT24:
            return GL.DEPTH_COMPONENT24

        case DepthType.FLOAT32:
            return GL.DEPTH_COMPONENT32F
            
        case DepthType.INT24_INT8:
            return GL.DEPTH24_STENCIL8

        case DepthType.FLOAT32_FLOAT8:
            return GL.DEPTH32F_STENCIL8

        default:
            return -1
    }
}

function colourFormat(colourType: ColourType): number
{
    switch (colourType as ColourType)
    {
        case ColourType.BYTE_RGB:
            return GL.RGB
        
        case ColourType.BYTE_RGBA:
        case ColourType.FLOAT_RGB:
        case ColourType.FLOAT_RGBA:
            return GL.RGBA

        default:
            return -1
    }
}

function depthFormat(depthType: DepthType): number
{
    switch (depthType as DepthType)
    {
        case DepthType.INT16:
        case DepthType.INT24:
        case DepthType.FLOAT32:
            return GL.DEPTH_COMPONENT

        case DepthType.INT24_INT8:
        case DepthType.FLOAT32_FLOAT8:
            return GL.DEPTH_STENCIL

        default:
            return -1
    }
}

function depthAttachment(depthType: DepthType): number
{
    switch (depthType as DepthType)
    {
        case DepthType.INT16:
        case DepthType.INT24:
        case DepthType.FLOAT32:
            return GL.DEPTH_ATTACHMENT
            
        case DepthType.INT24_INT8:
        case DepthType.FLOAT32_FLOAT8:
            return GL.DEPTH_STENCIL_ATTACHMENT

        default:
            return -1
    }
}

function depthDataType(type: DepthType): number
{
    switch (type)
    {
        case DepthType.INT16:
        case DepthType.INT24:
            return GL.UNSIGNED_INT

        case DepthType.FLOAT32:
            return GL.FLOAT

        case DepthType.INT24_INT8:
            return GL.UNSIGNED_INT_24_8

        case DepthType.FLOAT32_FLOAT8:
            return GL.FLOAT_32_UNSIGNED_INT_24_8_REV
    }

    return -1
}

function colourDataType(colourType: ColourType): number
{
    switch (colourType)
    {
        case ColourType.BYTE_RGB:
        case ColourType.BYTE_RGBA:
            return GL.UNSIGNED_BYTE

        case ColourType.FLOAT_RGB:
        case ColourType.FLOAT_RGBA:
            return GL.FLOAT
    }

    return -1
}

export class RenderTarget
{
    public readonly Height: number = 0
    public readonly Width: number = 0
    public readonly ClearColour: Colour4 = new Colour4()

    public readonly Framebuffer: WebGLFramebuffer = GL.createFramebuffer()!
    public readonly ColourAttachments: WebGLTexture[] = []
    public readonly DepthAttachment: WebGLTexture | null = null
    
    constructor(config: IRenderTarget)
    {
        if (config.colour.length === 0 && config.depth === DepthType.NONE)
        {
            return
        }

        this.Height = config.height
        this.Width = config.width
        this.ClearColour.Set(config.clear ?? [0,0,0,0])
        
        { (window as any).GL = GL }

        const drawBuffers = []
        GL.bindFramebuffer(GL.FRAMEBUFFER, this.Framebuffer)
        this.ColourAttachments = config.colour.filter(x => x !== ColourType.NONE).map((colourType, index) =>
        {
            const internalFormat = colourInternalFormat(colourType)
            const format = colourFormat(colourType)
            const type = colourDataType(colourType)
            
            const texture = GL.createTexture()!

            GL.bindTexture(GL.TEXTURE_2D, texture)
            GL.texImage2D(GL.TEXTURE_2D, 0, internalFormat, this.Width, this.Height, 0, format, type, null)
            if (colourType === ColourType.BYTE_RGB || colourType === ColourType.BYTE_RGBA)
            {
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
            }
            else
            {
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST)
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST)
            }
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
            GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0 + index, GL.TEXTURE_2D, texture, 0)
            GL.bindTexture(GL.TEXTURE_2D, null)
            
            drawBuffers.push(GL.COLOR_ATTACHMENT0 + index)
            return texture
        })
        
        
        if (config.depth !== DepthType.NONE)
        { 
            const internalFormat = depthInternalFormat(config.depth)
            const format = depthFormat(config.depth)
            const type = depthDataType(config.depth)
            const attachment = depthAttachment(config.depth)

            const texture = GL.createTexture()!

            GL.bindTexture(GL.TEXTURE_2D, texture)
            GL.texImage2D(GL.TEXTURE_2D, 0, internalFormat, this.Width, this.Height, 0, format, type, null)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
            GL.framebufferTexture2D(GL.FRAMEBUFFER, attachment, GL.TEXTURE_2D, texture, 0)
            GL.bindTexture(GL.TEXTURE_2D, null)

            this.DepthAttachment = texture
        }
        
        if (this.ColourAttachments.length === 0)
        {
            drawBuffers.push(GL.NONE)
            GL.readBuffer(GL.NONE)
        }
        
        GL.drawBuffers(drawBuffers)
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    }

    Bind()
    {
        GL.bindFramebuffer(GL.FRAMEBUFFER, this.Framebuffer)
        GL.viewport(0, 0, this.Width, this.Height)

        let mask = 0
        if (this.ColourAttachments.length > 0)
        {
            mask |= GL.COLOR_BUFFER_BIT
        }
        if (this.DepthAttachment)
        {
            mask |= GL.DEPTH_BUFFER_BIT
        }

        GL.clearColor(this.ClearColour[0], this.ClearColour[1], this.ClearColour[2], this.ClearColour[3])
        GL.clear(mask)
        // GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT | GL.STENCIL_BUFFER_BIT)
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