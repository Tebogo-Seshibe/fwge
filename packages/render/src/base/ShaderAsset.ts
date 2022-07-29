import { Colour3, Colour4, GL, Matrix2, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "@fwge/common"
import { Asset, Class, Entity } from "@fwge/core"
import { DirectionalLightUniform } from "../components/shader/DirectionalLightUniform"
import { MaterialUniform } from "../components/shader/MaterialUniform"
import { MatrixUniform } from "../components/shader/MatrixUniform"
import { PointLightUniform } from "../components/shader/PointLightUniform"
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
    input?: ShaderInput<any>[]
}

interface IShaderAsset
{
    vertexShader: IShaderSource
    fragmentShader: IShaderSource
    inputs?: ShaderInput<any>[]
}

export class ShaderAsset extends Asset
{
    private _program: WebGLProgram | null = null
    private _vertexShader: WebGLShader | null = null
    private _fragmentShader: WebGLShader | null = null
    private _vertexSource: string | null = null
    private _fragmentSource: string | null = null
    private _inputs: ShaderInput<any>[] = []
    private _inputList: ShaderInput<any>[] = []

    public Matrices: MatrixUniform | null = null
    public Material: MaterialUniform | null = null
    public DirectionalLight: DirectionalLightUniform | null = null
    public Lights: PointLightUniform[] | null = null
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
    constructor(vert: string, frag: string)
    constructor(_0: IShaderAsset | string, _1?: string)
    {
        super()

        const vert = typeof _0 === 'string' ? _0 : _0.vertexShader.source 
        const frag = typeof _0 === 'string' ? _1! : _0.fragmentShader.source 

        this._vertexSource = vert
        this._fragmentSource = frag
        
        this._compileShaders()
        this._getInputs()
        this._findInputs(vert)
        this._findInputs(frag)
        this._inputList.forEach(input => this.Inputs.set(input.sourceName, GL.getUniformLocation(this._program!, input.sourceName)))
    }

    private _findInputs(source: string) {
        [...source.matchAll(/(?:uniform\s+(bool|u?int|float|double|[buid]?vec[234]|mat[234](x[234])?|[iu]?sampler([123]D)|\w+)\s+)(\w+)(?:;)/g)]
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
            
        this.DirectionalLight = new DirectionalLightUniform(
            GL.getUniformLocation(this._program, 'U_DirectionalLight.Colour'),
            GL.getUniformLocation(this._program, 'U_DirectionalLight.Intensity'),
            GL.getUniformLocation(this._program, 'U_DirectionalLight.Direction')
            
        )

        this.Lights = []
        for (let i = 0; i < 4; ++i)
        {
            this.Lights.push(new PointLightUniform(
                GL.getUniformLocation(this._program, `U_PointLight[${i}].Colour`),
                GL.getUniformLocation(this._program, `U_PointLight[${i}].Intensity`),
                GL.getUniformLocation(this._program, `U_PointLight[${i}].Position`),
                GL.getUniformLocation(this._program, `U_PointLight[${i}].Radius`),
            ))
        }
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
            log.push(this._vertexSource.split('\n').map((line, i) => (i + 1) + '\t' + line).join('\n'))
        }


        GL.shaderSource(fragmentShader, this._fragmentSource)
        GL.compileShader(fragmentShader)
        if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS))
        {
            log.push('Fragment Shader: ' + GL.getShaderInfoLog(fragmentShader))
            log.push(this._fragmentSource.split('\n').map((line, i) => (i + 1) + '\t' + line).join('\n'))
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

    Bind(): void
    {   
        GL.useProgram(this.Program)
    }

    UnBind(): void
    {
        GL.useProgram(null)
    }

    SetTexture(index: number, name: string, texture: WebGLTexture): void
    {
        const location = this.Inputs.get(name) ?? GL.getUniformLocation(this.Program!, name)
        if (!location)
        {
            return
        }

        GL.uniform1i(location, index)
        GL.activeTexture(GL.TEXTURE0 + index)
        GL.bindTexture(GL.TEXTURE_2D, texture)
    }

    SetBool(name: string, bool: boolean): void
    {
        const location = this.Inputs.get(name) ?? GL.getUniformLocation(this.Program!, name)
        if (!location)
        {
            return
        }
        
        GL.uniform1i(location, bool ? 1 : 0)
    }
    
    SetInt(name: string, int: number, unsigned: boolean = false): void
    {
        const location = this.Inputs.get(name) ?? GL.getUniformLocation(this.Program!, name)
        if (!location)
        {
            return
        }
        
        if (unsigned)
        {
            GL.uniform1ui(location, int)
        }
        else
        {
            GL.uniform1i(location, int)
        }
    }

    SetFloat(name: string, float: number): void
    {
        const location = this.Inputs.get(name) ?? GL.getUniformLocation(this.Program!, name)
        if (!location)
        {
            return
        }
        
        GL.uniform1f(location, float)
    }
    
    SetIntVector(name: string, vector: Vector2): void
    SetIntVector(name: string, vector: Vector2, unsigned: boolean): void
    SetIntVector(name: string, vector: [number, number]): void
    SetIntVector(name: string, vector: [number, number], unsigned: boolean): void
    SetIntVector(name: string, x: number, y: number): void
    SetIntVector(name: string, x: number, y: number, unsigned: boolean): void
    SetIntVector(name: string, vector: Vector3): void
    SetIntVector(name: string, vector: Vector3, unsigned: boolean): void
    SetIntVector(name: string, vector: [number, number, number]): void
    SetIntVector(name: string, vector: [number, number, number], unsigned: boolean): void
    SetIntVector(name: string, x: number, y: number, z: number): void
    SetIntVector(name: string, x: number, y: number, z: number, unsigned: boolean): void
    SetIntVector(name: string, vector: Vector4): void
    SetIntVector(name: string, vector: Vector4, unsigned: boolean): void
    SetIntVector(name: string, vector: [number, number, number, number]): void
    SetIntVector(name: string, vector: [number, number, number, number], unsigned: boolean): void
    SetIntVector(name: string, x: number, y: number, z: number, w: number): void
    SetIntVector(name: string, x: number, y: number, z: number, w: number, unsigned: boolean): void
    SetIntVector(_0: string, _1:  Vector2 | Vector3 | Vector4 | [number, number] | [number, number, number] | [number, number, number, number] | number, _2?: number | boolean, _3?: number | boolean, _4?: number | boolean, _5?: boolean): void
    {
        const location = this.Inputs.get(_0) ?? GL.getUniformLocation(this.Program!, _0)
        if (!location)
        {
            return
        }

        switch (arguments.length)
        {
            case 6:
            {
                if (_5 as boolean)
                {
                    GL.uniform4ui(location, _1 as number, _2 as number, _3 as number, _4 as number)
                }
                else
                {
                    GL.uniform4i(location, _1 as number, _2 as number, _3 as number, _4 as number)
                }
            }
            break
            case 5:
            {
                if (typeof _4 === 'number')
                {
                    GL.uniform4i(location, _1 as number, _2 as number, _3 as number, _4 as number)
                }
                else if (_4 as boolean)
                {
                    GL.uniform3ui(location, _1 as number, _2 as number, _3 as number)
                }
                else
                {
                    GL.uniform3i(location, _1 as number, _2 as number, _3 as number)
                }
            }
            break
            case 4:
            {
                if (typeof _3 === 'number')
                {
                    GL.uniform3i(location, _1 as number, _2 as number, _3 as number)
                }
                else if (_3 as boolean)
                {
                    GL.uniform2ui(location, _1 as number, _2 as number)
                }
                else
                {
                    GL.uniform2i(location, _1 as number, _2 as number)
                }
            }
            break
            case 3:
            {
                if (typeof _2 === 'number')
                {
                    GL.uniform2i(location, _1 as number, _2 as number)
                }
                else if (_2 as boolean)
                {
                    switch ((_1 as number[]).length)
                    {
                        case 2: GL.uniform2uiv(location, _1 as number[])
                        case 3: GL.uniform3uiv(location, _1 as number[])
                        case 4: GL.uniform4uiv(location, _1 as number[])            
                    }
                }
                else
                {
                    switch ((_1 as number[]).length)
                    {
                        case 2: GL.uniform2iv(location, _1 as number[])
                        case 3: GL.uniform3iv(location, _1 as number[])
                        case 4: GL.uniform4iv(location, _1 as number[])            
                    }
                }
            }
            break
            case 2:
            {
                switch ((_1 as number[]).length)
                {
                    case 2: GL.uniform2iv(location, _1 as number[])
                    case 3: GL.uniform3iv(location, _1 as number[])
                    case 4: GL.uniform4iv(location, _1 as number[])            
                }
            }
            break
        }
    }
    
    SetFloatVector(name: string, vector: Vector2): void
    SetFloatVector(name: string, vector: [number, number]): void
    SetFloatVector(name: string, x: number, y: number): void
    SetFloatVector(name: string, vector: Vector3 | Colour3): void
    SetFloatVector(name: string, vector: [number, number, number]): void
    SetFloatVector(name: string, x: number, y: number, z: number): void
    SetFloatVector(name: string, vector: Vector4 | Colour4): void
    SetFloatVector(name: string, vector: [number, number, number, number]): void
    SetFloatVector(name: string, x: number, y: number, z: number, w: number): void
    SetFloatVector(_0: string, _1: Vector2 | Vector3 | Vector4 | Colour3 | Colour4 | [number, number] | [number, number, number] | [number, number, number, number] | number, _2?: number, _3?: number, _4?: number): void
    {
        const location = this.Inputs.get(_0) ?? GL.getUniformLocation(this.Program!, _0)
        if (!location)
        {
            return
        }

        switch (arguments.length)
        {
            case 5: 
                GL.uniform4f(location, _1 as number, _2 as number, _3 as number, _4 as number)
            break
            case 4: 
                GL.uniform3f(location, _1 as number, _2 as number, _3 as number)
            break
            case 3: 
                GL.uniform2f(location, _1 as number, _2 as number)
            break
            case 2: 
                switch ((_1 as number[]).length)
                {
                    case 2:
                        GL.uniform2fv(location, _1 as number[])
                    break
                    case 3:
                        GL.uniform3fv(location, _1 as number[])
                    break
                    case 4:
                        GL.uniform4fv(location, _1 as number[])
                    break
                }
            break
        }
        if (typeof _1 === 'number')
        {

        }
        else
        {
            switch (_1.length)
            {
                case 2:
                    GL.uniform2fv(location, _1)
                break
                case 3:
                    GL.uniform3fv(location, _1)
                break
                case 4:
                    GL.uniform4fv(location, _1)
                break        
            }
        }
    }
    
    SetMatrix(name: string, matrix: Matrix2): void
    SetMatrix(name: string, matrix: Matrix2, transpose: boolean): void
    SetMatrix(name: string, matrix: [number, number, number, number]): void
    SetMatrix(name: string, matrix: [number, number, number, number], transpose: boolean): void
    SetMatrix(name: string, matrix: Matrix3): void
    SetMatrix(name: string, matrix: Matrix3, transpose: boolean): void
    SetMatrix(name: string, matrix: [number, number, number, number, number, number, number, number, number]): void
    SetMatrix(name: string, matrix: [number, number, number, number, number, number, number, number, number], transpose: boolean): void
    SetMatrix(name: string, matrix: Matrix4): void
    SetMatrix(name: string, matrix: Matrix4, transpose: boolean): void
    SetMatrix(name: string, matrix: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]): void
    SetMatrix(name: string, matrix: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number], transpose: boolean): void
    SetMatrix(name: string, matrix: Matrix2 | Matrix3 | Matrix4 | [number, number, number, number] | [number, number, number, number, number, number, number, number, number] | [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number], tranpose: boolean = false): void
    {
        const location = this.Inputs.get(name) ?? GL.getUniformLocation(this.Program!, name)
        if (!location)
        {
            return
        }

        switch (matrix.length)
        {
            case 4:
                GL.uniformMatrix2fv(location, tranpose, matrix)
            break
            case 9:
                GL.uniformMatrix3fv(location, tranpose, matrix)
            break
            case 16:
                GL.uniformMatrix4fv(location, tranpose, matrix)            
            break
        }
    }
}
