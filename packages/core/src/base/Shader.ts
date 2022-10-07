import { Colour3, Colour4, GL, Matrix2, Matrix3, Matrix4, Scalar, Vector2, Vector3, Vector4 } from "@fwge/common"
import { Asset } from "./Asset"

export class Shader extends Asset
{
    static readonly Includes: Map<string, string> = new Map()
    
    #program: WebGLProgram | null = null
    #vertexShader: WebGLShader | null = null
    #fragmentShader: WebGLShader | null = null
    #rawVertexSource: string | null = null
    #rawFragmentSource: string | null = null
    #vertexSource: string | null = null
    #fragmentSource: string | null = null

    #samplerIndex: number = 0
    #maxSamplerIndex: number = GL.getParameter(GL.MAX_COMBINED_TEXTURE_IMAGE_UNITS)

    public readonly Inputs: {[key: string]: WebGLUniformLocation | undefined} = {}
    public readonly Ignore: Set<string> = new Set()

    get Program(): WebGLProgram | null
    {
        return this.#program
    }

    get VertexShader(): WebGLShader | null
    {
        return this.#vertexShader
    }

    get FragmentShader(): WebGLShader | null
    {
        return this.#fragmentShader
    }

    get RawVertexSource(): string | null
    {
        return this.#rawVertexSource
    }

    get VertexSource(): string | null
    {
        return this.#vertexSource
    }

    set VertexSource(vertexSource: string | null)
    {
        if (vertexSource)
        {
            this.#rawVertexSource = vertexSource
            this.#vertexSource = this.#addIncludes(vertexSource)
        }
        else
        {
            this.#rawVertexSource = null
            this.#vertexSource = null
        }
        this.#compileShaders()
    }

    get FragmentSource(): string | null
    {
        return this.#rawFragmentSource
    }
    
    get FullFragmentSource(): string | null
    {
        return this.#rawFragmentSource ? this.#addIncludes(this.#rawFragmentSource) : null
    }

    set FragmentSource(fragmentSource: string | null)
    {
        if (fragmentSource)
        {
            this.#rawFragmentSource = fragmentSource
            this.#fragmentSource = this.#addIncludes(fragmentSource)
        }
        else
        {
            this.#rawFragmentSource = null
            this.#fragmentSource = null
        }
        this.#compileShaders()
    }

    constructor(vertexShader: string, fragmentShader: string)
    {
        super(Shader)

        this.#rawVertexSource = vertexShader
        this.#rawFragmentSource = fragmentShader
        this.#vertexSource = this.#addIncludes(vertexShader)
        this.#fragmentSource = this.#addIncludes(fragmentShader)
        this.#compileShaders()

    }

    #compileShaders(): void
    {
        if (this.#vertexSource ===  null || this.#fragmentSource === null)
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

        GL.shaderSource(vertexShader, this.#vertexSource)
        GL.compileShader(vertexShader)
        if (!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS))
        {
            log.push('Vertex Shader: ' + GL.getShaderInfoLog(vertexShader))
            log.push(this.#vertexSource.split('\n').map((line, i) => (i + 1) + '\t' + line).join('\n'))
        }


        GL.shaderSource(fragmentShader, this.#fragmentSource!)
        GL.compileShader(fragmentShader)
        if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS))
        {
            log.push('Fragment Shader: ' + GL.getShaderInfoLog(fragmentShader))
            log.push(this.#fragmentSource.split('\n').map((line, i) => (i + 1) + '\t' + line).join('\n'))
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

        if (this.#program)
        {
            GL.deleteProgram(this.#program)
            GL.deleteShader(this.#vertexShader)
            GL.deleteShader(this.#fragmentShader)
        }

        this.#program = program
        this.#vertexShader = vertexShader
        this.#fragmentShader = fragmentShader
    }

    #addIncludes(shaderSource: string): string
    {
        let source = shaderSource.toString()

        while (source.includes('//#include'))
        {
            const result = source.match(/\/\/#include\s+(.+)([\s\n\r]*)/)!
            if (result)
            {
                const [match, name, whitespace] = result

                if (Shader.Includes.has(name))
                {
                    source = source.replace(match, Shader.Includes.get(name)! + whitespace)
                }
                else
                {
                    source = source.replace(match, `// Could not find: ${name + whitespace}`)
                }
            }
        }

        return source
    }

    #getLocation(name: string): WebGLUniformLocation | undefined
    {
        if (this.Ignore.has(name))
        {
            return
        }

        let location = this.Inputs[name]
        if (!location)
        {
            const loc = GL.getUniformLocation(this.Program!, name)
            if (loc)
            {
                this.Inputs[name] = loc
                location = loc
            }
            else
            {
                this.Ignore.add(name)
                return
            }
        }

        return location!
    }

    Bind(): void
    {
        GL.useProgram(this.Program)
        this.#samplerIndex = 0
    }

    UnBind(): void
    {
        GL.useProgram(null)
    }

    SetTexture(name: string, texture: WebGLTexture, is3D: boolean = false, isCube: boolean = false): void
    {
        const location = this.#getLocation(name)
        if (!location)
        {
            return
        }

        this.#samplerIndex++
        if (this.#samplerIndex > this.#maxSamplerIndex)
        {
            throw new Error('Too many textures attached')
        }

        GL.uniform1i(location, this.#samplerIndex)
        GL.activeTexture(GL.TEXTURE0 + this.#samplerIndex)
        if (is3D)
        {
            GL.bindTexture(GL.TEXTURE_3D, texture)
        }
        else if (isCube)
        {
            GL.bindTexture(GL.TEXTURE_CUBE_MAP, texture)
        }
        else
        {
            GL.bindTexture(GL.TEXTURE_2D, texture)
        }
    }

    SetBool(name: string, bool: boolean): void
    {
        const location = this.#getLocation(name)
        if (!location)
        {
            return
        }

        GL.uniform1i(location, bool ? 1 : 0)
    }

    SetInt(name: string, int: number, unsigned: boolean = false): void
    {
        const location = this.#getLocation(name)
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
    SetFloat(name: string, float: Scalar): void
    SetFloat(name: string, float: [number]): void
    SetFloat(name: string, float: number | Scalar | [number]): void
    {
        const location = this.#getLocation(name)
        if (!location)
        {
            return
        }

        if (typeof float === 'number')
        {
            GL.uniform1f(location, float)
        }
        else
        {
            GL.uniform1fv(location, float)
        }
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
    SetIntVector(name: string, _1:  Vector2 | Vector3 | Vector4 | [number, number] | [number, number, number] | [number, number, number, number] | number, _2?: number | boolean, _3?: number | boolean, _4?: number | boolean, _5?: boolean): void
    {
        const location = this.#getLocation(name)
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
    SetFloatVector(name: string, _1: Vector2 | Vector3 | Vector4 | Colour3 | Colour4 | [number, number] | [number, number, number] | [number, number, number, number] | number, _2?: number, _3?: number, _4?: number): void
    {
        const location = this.#getLocation(name)
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
        const location = this.#getLocation(name)
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
