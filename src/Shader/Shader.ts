import Colour3 from '../Colour/Colour3'
import Colour4 from '../Colour/Colour4'
import { GL } from '../FWGE'
import Item from '../Object/Item'
import ShaderAttribute from './Definition/ShaderAttribute'
import ShaderBaseUniform from './Definition/ShaderBaseUniform'

export let Shaders: Shader[] = []

export type UniformField =
{
    type: string
    index: WebGLUniformLocation
}

interface IShader
{
    name?: string
    height?: number
    width?: number
    filter?: boolean
    clear?: Colour4 | Colour3 | Float32Array | number[]
    vertex: string
    fragment: string
}

export default class Shader extends Item
{
    public Program: WebGLProgram | null = null
    public Height: number
    public Width: number
    public Clear: Colour4

    public Texture: WebGLTexture | null = null
    public FrameBuffer: WebGLFramebuffer | null = null
    public RenderBuffer: WebGLRenderbuffer | null = null
    
    public Attribute: ShaderAttribute | undefined
    public BaseUniforms: ShaderBaseUniform | undefined
    public UserUniforms: Map<string, UniformField> | undefined
    
    public Filter: boolean
    public Objects: number[] | undefined

    public VertexShader: WebGLShader | null = null
    public FragmentShader: WebGLShader | null = null

    private vertexProgram: string
    private fragmentProgram: string

    public get VertexProgram(): string
    {
        return this.vertexProgram
    }

    public set VertexProgram(vertexProgram: string)
    {
        this.vertexProgram = vertexProgram
        this.Build()
    }

    public get FragmentProgram(): string
    {
        return this.fragmentProgram
    }

    public set FragmentProgram(fragmentProgram: string)
    {
        this.fragmentProgram = fragmentProgram
        this.Build()
    }

    constructor(shader: IShader)
    constructor({ name = 'Shader', height = 1080, width = 1920, filter = true, clear = [0, 0, 0, 1], vertex, fragment }: IShader)
    {
        super(name)

        this.Height = height
        this.Width = width
        this.Filter = filter
        this.Clear = new Colour4(clear as number[])
        this.vertexProgram = vertex
        this.fragmentProgram = fragment
                
        this.Build()

        Shaders.push(this)
    }

    
    public Build(): void
    {
        this.ClearShader()
        this.BuildShaders()
        this.CreateBuffers()

        this.Attribute = new ShaderAttribute(this.Program!)
        this.BaseUniforms = new ShaderBaseUniform(this.Program!)
        this.UserUniforms = new Map<string, UniformField>()
        
        this.ParseProperties()
    }

    public ClearShader(): void
    {
        if (this.Program)
        {
            GL.deleteProgram(this.Program)
        }

        if (this.Texture)
        {
            GL.deleteTexture(this.Texture)
        }

        if (this.VertexShader)
        {
            GL.deleteShader(this.VertexShader)
        }

        if (this.FragmentShader)
        {
            GL.deleteShader(this.FragmentShader)
        }

        if (this.FrameBuffer)
        {
            GL.deleteFramebuffer(this.FrameBuffer)
        }

        if (this.RenderBuffer)
        {
            GL.deleteRenderbuffer(this.RenderBuffer)
        }        

        this.Program = GL.createProgram()
        this.Texture = GL.createTexture()
        this.FrameBuffer = GL.createFramebuffer()
        this.RenderBuffer = GL.createRenderbuffer()
    }

    public BuildShaders(): void
    {
        let errorLog: string[] = [this.Name]

        this.VertexShader = GL.createShader(GL.VERTEX_SHADER)
        GL.shaderSource(this.VertexShader!, this.VertexProgram)
        GL.compileShader(this.VertexShader!)

        if (!GL.getShaderParameter(this.VertexShader!, GL.COMPILE_STATUS))
        {
            errorLog.push('Vertex Shader: ' + GL.getShaderInfoLog(this.VertexShader!))
        }
        
        this.FragmentShader = GL.createShader(GL.FRAGMENT_SHADER)
        GL.shaderSource(this.FragmentShader!, this.FragmentProgram)
        GL.compileShader(this.FragmentShader!)

        if (!GL.getShaderParameter(this.FragmentShader!, GL.COMPILE_STATUS))
        {
            errorLog.push('Fragment Shader: ' + GL.getShaderInfoLog(this.FragmentShader!))
        }
        
        GL.attachShader(this.Program!, this.VertexShader!)
        GL.attachShader(this.Program!, this.FragmentShader!)
        GL.linkProgram(this.Program!)
        if (!GL.getProgramParameter(this.Program!, GL.LINK_STATUS))
        {
            errorLog.push(GL.getProgramInfoLog(this.Program!)!)
        }
        
        if (errorLog.length > 1)
        {
            throw errorLog
        }
    }

    public ParseProperties(): void
    {
        const regex: RegExp = /uniform\s+(?<type>bool|int|float|([biu]?vec|mat)[2-4])\s+(?<name>\w+);/
        const regexGroup: RegExp = /uniform\s+(bool|int|float|([biu]?vec|mat)[2-4])\s+(\w+);/g

        let text = this.VertexProgram + "\n" + this.FragmentProgram
        let matches = text.match(regexGroup) || []

        for (const match of matches)
        {   
            let groups = match.match(regex)

            let type = groups!.groups!.type
            let name = groups!.groups!.name
            let index = GL.getUniformLocation(this.Program!, name)

            if (!this.UserUniforms!.has(name) && index != null)
            {
                this.UserUniforms!.set(name, {index, type})
            }
        }
    }

    public CreateBuffers(): void
    {
        let data = []
        for (let i = 0; i < this.Height * this.Width; ++i)
        {
            data.push(255, 255, 255, 255)
        }

        let arr: Uint8Array = new Uint8Array(data)

        GL.bindFramebuffer(GL.FRAMEBUFFER, this.FrameBuffer)
        GL.bindRenderbuffer(GL.RENDERBUFFER, this.RenderBuffer)
        GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, this.Width, this.Height)
        GL.bindTexture(GL.TEXTURE_2D, this.Texture)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, this.Width, this.Height, 0, GL.RGBA, GL.UNSIGNED_BYTE, arr)
        GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.Texture, 0)
        GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, this.RenderBuffer)
                    
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.bindRenderbuffer(GL.RENDERBUFFER, null)
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    }
}
