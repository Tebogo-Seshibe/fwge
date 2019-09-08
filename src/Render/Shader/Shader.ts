import Item from '../../Item';
import { GL } from '../../Logic/Utility/Control';
import ShaderAttributes from './Instance/ShaderAttributes';
import ShaderUniforms from './Instance/ShaderUniforms';

export class IShader
{
    name?: string
    height?: number
    width?: number
    vertex: string
    fragment: string
}
export let Shaders: Shader[] = new Array<Shader>()

export type UniformField =
{
    type: string
    index: number
}

export default class Shader extends Item
{
    public readonly Attribute: Map<string, number>
    public readonly Uniform: Map<string, UniformField>

    public readonly Attributes: ShaderAttributes
    public readonly Uniforms: ShaderUniforms

    public readonly VertexShader: string
    public readonly FragmentShader: string

    public Program: WebGLProgram
    public Texture: WebGLTexture
    public FrameBuffer: WebGLBuffer
    public RenderBuffer: WebGLBuffer
    public Height: number
    public Width: number

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
        
        Shader.Init(this, GL, vertex, fragment)

        this.Attribute = new Map
        this.Uniform = new Map

        this.Attributes = new ShaderAttributes(GL, this.Program)
        this.Uniforms = new ShaderUniforms(GL, this.Program)

        this.Attribute = new Map
        // this.Attribute['Position'] = {
        //     type: 'vec3',
        //     index: GL.getAttribLocation(this.Program, 'A_Position')
        // }
        // this.Attribute['Colour'] = {
        //     type: 'vec4',
        //     index: GL.getAttribLocation(this.Program, 'A_Colour')
        // }
        // this.Attribute['UV'] = {
        //     type: 'vec2',
        //     index: GL.getAttribLocation(this.Program, 'A_UV')
        // }
        // this.Attribute['Normal'] = {
        //     type: 'vec3',
        //     index: GL.getAttribLocation(this.Program, 'A_Normal')
        //}

        for (const attribute of this.Attribute)
        {
            const [type, index] = attribute
            
        }
        
        Shaders.push(this);
    }


    static Init(shader: Shader, GL: WebGLRenderingContext, vertexshader: string, fragmentshader: string): void
    {
        GL.bindFramebuffer(GL.FRAMEBUFFER, shader.FrameBuffer)
        GL.bindRenderbuffer(GL.RENDERBUFFER, shader.RenderBuffer)
        GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, shader.Width, shader.Height)
        GL.bindTexture(GL.TEXTURE_2D, shader.Texture)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, shader.Width, shader.Height, 0, GL.RGBA, GL.UNSIGNED_BYTE, undefined)
        GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, shader.Texture, 0)
        GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, shader.RenderBuffer)
                    
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.bindRenderbuffer(GL.RENDERBUFFER, null)
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
        
        let errorLog: string[] = []

        let vs = GL.createShader(GL.VERTEX_SHADER)
        GL.shaderSource(vs, vertexshader)
        GL.compileShader(vs)

        if (!GL.getShaderParameter(vs, GL.COMPILE_STATUS))
        {
            errorLog.push('Vertex Shader: ' + GL.getShaderInfoLog(vs))
        }
        
        let fs = GL.createShader(GL.FRAGMENT_SHADER)
        GL.shaderSource(fs, fragmentshader)
        GL.compileShader(fs)

        if (!GL.getShaderParameter(fs, GL.COMPILE_STATUS))
        {
            errorLog.push('Fragment Shader: ' + GL.getShaderInfoLog(fs))
        }
        
        GL.attachShader(shader.Program, vs);
        GL.attachShader(shader.Program, fs);
        GL.linkProgram(shader.Program);
        if (!GL.getProgramParameter(shader.Program, GL.LINK_STATUS))
        {
            errorLog.push(GL.getProgramInfoLog(shader.Program))
        }
        
        if (errorLog.length > 0)
        {
            throw errorLog
        }
    }
}

// new Shader(
// {
//     name: 'Combined Shader',
//     vertexshader:
// `#version 300 es

// in vec3 A_Position;

// void main()
// {
//     gl_Position = vec4(A_Position, 1.0);
// }`,
//     fragmentshader:
// `#version 300 es

// mediump float;

// out vec4 fragmentColour;

// void main()
// {
//     fragmentColour = vec4(1.0);
// }`
// })