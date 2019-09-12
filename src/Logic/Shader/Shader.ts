import Item from '../../Item';
import { GL } from '../../FWGE';
import ShaderAttributes from './Instance/ShaderAttributes';
import ShaderUniforms from './Instance/ShaderUniforms';

export let Shaders: Shader[] = []

export type UniformField =
{
    type: string
    index: WebGLUniformLocation
}

export class IShader
{
    name?: string
    height?: number
    width?: number
    vertex: string
    fragment: string
}

export default class Shader extends Item
{
    public Program: WebGLProgram
    public Texture: WebGLTexture
    public FrameBuffer: WebGLFramebuffer
    public RenderBuffer: WebGLRenderbuffer
    public Height: number
    public Width: number

    public Attribute: Map<string, number>
    public Uniform: Map<string, UniformField>

    public Attributes: ShaderAttributes
    public Uniforms: ShaderUniforms

    private vertexShader: string
    public get VertexShader(): string
    {
        return this.vertexShader
    }
    public set VertexShader(vertexShader: string)
    {
        this.vertexShader = vertexShader
        this.Build()
    }

    private fragmentShader: string
    public get FragmentShader(): string
    {
        return this.fragmentShader
    }
    public set FragmentShader(fragmentShader: string)
    {
        this.fragmentShader = fragmentShader
        this.Build()
    }

    constructor()
    constructor(shader: IShader)
    constructor({ name = 'Shader', height = 1024, width = 1024, vertex, fragment}: IShader = new IShader)
    {
        super(name)

        this.Program = GL.createProgram()
        this.Texture = GL.createTexture()
        this.FrameBuffer = GL.createFramebuffer()
        this.RenderBuffer = GL.createRenderbuffer()
        this.Height = height
        this.Width = width
        this.vertexShader = vertex
        this.fragmentShader = fragment        
        
        this.Attribute = new Map
        this.Uniform = new Map
        
        
        this.Build()

        Shaders.push(this)
    }

    private Build(): void
    {
        this.BuildShaders()

        this.Attributes = new ShaderAttributes(GL, this.Program)
        this.Uniforms = new ShaderUniforms(GL, this.Program)
        
        this.CreateBuffers()
        this.ParseProperties()
    }
    
    private ParseProperties(): void
    {
        const regex: RegExp = /uniform\s+(?<type>bool|int|float|([biu]?vec|mat)[2-4])\s+(?<name>\w+);/
        const regexGroup: RegExp = /uniform\s+(bool|int|float|([biu]?vec|mat)[2-4])\s+(\w+);/g

        let text = this.VertexShader + "\n" + this.FragmentShader
        let matches = text.match(regexGroup) || []

        for (const match of matches)
        {   
            let groups = match.match(regex)

            let type = groups.groups.type
            let name = groups.groups.name
            let index = GL.getUniformLocation(this.Program, name)

            if (!this.Uniform.has(name))
            {
                this.Uniform.set(name, {index, type})
            }
        }
    }

    private CreateBuffers(): void
    {
        GL.bindFramebuffer(GL.FRAMEBUFFER, this.FrameBuffer)
        GL.bindRenderbuffer(GL.RENDERBUFFER, this.RenderBuffer)
        GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, this.Width, this.Height)
        GL.bindTexture(GL.TEXTURE_2D, this.Texture)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, this.Width, this.Height, 0, GL.RGBA, GL.UNSIGNED_BYTE, undefined)
        GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.Texture, 0)
        GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, this.RenderBuffer)
                    
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.bindRenderbuffer(GL.RENDERBUFFER, null)
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    }

    private BuildShaders(): void
    {
        let errorLog: string[] = []

        const vs = GL.createShader(GL.VERTEX_SHADER)
        GL.shaderSource(vs, this.VertexShader)
        GL.compileShader(vs)

        if (!GL.getShaderParameter(vs, GL.COMPILE_STATUS))
        {
            errorLog.push('Vertex Shader: ' + GL.getShaderInfoLog(vs))
        }
        
        const fs = GL.createShader(GL.FRAGMENT_SHADER)
        GL.shaderSource(fs, this.FragmentShader)
        GL.compileShader(fs)

        if (!GL.getShaderParameter(fs, GL.COMPILE_STATUS))
        {
            errorLog.push('Fragment Shader: ' + GL.getShaderInfoLog(fs))
        }
        
        GL.attachShader(this.Program, vs)
        GL.attachShader(this.Program, fs)
        GL.linkProgram(this.Program)
        if (!GL.getProgramParameter(this.Program, GL.LINK_STATUS))
        {
            errorLog.push(GL.getProgramInfoLog(this.Program))
        }
        
        if (errorLog.length > 0)
        {
            throw errorLog
        }
    }
}
