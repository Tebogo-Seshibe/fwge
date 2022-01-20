import { Colour3, Colour4 } from "../../atoms"
import { Component } from "../../ecs"
import { GL } from "../../ecs/GL"
import { AmbientLightUniform } from "./AmbientLightUniform"
import { DirectionalLightUniform } from "./DirectionalLightUniform"
import { GlobalUniform } from "./GlobalUniform"
import { MaterialUniform } from "./MaterialUniform"
import { MatrixUniform } from "./MatrixUniform"
import { PointLightUniform } from "./PointLightUniform"
import { ShaderAttribute } from "./ShaderAttribute"
import { ShaderUniforms } from "./ShaderUniforms"

interface IShader
{
    height?: number
    width?: number
    baseColour?: Colour4 | Colour3 | [number, number, number, number] | [number, number, number]
}

type UniformField =
{
    type: string
    index: WebGLUniformLocation
}

export class Shader extends Component
{
    #clear!: Colour4
    #height!: number
    #width!: number
    #vertexSrc: string | null = null
    #fragmentSrc: string | null = null

    Program: WebGLProgram | null = null
    Filter: boolean = false

    OffsetX: number = 0
    OffsetY: number = 0
    Layers: number = 0
    
    Attributes?: ShaderAttribute
    BaseUniforms?: ShaderUniforms
    UserUniforms: Map<string, UniformField> = new Map()

    VertexShader: WebGLShader | null = null
    FragmentShader: WebGLShader | null = null
    Texture: WebGLTexture | null = null
    FrameBuffer: WebGLFramebuffer | null = null
    RenderBuffer: WebGLRenderbuffer | null = null

    get Clear(): Colour4
    {
        return this.#clear
    }

    set Clear(clear: Float32Array | [number, number, number] | [number, number, number, number] | Colour3 | Colour4)
    {
        this.#clear = new Colour4([...clear])
    }

    get Height(): number
    {
        return this.#height
    }

    set Height(height: number)
    {
        this.#height = height

        if (this.Program)
        {
            BuildBuffers(this)
        }
    }
    
    get Width(): number
    {
        return this.#width
    }

    set Width(width: number)
    {
        this.#width = width

        if (this.Program)
        {
            BuildBuffers(this)
        }
    }

    set VertexSource(src: string | null)
    {
        this.#vertexSrc = src

        if (this.#vertexSrc && this.#fragmentSrc)
        {
            BuildShader(this, this.#vertexSrc!, this.#fragmentSrc!)
        }
        else
        {
            ClearFunction(this)
        }
    }

    set FragmentSource(src: string | null)
    {
        this.#fragmentSrc = src

        if (this.#vertexSrc && this.#fragmentSrc)
        {
            BuildShader(this, this.#vertexSrc!, this.#fragmentSrc!)
        }
        else
        {
            ClearFunction(this)
        }
    }

    constructor(vertexShader: string, fragmentShader: string)
    constructor(vertexShader: string, fragmentShader: string, properties: IShader)
    constructor(vertexShader: string, fragmentShader: string, args: IShader = { })
    {
        super()

        this.Height = args.height ?? 1080
        this.Width = args.width ?? 1920
        this.Clear = args.baseColour ?? new Colour4(0.0, 0.0, 0.0, 1.0)

        this.VertexSource = vertexShader
        this.FragmentSource = fragmentShader
    }
}

function BuildShader(shader: Shader, vertexSrc: string, fragmentSrc: string): void
{
    ClearFunction(shader)

    shader.Program = GL.createProgram()!
    shader.VertexShader = GL.createShader(GL.VERTEX_SHADER)!
    shader.FragmentShader = GL.createShader(GL.FRAGMENT_SHADER)!
    shader.Texture = GL.createTexture()!
    shader.FrameBuffer = GL.createFramebuffer()!
    shader.RenderBuffer = GL.createRenderbuffer()!

    GL.shaderSource(shader.VertexShader, vertexSrc)
    GL.compileShader(shader.VertexShader)
    if (!GL.getShaderParameter(shader.VertexShader, GL.COMPILE_STATUS))
    {
        console.info('Vertex Shader: ' + GL.getShaderInfoLog(shader.VertexShader!))
    }
    
    
    GL.shaderSource(shader.FragmentShader, fragmentSrc)
    GL.compileShader(shader.FragmentShader)
    if (!GL.getShaderParameter(shader.FragmentShader, GL.COMPILE_STATUS))
    {
        console.info('Fragment Shader: ' + GL.getShaderInfoLog(shader.FragmentShader!))
    }

    GL.attachShader(shader.Program, shader.VertexShader)
    GL.attachShader(shader.Program, shader.FragmentShader)
    GL.linkProgram(shader.Program)
    if (!GL.getProgramParameter(shader.Program, GL.LINK_STATUS))
    {
        console.info(GL.getProgramInfoLog(shader.Program)!)
    }
    
    BuildBuffers(shader)

    shader.Attributes = new ShaderAttribute(
        GL.getAttribLocation(shader.Program, 'A_Position'),
        GL.getAttribLocation(shader.Program, 'A_Colour'),
        GL.getAttribLocation(shader.Program, 'A_UV'),
        GL.getAttribLocation(shader.Program, 'A_Normal')
    )

    shader.BaseUniforms = new ShaderUniforms(
        new MatrixUniform(
            GL.getUniformLocation(shader.Program, 'U_Matrix.ModelView'),
            GL.getUniformLocation(shader.Program, 'U_Matrix.Projection'),
            GL.getUniformLocation(shader.Program, 'U_Matrix.Normal'),
            GL.getUniformLocation(shader.Program, 'U_Matrix.Camera')
        ),
        new MaterialUniform(
            GL.getUniformLocation(shader.Program, 'U_Material.Ambient'),
            GL.getUniformLocation(shader.Program, 'U_Material.Diffuse'),
            GL.getUniformLocation(shader.Program, 'U_Material.Specular'),
            GL.getUniformLocation(shader.Program, 'U_Material.Shininess'),
            GL.getUniformLocation(shader.Program, 'U_Material.Alpha'),
            GL.getUniformLocation(shader.Program, 'U_Material.ImageMap'),
            GL.getUniformLocation(shader.Program, 'U_Material.BumpMap'),
            GL.getUniformLocation(shader.Program, 'U_Material.SpecularMap')
        ),
        new AmbientLightUniform(
            GL.getUniformLocation(shader.Program, `U_Ambient.Colour`),
            GL.getUniformLocation(shader.Program, `U_Ambient.Intensity`)
        ),
        new Array(3).fill(undefined).map((_, index) => 
            new DirectionalLightUniform(
                GL.getUniformLocation(shader.Program!, `U_Directional[${index}].Colour`),
                GL.getUniformLocation(shader.Program!, `U_Directional[${index}].Intensity`),
                GL.getUniformLocation(shader.Program!, `U_Directional[${index}].Direction`)
            )
        ),
        3,
        new Array(8).fill(undefined).map((_, index) => 
            new PointLightUniform(
                GL.getUniformLocation(shader.Program!, `U_Point[${index}].Colour`),
                GL.getUniformLocation(shader.Program!, `U_Point[${index}].Intensity`),
                GL.getUniformLocation(shader.Program!, `U_Point[${index}].Position`),
                GL.getUniformLocation(shader.Program!, `U_Point[${index}].Radius`),
                GL.getUniformLocation(shader.Program!, `U_Point[${index}].Angle`)
            )
        ),
        8,
        new GlobalUniform(
            GL.getUniformLocation(shader.Program, 'U_Global.Time'),
            GL.getUniformLocation(shader.Program, 'U_Global.Resolution'),
            GL.getUniformLocation(shader.Program, 'U_Global.NearClip'),
            GL.getUniformLocation(shader.Program, 'U_Global.FarClip'),
            GL.getUniformLocation(shader.Program, 'U_Global.ObjectID'),
            GL.getUniformLocation(shader.Program, 'U_Global.ObjectCount')
        )
    )
}

function ClearFunction(shader: Shader)
{
    if (shader.Program)
    {
        GL.deleteFramebuffer(shader.FrameBuffer)
        GL.deleteRenderbuffer(shader.RenderBuffer)
        GL.deleteTexture(shader.Texture)
        GL.deleteShader(shader.VertexShader)
        GL.deleteShader(shader.FragmentShader)
        GL.deleteProgram(shader.Program)
    }
}

function BuildBuffers(shader: Shader): void
{
    GL.bindFramebuffer(GL.FRAMEBUFFER, shader.FrameBuffer)
    GL.bindRenderbuffer(GL.RENDERBUFFER, shader.RenderBuffer)
    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, shader.Width, shader.Height)

    GL.bindTexture(GL.TEXTURE_2D, shader.Texture)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, shader.Width, shader.Height, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array(shader.Width * shader.Height * 4))
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, shader.Texture, 0)
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, shader.RenderBuffer)
                
    GL.bindTexture(GL.TEXTURE_2D, null)
    GL.bindRenderbuffer(GL.RENDERBUFFER, null)
    GL.bindFramebuffer(GL.FRAMEBUFFER, null)
}
