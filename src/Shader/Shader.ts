import Item from '../Item'
import ShaderAttributes from './ShaderAttributes'
import ShaderUniforms from './ShaderUniforms'

class IShader
{
    name: string = 'Shader'
    height: number = 1024
    width: number = 1024
    vertexshader: string = ''
    fragmentshader: string = ''
    gl: WebGLRenderingContext
}

export let Shaders: Shader[] = []

export default class Shader extends Item
{
    public readonly Attributes: ShaderAttributes
    public readonly Uniforms: ShaderUniforms

    public Program: WebGLProgram
    public Texture: WebGLTexture
    public FrameBuffer: WebGLBuffer
    public RenderBuffer: WebGLBuffer
    public Height: number
    public Width: number

    constructor({ name, height, width, vertexshader, fragmentshader, gl }: IShader)
    {
        super(name)

        this.Program = gl.createProgram()
        this.Texture = gl.createTexture()
        this.FrameBuffer = gl.createFramebuffer()
        this.RenderBuffer = gl.createRenderbuffer()
        this.Height = height
        this.Width = width

        this.Attributes = new ShaderAttributes(gl, this.Program)
        this.Uniforms = new ShaderUniforms(gl, this.Program)
        
        Shader.Init(this, new WebGLRenderingContext, vertexshader, fragmentshader)
        Shaders.push(this);
    };


    static Init(shader: Shader, gl: WebGLRenderingContext, vertexshader: string, fragmentshader: string): void
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, shader.FrameBuffer)
        gl.bindRenderbuffer(gl.RENDERBUFFER, shader.RenderBuffer)
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, shader.Width, shader.Height)
        gl.bindTexture(gl.TEXTURE_2D, shader.Texture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, shader.Width, shader.Height, 0, gl.RGBA, gl.UNSIGNED_BYTE, undefined)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, shader.Texture, 0)
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, shader.RenderBuffer)
                    
        gl.bindTexture(gl.TEXTURE_2D, null)
        gl.bindRenderbuffer(gl.RENDERBUFFER, null)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        
        let errorLog: string[] = []

        let vs = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vs, vertexshader)
        gl.compileShader(vs)

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
        {
            errorLog.push('Vertex Shader: ' + gl.getShaderInfoLog(vs))
        }
        
        let fs = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fs, fragmentshader)
        gl.compileShader(fs)

        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
        {
            errorLog.push('Fragment Shader: ' + gl.getShaderInfoLog(fs))
        }
        
        gl.attachShader(shader.Program, vs);
        gl.attachShader(shader.Program, fs);
        gl.linkProgram(shader.Program);
        if (!gl.getProgramParameter(shader.Program, gl.LINK_STATUS))
            errorLog.push(gl.getProgramInfoLog(shader.Program))

        throw errorLog
    }
}