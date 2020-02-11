import Item from '../../Logic/Object/Item';
import { GL } from '../../FWGE';
import Colour3 from '../Colour/Colour3';
import Colour4 from '../Colour/Colour4';
import ShaderAttribute from './Definition/ShaderAttribute';
import ShaderBaseUniform from './Definition/ShaderBaseUniform';

export let Shaders: Shader[] = []

export type UniformField =
{
    type: string
    index: WebGLUniformLocation
}

class IShader
{
    name?: string
    height?: number
    width?: number
    filter?: boolean
    clear?: Colour4 | Colour3 | Float32Array | number[]
    vertex: string
    fragment: string
}


function Build(shader: Shader): void
{
    ClearShader(shader)
    BuildShaders(shader)
    CreateBuffers(shader)

    shader.Attribute = new ShaderAttribute(shader.Program)
    shader.BaseUniforms = new ShaderBaseUniform(shader.Program)
    shader.UserUniforms = new Map<string, UniformField>()
    
    ParseProperties(shader)
}

function ClearShader(shader: Shader): void
{
    if (shader.Program)
    {
        GL.deleteProgram(shader.Program)
    }

    if (shader.Texture)
    {
        GL.deleteTexture(shader.Texture)
    }

    if (shader.VertexShader)
    {
        GL.deleteShader(shader.VertexShader)
    }

    if (shader.FragmentShader)
    {
        GL.deleteShader(shader.FragmentShader)
    }

    if (shader.FrameBuffer)
    {
        GL.deleteFramebuffer(shader.FrameBuffer)
    }

    if (shader.RenderBuffer)
    {
        GL.deleteRenderbuffer(shader.RenderBuffer)
    }        

    shader.Program = GL.createProgram()
    shader.Texture = GL.createTexture()
    shader.FrameBuffer = GL.createFramebuffer()
    shader.RenderBuffer = GL.createRenderbuffer()
}

function BuildShaders(shader: Shader): void
{
    let errorLog: string[] = [shader.Name]

    shader.VertexShader = GL.createShader(GL.VERTEX_SHADER)
    GL.shaderSource(shader.VertexShader, shader.VertexProgram)
    GL.compileShader(shader.VertexShader)

    if (!GL.getShaderParameter(shader.VertexShader, GL.COMPILE_STATUS))
    {
        errorLog.push('Vertex Shader: ' + GL.getShaderInfoLog(shader.VertexShader))
    }
    
    shader.FragmentShader = GL.createShader(GL.FRAGMENT_SHADER)
    GL.shaderSource(shader.FragmentShader, shader.FragmentProgram)
    GL.compileShader(shader.FragmentShader)

    if (!GL.getShaderParameter(shader.FragmentShader, GL.COMPILE_STATUS))
    {
        errorLog.push('Fragment Shader: ' + GL.getShaderInfoLog(shader.FragmentShader))
    }
    
    GL.attachShader(shader.Program, shader.VertexShader)
    GL.attachShader(shader.Program, shader.FragmentShader)
    GL.linkProgram(shader.Program)
    if (!GL.getProgramParameter(shader.Program, GL.LINK_STATUS))
    {
        errorLog.push(GL.getProgramInfoLog(shader.Program))
    }
    
    if (errorLog.length > 1)
    {
        throw errorLog
    }
}

function ParseProperties(shader: Shader): void
{
    const regex: RegExp = /uniform\s+(?<type>bool|int|float|([biu]?vec|mat)[2-4])\s+(?<name>\w+);/
    const regexGroup: RegExp = /uniform\s+(bool|int|float|([biu]?vec|mat)[2-4])\s+(\w+);/g

    let text = shader.VertexProgram + "\n" + shader.FragmentProgram
    let matches = text.match(regexGroup) || []

    for (const match of matches)
    {   
        let groups = match.match(regex)

        let type = groups.groups.type
        let name = groups.groups.name
        let index = GL.getUniformLocation(shader.Program, name)

        if (!shader.UserUniforms.has(name))
        {
            shader.UserUniforms.set(name, {index, type})
        }
    }
}

function CreateBuffers(shader: Shader): void
{
    let data = []
    for (let i = 0; i < shader.Height * shader.Width; ++i)
    {
        data.push(255, 255, 255, 255)
    }

    let arr: Uint8Array = new Uint8Array(data)

    GL.bindFramebuffer(GL.FRAMEBUFFER, shader.FrameBuffer)
    GL.bindRenderbuffer(GL.RENDERBUFFER, shader.RenderBuffer)
    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, shader.Width, shader.Height)
    GL.bindTexture(GL.TEXTURE_2D, shader.Texture)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, shader.Width, shader.Height, 0, GL.RGBA, GL.UNSIGNED_BYTE, arr)
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, shader.Texture, 0)
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, shader.RenderBuffer)
                
    GL.bindTexture(GL.TEXTURE_2D, null)
    GL.bindRenderbuffer(GL.RENDERBUFFER, null)
    GL.bindFramebuffer(GL.FRAMEBUFFER, null)
}

export default class Shader extends Item
{
    public Program: WebGLProgram
    public Height: number
    public Width: number
    public Clear: Colour4

    public Texture: WebGLTexture
    public FrameBuffer: WebGLFramebuffer
    public RenderBuffer: WebGLRenderbuffer
    
    public Attribute: ShaderAttribute
    public BaseUniforms: ShaderBaseUniform
    public UserUniforms: Map<string, UniformField>
    
    public Filter: boolean
    public Objects: number[]

    public VertexShader: WebGLShader
    public FragmentShader: WebGLShader

    private vertexProgram: string
    private fragmentProgram: string

    public get VertexProgram(): string
    {
        return this.vertexProgram
    }

    public set VertexProgram(vertexProgram: string)
    {
        this.vertexProgram = vertexProgram
        Build(this)
    }

    public get FragmentProgram(): string
    {
        return this.fragmentProgram
    }

    public set FragmentProgram(fragmentProgram: string)
    {
        this.fragmentProgram = fragmentProgram
        Build(this)
    }

    constructor()
    constructor(shader: IShader)
    constructor({ name = 'Shader', height = 1080, width = 1920, filter = true, clear = [0, 0, 0, 1], vertex, fragment }: IShader = new IShader)
    {
        super(name)

        this.Height = height
        this.Width = width
        this.Filter = filter
        this.Clear = new Colour4(clear as number[])
        this.vertexProgram = vertex
        this.fragmentProgram = fragment
                
        Build(this)

        Shaders.push(this)
    }
}
