import { Colour3, Colour4 } from "../atoms"
import { GL, Component } from "../ecs"

export interface IShader
{
    height?: number
    width?: number
    baseColour?: Float32Array | [number, number, number] | [number, number, number, number] | Colour3 | Colour4
}

export type UniformField =
{
    type: string
    index: WebGLUniformLocation
}

export class ShaderAttribute
{
    constructor(
        public readonly Position: number = -1,
        public readonly Colour: number = -1,
        public readonly UV: number = -1,
        public readonly Normal: number = -1
    ) { }
}

export class MatrixUniform
{
    constructor(
        public readonly ModelView: WebGLUniformLocation | null,
        public readonly Projection: WebGLUniformLocation | null,
        public readonly Normal: WebGLUniformLocation | null,
        public readonly Camera: WebGLUniformLocation | null
    ) { }
}

export class AmbientLightUniform
{
    constructor(
        public readonly Colour: WebGLUniformLocation | null,
        public readonly Intensity: WebGLUniformLocation | null
    ) { }
}

export class DirectionalLightUniform
{
    constructor(
        public readonly Colour: WebGLUniformLocation | null,
        public readonly Intensity: WebGLUniformLocation | null,
        public readonly Direction: WebGLUniformLocation | null
    ) { }
}

export class PointLightUniform
{
    constructor(
        public readonly Colour: WebGLUniformLocation | null,
        public readonly Intensity: WebGLUniformLocation | null,
        public readonly Position: WebGLUniformLocation | null,
        public readonly Radius: WebGLUniformLocation | null,
        public readonly Angle: WebGLUniformLocation | null
    ) { }
}

export class MaterialUniform
{
    constructor(
        public readonly AmbientColour: WebGLUniformLocation | null,
        public readonly DiffuseColour: WebGLUniformLocation | null,
        public readonly SpecularColour: WebGLUniformLocation | null,
        public readonly Shininess: WebGLUniformLocation | null,
        public readonly Alpha: WebGLUniformLocation | null,
        
        public readonly ImageSampler: WebGLUniformLocation | null,
        public readonly BumpSampler: WebGLUniformLocation | null,
        public readonly SpecularSampler: WebGLUniformLocation | null
    ) { }
}

export class GlobalUniform
{
    constructor(        
        public readonly Time: WebGLUniformLocation | null,
        public readonly Resolution: WebGLUniformLocation | null,
        public readonly NearClip: WebGLUniformLocation | null,
        public readonly FarClip: WebGLUniformLocation | null,
        public readonly ObjectID: WebGLUniformLocation | null,
        public readonly ObjectCount: WebGLUniformLocation | null
    ) { }
}

export class ShaderUniforms
{
    constructor(
        public readonly Matrix: MatrixUniform,
        public readonly Material: MaterialUniform,
        public readonly AmbientLight: AmbientLightUniform,
        public readonly DirectionalLights: DirectionalLightUniform[],
        public readonly DirectionalLightCount: WebGLUniformLocation | null,
        public readonly PointLights: PointLightUniform[],
        public readonly PointLightCount: WebGLUniformLocation | null,
        public readonly Global: GlobalUniform
    ) { }
}

export class Shader extends Component
{
    private _clear!: Colour4
    private _height!: number
    private _width!: number

    public Program: WebGLProgram | null = null
    public Filter: boolean = false

    public OffsetX: number = 0
    public OffsetY: number = 0
    public Layers: number = 0
    
    public Attributes?: ShaderAttribute
    public BaseUniforms?: ShaderUniforms
    public UserUniforms: Map<string, UniformField> = new Map()

    public VertexShader: WebGLShader | null = null
    public FragmentShader: WebGLShader | null = null
    public Texture: WebGLTexture | null = null
    public FrameBuffer: WebGLFramebuffer | null = null
    public RenderBuffer: WebGLRenderbuffer | null = null

    public get Clear(): Colour4
    {
        return this._clear
    }
    public set Clear(clear: Float32Array | [number, number, number] | [number, number, number, number] | Colour3 | Colour4)
    {
        this._clear = new Colour4([...clear])
    }

    public get Height(): number
    {
        return this._height
    }
    public set Height(height: number)
    {
        this._height = height

        if (this.Program)
        {
            BuildBuffers(this)
        }
    }
    
    public get Width(): number
    {
        return this._width
    }
    public set Width(width: number)
    {
        this._width = width

        if (this.Program)
        {
            BuildBuffers(this)
        }
    }

    public _vertexSrc?: string
    public set Vertex(src: string)
    {
        this._vertexSrc = src

        if (this._vertexSrc && this._fragmentSrc)
        {
            BuildShader(this)
        }
    }

    public _fragmentSrc?: string
    public set Fragment(src: string)
    {
        this._fragmentSrc = src

        if (this._vertexSrc && this._fragmentSrc)
        {
            BuildShader(this)
        }
    }

    constructor(vertexShader: string, fragmentShader: string)
    constructor(vertexShader: string, fragmentShader: string, properties: IShader)
    constructor(vertexShader: string, fragmentShader: string, args: IShader =
    { 
        height: 1080,
        width: 1920,
        baseColour: new Colour4(0.0, 0.0, 0.0, 1.0)
    })
    {
        super(Shader)

        this.Height = args.height!
        this.Width = args.width!
        this.Clear = args.baseColour!

        this.Vertex = vertexShader
        this.Fragment = fragmentShader
    }
}

function BuildShader(shader: Shader): void
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

    shader.Program = GL.createProgram()!
    shader.VertexShader = GL.createShader(GL.VERTEX_SHADER)!
    shader.FragmentShader = GL.createShader(GL.FRAGMENT_SHADER)!
    shader.Texture = GL.createTexture()!
    shader.FrameBuffer = GL.createFramebuffer()!
    shader.RenderBuffer = GL.createRenderbuffer()!

    GL.shaderSource(shader.VertexShader, shader._vertexSrc!)
    GL.compileShader(shader.VertexShader)
    if (!GL.getShaderParameter(shader.VertexShader, GL.COMPILE_STATUS))
    {
        console.info('Vertex Shader: ' + GL.getShaderInfoLog(shader.VertexShader!))
    }
    
    
    GL.shaderSource(shader.FragmentShader, shader._fragmentSrc!)
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
