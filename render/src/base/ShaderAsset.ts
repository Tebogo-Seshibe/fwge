import { GL } from "@fwge/common"
import { Asset, Class, Entity } from "@fwge/core"
import { MaterialUniform } from "../components/shader/MaterialUniform"
import { MatrixUniform } from "../components/shader/MatrixUniform"
import { ShaderFieldType } from "../components/shader/types/Types"

export class ShaderInput<T extends ShaderFieldType<any>>
{
  constructor(
    public sourceType: Class<T>,
    public sourceName: string,
    public selector?: (arg: Entity) => any
  ) { }
}

interface IShaderSource
{
    source: string
    input: ShaderInput<any>[]
}

interface IShaderAsset
{
    vertexShader: IShaderSource
    fragmentShader: IShaderSource
}

export class ShaderAsset extends Asset
{
    private _program: WebGLProgram | null = null
    private _vertexShader: WebGLShader | null = null
    private _fragmentShader: WebGLShader | null = null
    private _vertexSource: string | null = null
    private _fragmentSource: string | null = null
    private _inputs: ShaderInput<any>[] = []

    public Matrices: MatrixUniform | null = null
    public Material: MaterialUniform | null = null
    public readonly Inputs: Map<string, WebGLUniformLocation | null> = new Map()
    
    get Program(): WebGLProgram | null
    {
        return this._program
    }
    
    get VertexShader(): WebGLShader | null
    {
        return this._vertexShader
    }
    
    get FragmentShader(): WebGLShader | null
    {
        return this._fragmentShader
    }
    
    get VertexSource(): string | null
    {
        return this._vertexSource
    }
    
    set VertexSource(vertexSource: string | null)
    {
        this._vertexSource = vertexSource
        this._compileShaders()
        this._getInputs()
    }
    
    get FragmentSource(): string | null
    {
        return this._fragmentSource
    }
    
    set FragmentSource(fragmentSource: string | null)
    {
        this._fragmentSource = fragmentSource
        this._compileShaders()
        this._getInputs()
    }

    constructor(config: IShaderAsset)
    {
        super('')

        this._vertexSource = config.vertexShader.source
        this._fragmentSource = config.fragmentShader.source
        this._inputs = [ ...config.vertexShader.input, ...config.fragmentShader.input ]

        this._compileShaders()
        this._getInputs()
    }

    _getInputs()
    {
        if (!this._program)
        {
            return
        }

        GL.useProgram(this._program)

        for (const input of this._inputs)
        {
            this.Inputs.set(input.sourceName, GL.getUniformLocation(this._program, input.sourceName))
        }
        
        this.Matrices = new MatrixUniform(
            GL.getUniformLocation(this._program, 'U_Matrix.ModelView'),
            GL.getUniformLocation(this._program, 'U_Matrix.Projection'),
            GL.getUniformLocation(this._program, 'U_Matrix.Normal'),
            GL.getUniformLocation(this._program, 'U_Matrix.View')
        )
        this.Material = new MaterialUniform(
            GL.getUniformLocation(this._program, 'U_Material.Ambient'),
            GL.getUniformLocation(this._program, 'U_Material.Diffuse'),
            GL.getUniformLocation(this._program, 'U_Material.Specular'),
            GL.getUniformLocation(this._program, 'U_Material.Shininess'),
            GL.getUniformLocation(this._program, 'U_Material.Alpha'),
            GL.getUniformLocation(this._program, 'U_Material.ImageMap'),
            GL.getUniformLocation(this._program, 'U_Material.BumpMap'),
            GL.getUniformLocation(this._program, 'U_Material.SpecularMap'),
            GL.getUniformLocation(this._program, 'U_Material.HasImageMap')
        )
        
        GL.useProgram(null)
    }

    readAsset(vertexSource: string, fragmentSource: string): void
    {
        throw new Error("Method not implemented.")
    }

    upateAsset(...sources: { source: string; value: any }[]): void
    {
        throw new Error("Method not implemented.")
    }
    
    private _compileShaders(): void
    {
        if (this._vertexSource ===  null || this._fragmentSource === null)
        {
            return
        }

        const program = GL.createProgram()
        const vertexShader = GL.createShader(GL.VERTEX_SHADER)
        const fragmentShader = GL.createShader(GL.FRAGMENT_SHADER)

        if (!program)
        {
            throw new Error('WebGL failed to create shader program')
        }

        if (!vertexShader)
        {
            throw new Error('WebGL failed to create vertex shader')
        }

        if (!fragmentShader)
        {
            throw new Error('WebGL failed to create fragment shader')
        }

        const log = []

        GL.shaderSource(vertexShader, this._vertexSource)
        GL.compileShader(vertexShader)
        if (!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS))
        {
            log.push('Vertex Shader: ' + GL.getShaderInfoLog(vertexShader))
        }


        GL.shaderSource(fragmentShader, this._fragmentSource)
        GL.compileShader(fragmentShader)
        if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS))
        {
            log.push('Fragment Shader: ' + GL.getShaderInfoLog(fragmentShader))
        }

        GL.attachShader(program, vertexShader)
        GL.attachShader(program, fragmentShader)
        GL.linkProgram(program)
        if (!GL.getProgramParameter(program, GL.LINK_STATUS))
        {
            log.push(GL.getProgramInfoLog(program))
        }

        if (log.length > 0)
        {
            throw new Error(log.join('\n'))
        }

        if (this._program)
        {
            GL.deleteProgram(this._program)
            GL.deleteShader(this._vertexShader)
            GL.deleteShader(this._fragmentShader)
        }

        this._program = program
        this._vertexShader = vertexShader
        this._fragmentShader = fragmentShader
    }
}
