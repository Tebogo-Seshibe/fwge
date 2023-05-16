import { Colour3, Colour4, GL, Matrix2, Matrix3, Matrix4, Scalar, TypedArray, Vector2, Vector3, Vector4 } from "@fwge/common";
import { Asset } from "./Asset";
import { STD140 } from "./std140";

export type ShaderVariableType = 
    'bool'
    | 'int'
    | 'uint'
    | 'float'
    | 'double'
    | 'bvec2'
    | 'bvec3'
    | 'bvec4'
    | 'uvec2'
    | 'uvec3'
    | 'uvec4'
    | 'ivec2'
    | 'ivec3'
    | 'ivec4'
    | 'vec2'
    | 'vec3'
    | 'vec4'
    | 'dvec2'
    | 'dvec3'
    | 'dvec4'
    | 'mat2'
    | 'mat2x2'
    | 'mat2x3'
    | 'mat2x4'
    | 'mat3'
    | 'mat3x2'
    | 'mat3x3'
    | 'mat3x4'
    | 'mat4'
    | 'mat4x2'
    | 'mat4x3'
    | 'mat4x4'
    | 'sampler1D'
    | 'sampler2D'
    | 'sampler3D'
    | 'samplerCube'
    | 'sampler2DRect'
    | 'sampler1DArray'
    | 'sampler2DArray'
    | 'samplerCubeArray'
    | 'samplerBuffer'
    | 'sampler2DMS'
    | 'sampler2DMSArray'

export const ShaderVariableTypeSet = new Set<ShaderVariableType>([
    'bool',
    'int',
    'uint',
    'float',
    'double',
    'bvec2',
    'bvec3',
    'bvec4',
    'uvec2',
    'uvec3',
    'uvec4',
    'ivec2',
    'ivec3',
    'ivec4',
    'vec2',
    'vec3',
    'vec4',
    'dvec2',
    'dvec3',
    'dvec4',
    'mat2',
    'mat2x2',
    'mat2x3',
    'mat2x4',
    'mat3',
    'mat3x2',
    'mat3x3',
    'mat3x4',
    'mat4',
    'mat4x2',
    'mat4x3',
    'mat4x4',
    'sampler1D',
    'sampler2D',
    'sampler3D',
    'samplerCube',
    'sampler2DRect',
    'sampler1DArray',
    'sampler2DArray',
    'samplerCubeArray',
    'samplerBuffer',
    'sampler2DMS',
    'sampler2DMSArray'
]);

export interface UniformBlock
{
    index: number;
    offset: number;
    size: number;
    bindingPoint: number;
    buffer: WebGLBuffer;
    data: Float32Array;
    layout: Layout140;
}

export class Shader extends Asset
{
    private static CurrentBlockIndex = 0;
    static readonly Includes: Map<string, string> = new Map();
    static readonly BlockIndex: Map<string, number> = new Map();
    static readonly BlockOffset: Map<string, number> = new Map();
    static readonly BindingPoint: Map<string, number> = new Map();
    static readonly UniformBlocks: Map<string, UniformBlock> = new Map();

    static readonly IncludeRegex = /\/\/#include\s+(.+)([\s\n\r]*)/;
    static readonly UniformBlockRegex = /uniform\s+(?<name>\w+)[\n\s]*{(?<fields>(?:[\n\s]*\w+[\n\s]+\w+;)+)[\n\s]*}(?<instance>[\n\s]*\w+)?;/g;
    static readonly StructRegex = /struct\s+(?<name>\w+)[\n\s]*{(?<fields>(?:[\n\s]*\w+[\n\s]+\w+;)+)[\n\s]*}(?<instance>[\n\s]*\w+)?;/g;
    static readonly PropertyRegex = /(?<property>(?<prop_type>\w+)[\s\n]*((?<prop_length_prefix>\[\d+\])[\s\n]*(?<prop_length_prefix_name>\w+)|(?<prop_length_postfix_name>\w+)[\s\n]*(?<prop_length_postfix_length>\[\d+\])|([\s\n]+(?<prop_name>\w+)))[\s\n]*;)/
    static readonly UniformVariable = /(?:uniform[\n\s]+)(?<type>\w+)(?:[\n\s]+)(?<name>\w+)(?:[\n\s]*;)/g;
    static readonly GLSLTypes = /(sampler([123]D(Rect|Array|MS(Array)?)|(Cube(Array)?|Buffer))|bool|u?int|float|double)|([uibd]?vec[234])|(mat[234](x[234])?)/;

    private _program: WebGLProgram | null = null;
    private _rawVertexSource: string | null = null;
    private _rawFragmentSource: string | null = null;
    private _vertexSource: string | null = null;
    private _fragmentSource: string | null = null;

    private _samplerIndex: number = 0;
    private _maxSamplerIndex: number = GL.getParameter(GL.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

    private readonly _inputs: { [key: string]: WebGLUniformLocation | undefined; } = {};
    private readonly _ignore: Set<string> = new Set();

    private readonly _structs: Map<string, Map<string, string>> = new Map();
    private readonly _uniforms: Map<string, Map<string, string>> = new Map();
    private readonly _uniformBlocks: {[key: string]: UniformBlock} = Object.create(null);

    private readonly Buffer: WebGLBuffer = GL.createBuffer()!;
    private readonly BufferData: Float32Array = new Float32Array();

    get Program(): WebGLProgram | null
    {
        return this._program;
    }

    get RawVertexSource(): string | null
    {
        return this._rawVertexSource;
    }

    get VertexSource(): string | null
    {
        return this._vertexSource;
    }

    set VertexSource(vertexSource: string | null)
    {
        if (vertexSource)
        {
            this._rawVertexSource = vertexSource;
            this._vertexSource = this._addIncludes(vertexSource);
        }
        else
        {
            this._rawVertexSource = null;
            this._vertexSource = null;
        }
        this._compileShaders();
    }

    get FragmentSource(): string | null
    {
        return this._rawFragmentSource;
    }

    get FullFragmentSource(): string | null
    {
        return this._rawFragmentSource ? this._addIncludes(this._rawFragmentSource) : null;
    }

    set FragmentSource(fragmentSource: string | null)
    {
        if (fragmentSource)
        {
            this._rawFragmentSource = fragmentSource;
            this._fragmentSource = this._addIncludes(fragmentSource);
        }
        else
        {
            this._rawFragmentSource = null;
            this._fragmentSource = null;
        }
        this._compileShaders();
    }

    constructor(vertexShader: string, fragmentShader: string)
    {
        super(Shader);

        this._rawVertexSource = vertexShader;
        this._rawFragmentSource = fragmentShader;
        this._vertexSource = this._addIncludes(vertexShader);
        this._fragmentSource = this._addIncludes(fragmentShader);

        this._addUniformStructs();
        this._compileShaders();
        
        this._addUniformVariables();
        this._indexUniformBlocks();
    }

    _addUniformStructs(): void
    {
        const source = this._vertexSource + "\n" + this._fragmentSource;
        const structs = source.matchAll(Shader.StructRegex);
        const uniforms = source.matchAll(Shader.UniformBlockRegex);

        for (let match = structs.next(); !match.done; match = structs.next())
        {
            const { name, fields, instance } = match.value.groups!;
            const props = new Map<string, string>();
            const fieldNames = fields.trim().split(';').map(x => x.trim()).filter(x => x);
            for (const fieldName of fieldNames)
            {
                const [type, prop] = fieldName.split(' ').map(x => x.trim()).filter(x => x);
                props.set(prop, type);
            }
            if (instance)
            {
                props.set('_instance_', instance);
            }
            this._structs.set(name, props);
        }

        for (let match = uniforms.next(); !match.done; match = uniforms.next())
        {
            const { name, fields, instance } = match.value.groups!;
            const props = new Map<string, string>();
            const fieldNames = fields.trim().split(';').map(x => x.trim()).filter(x => x);
            for (const fieldName of fieldNames)
            {
                const [type, prop] = fieldName.split(' ').map(x => x.trim()).filter(x => x);
                props.set(prop, type);
            }
            if (instance)
            {
                props.set('_instance_', instance);
            }
            this._uniforms.set(name, props);
        }
    }

    private _addUniformVariables(): void
    {
        const source = this._vertexSource + "\n" + this._fragmentSource;
        const uniforms = source.matchAll(Shader.UniformVariable);

        for (let match = uniforms.next(); !match.done; match = uniforms.next())
        {
            const { type, name } = match.value.groups!;

            if (ShaderVariableTypeSet.has(type as ShaderVariableType))
            {
                this._getLocation(name);
            }
            else
            {
                const struct = this._structs.get(type);
                if (!struct)
                {
                    continue;
                }
                
                for (const field of struct.keys())
                {
                    this._getLocation(`${name}.${field}`);
                }
            }
        }
    }
    
    private _indexUniformBlocks(): void
    {
        for (const [uniform, fields] of this._uniforms)
        {
            const fieldTypes: string[] = [];
            for (const [field, type] of fields)
            {
                if (field !== '_instance_')
                {
                    fieldTypes.push(type);
                }
            }
            
            const size = layout140(fieldTypes as ShaderVariableType[])
            const uniformBlock: UniformBlock = Object.create(null);
            uniformBlock.size = size;
            uniformBlock.buffer = GL.createBuffer()!;
            uniformBlock.bindingPoint = Shader.CurrentBlockIndex++;
            uniformBlock.index = GL.getUniformBlockIndex(this._program!, uniform);
            uniformBlock.offset = 0;
            uniformBlock.data = new Float32Array(size);
            uniformBlock.layout = buildLayout140(fields);

            
            if (uniformBlock.index !== GL.INVALID_INDEX)
            {
                Shader.BlockIndex.set(uniform, uniformBlock.index);
                Shader.BindingPoint.set(uniform, uniformBlock.bindingPoint);
                this._uniformBlocks[uniform] = uniformBlock;
                
                GL.uniformBlockBinding(this._program!, uniformBlock.index, uniformBlock.bindingPoint);
                GL.bindBufferBase(GL.UNIFORM_BUFFER, uniformBlock.bindingPoint, uniformBlock.buffer);
                GL.bufferData(GL.UNIFORM_BUFFER, new Float32Array(uniformBlock.size), GL.DYNAMIC_DRAW);
            }
        }
    }

    _compileShaders(): void
    {
        if (this._vertexSource === null || this._fragmentSource === null)
        {
            return;
        }

        const program = GL.createProgram();
        const vertexShader = GL.createShader(GL.VERTEX_SHADER);
        const fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);

        if (!program)
        {
            throw new Error('WebGL failed to create shader program');
        }

        if (!vertexShader)
        {
            throw new Error('WebGL failed to create vertex shader');
        }

        if (!fragmentShader)
        {
            throw new Error('WebGL failed to create fragment shader');
        }

        const log = [];

        GL.shaderSource(vertexShader, this._vertexSource);
        GL.compileShader(vertexShader);
        if (!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS))
        {
            log.push('Vertex Shader: ' + GL.getShaderInfoLog(vertexShader));
            log.push(this._vertexSource.split('\n').map((line, i) => (i + 1) + '\t' + line).join('\n'));
        }


        GL.shaderSource(fragmentShader, this._fragmentSource!);
        GL.compileShader(fragmentShader);
        if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS))
        {
            log.push('Fragment Shader: ' + GL.getShaderInfoLog(fragmentShader));
            log.push(this._fragmentSource.split('\n').map((line, i) => (i + 1) + '\t' + line).join('\n'));
        }

        GL.attachShader(program, vertexShader);
        GL.attachShader(program, fragmentShader);
        GL.linkProgram(program);
        if (!GL.getProgramParameter(program, GL.LINK_STATUS))
        {
            log.push(GL.getProgramInfoLog(program));
        }

        if (log.length > 0)
        {
            throw new Error(log.join('\n'));
        }

        if (this._program)
        {
            GL.deleteProgram(this._program);
        }
        GL.deleteShader(vertexShader);
        GL.deleteShader(fragmentShader);

        this._program = program;
    }

    _addIncludes(shaderSource: string): string
    {
        let source = shaderSource.toString();

        while (source.includes('//#include'))
        {
            const result = source.match(Shader.IncludeRegex)!;
            if (result)
            {
                const [match, name, whitespace] = result;

                if (Shader.Includes.has(name))
                {
                    source = source.replace(match, Shader.Includes.get(name)! + whitespace);
                }
                else
                {
                    source = source.replace(match, `// Could not find: ${name + whitespace}`);
                }
            }
        }

        return source;
    }

    private _getLocation(name: string): WebGLUniformLocation | undefined
    {
        if (this._ignore.has(name))
        {
            return;
        }

        let location = this._inputs[name];
        if (!location)
        {
            const loc = GL.getUniformLocation(this.Program!, name);
            if (loc)
            {
                this._inputs[name] = loc;
                location = loc;
            }
            else
            {
                this._ignore.add(name);
                return;
            }
        }

        return location!;
    }

    Bind(): void
    Bind(samplerIndex: number): void
    Bind(samplerIndex: number = 0): void
    {
        GL.useProgram(this.Program);
        this._samplerIndex = samplerIndex;
    }

    Reset()
    {
        this._samplerIndex = 0;
    }

    UnBind(): void
    {
        GL.useProgram(null);
    }

    SetBufferData(name: string, bufferData: Float32Array): void;
    SetBufferData(name: string, bufferData: Float32Array, offset: number): void;
    SetBufferData(name: string, bufferData: Float32Array, offset: number = 0): void
    {
        const uniformBlock = this._uniformBlocks[name];
        if (!uniformBlock)
        { 
            return;
        }

        uniformBlock.data.set(bufferData, offset);
    }

    SetBufferDataField(name: string, field: string, data: TypedArray | number | Scalar | Vector2 | Vector3 | Vector4 | Matrix2 | Matrix3 | Matrix4, tranpose: boolean = false): void
    {
        if (typeof data === 'number')
        {
            data = [data] as any as Scalar;
        }

        const uniformBlock = this._uniformBlocks[name];
        if (!uniformBlock)
        { 
            return;
        }

        const layout = uniformBlock.layout.fields[field]!;

        switch (layout.size) {
            case 1:
                uniformBlock.data[layout.offset + 0] = data[0];
                break;

            case 2:
                uniformBlock.data[layout.offset + 0] = data[0];
                uniformBlock.data[layout.offset + 1] = data[1];
                break;
            case 3:
                uniformBlock.data[layout.offset + 0] = data[0];
                uniformBlock.data[layout.offset + 1] = data[1];
                uniformBlock.data[layout.offset + 2] = data[2];
                break;
            case 4:
                uniformBlock.data[layout.offset + 0] = data[0];
                uniformBlock.data[layout.offset + 1] = data[1];
                uniformBlock.data[layout.offset + 2] = data[2];
                uniformBlock.data[layout.offset + 3] = data[3];
                break;
            case 8:
                if (tranpose) {
                    uniformBlock.data[layout.offset + 0] = data[0];
                    uniformBlock.data[layout.offset + 1] = data[2];
                    
                    uniformBlock.data[layout.offset + 4] = data[1];
                    uniformBlock.data[layout.offset + 5] = data[3];
                } else {
                    uniformBlock.data[layout.offset + 0] = data[0];
                    uniformBlock.data[layout.offset + 1] = data[1];
                    
                    uniformBlock.data[layout.offset + 4] = data[2];
                    uniformBlock.data[layout.offset + 5] = data[3];
                }
                break;
            case 12:
                if (tranpose) {
                    uniformBlock.data[layout.offset +  0] = data[0];
                    uniformBlock.data[layout.offset +  1] = data[3];
                    uniformBlock.data[layout.offset +  2] = data[6];

                    uniformBlock.data[layout.offset +  4] = data[1];
                    uniformBlock.data[layout.offset +  5] = data[4];
                    uniformBlock.data[layout.offset +  6] = data[7];

                    uniformBlock.data[layout.offset +  8] = data[2];
                    uniformBlock.data[layout.offset +  9] = data[5];
                    uniformBlock.data[layout.offset + 10] = data[8];
                } else {
                    uniformBlock.data[layout.offset +  0] = data[0];
                    uniformBlock.data[layout.offset +  1] = data[1];
                    uniformBlock.data[layout.offset +  2] = data[2];

                    uniformBlock.data[layout.offset +  4] = data[3];
                    uniformBlock.data[layout.offset +  5] = data[4];
                    uniformBlock.data[layout.offset +  6] = data[5];

                    uniformBlock.data[layout.offset +  8] = data[6];
                    uniformBlock.data[layout.offset +  9] = data[7];
                    uniformBlock.data[layout.offset + 10] = data[8];
                }
                break;
            case 16:
                if (tranpose) {
                    uniformBlock.data[layout.offset +  0] = data[ 0];
                    uniformBlock.data[layout.offset +  1] = data[ 4];
                    uniformBlock.data[layout.offset +  2] = data[ 8];
                    uniformBlock.data[layout.offset +  3] = data[12];

                    uniformBlock.data[layout.offset +  4] = data[ 1];
                    uniformBlock.data[layout.offset +  5] = data[ 5];
                    uniformBlock.data[layout.offset +  6] = data[ 9];
                    uniformBlock.data[layout.offset +  7] = data[13];

                    uniformBlock.data[layout.offset +  8] = data[ 2];
                    uniformBlock.data[layout.offset +  9] = data[ 6];
                    uniformBlock.data[layout.offset + 10] = data[10];
                    uniformBlock.data[layout.offset + 11] = data[14];

                    uniformBlock.data[layout.offset + 12] = data[ 3];
                    uniformBlock.data[layout.offset + 13] = data[ 7];
                    uniformBlock.data[layout.offset + 14] = data[11];
                    uniformBlock.data[layout.offset + 15] = data[15];
                } else {
                    uniformBlock.data[layout.offset +  0] = data[ 0];
                    uniformBlock.data[layout.offset +  1] = data[ 1];
                    uniformBlock.data[layout.offset +  2] = data[ 2];
                    uniformBlock.data[layout.offset +  3] = data[ 3];

                    uniformBlock.data[layout.offset +  4] = data[ 4];
                    uniformBlock.data[layout.offset +  5] = data[ 5];
                    uniformBlock.data[layout.offset +  6] = data[ 6];
                    uniformBlock.data[layout.offset +  7] = data[ 7];

                    uniformBlock.data[layout.offset +  8] = data[ 8];
                    uniformBlock.data[layout.offset +  9] = data[ 9];
                    uniformBlock.data[layout.offset + 10] = data[10];
                    uniformBlock.data[layout.offset + 11] = data[11];

                    uniformBlock.data[layout.offset + 12] = data[12];
                    uniformBlock.data[layout.offset + 13] = data[13];
                    uniformBlock.data[layout.offset + 14] = data[14];
                    uniformBlock.data[layout.offset + 15] = data[15];
                }
                break;
        }
    }

    PushBufferData(name: string): void
    {        
        const uniformBlock = this._uniformBlocks[name];
        if (!uniformBlock)
        { 
            return;
        }

        if (uniformBlock.index !== GL.INVALID_INDEX)
        {
            GL.bindBuffer(GL.UNIFORM_BUFFER, uniformBlock.buffer);
            GL.bufferSubData(GL.UNIFORM_BUFFER, uniformBlock.offset, uniformBlock.data);
        }
    }

    SetTexture(name: string, texture: WebGLTexture, is3D: boolean = false, isCube: boolean = false): void
    {
        const location = this._getLocation(name);
        if (!location)
        {
            return;
        }

        this._samplerIndex++;
        if (this._samplerIndex > this._maxSamplerIndex)
        {
            throw new Error('Too many textures attached');
        }

        GL.activeTexture(GL.TEXTURE0 + this._samplerIndex);
        if (is3D)
        {
            GL.bindTexture(GL.TEXTURE_3D, texture);
        }
        else if (isCube)
        {
            GL.bindTexture(GL.TEXTURE_CUBE_MAP, texture);
        }
        else
        {
            GL.bindTexture(GL.TEXTURE_2D, texture);
        }
        GL.uniform1i(location, this._samplerIndex);
    }

    SetBool(name: string, bool: boolean): void
    {
        const location = this._getLocation(name);
        if (!location)
        {
            return;
        }

        GL.uniform1i(location, bool ? 1 : 0);
    }

    SetInt(name: string, int: number, unsigned: boolean = false): void
    {
        const location = this._getLocation(name);
        if (!location)
        {
            return;
        }

        if (unsigned)
        {
            GL.uniform1ui(location, int);
        }
        else
        {
            GL.uniform1i(location, int);
        }
    }

    SetFloat(name: string, float: number): void;
    SetFloat(name: string, float: Scalar): void;
    SetFloat(name: string, float: [number]): void;
    SetFloat(name: string, float: number | Scalar | [number]): void
    {
        const location = this._getLocation(name);
        if (!location)
        {
            return;
        }

        if (typeof float === 'number')
        {
            GL.uniform1f(location, float);
        }
        else
        {
            GL.uniform1fv(location, float);
        }
    }

    SetIntVector(name: string, vector: Vector2): void;
    SetIntVector(name: string, vector: Vector2, unsigned: boolean): void;
    SetIntVector(name: string, vector: [number, number]): void;
    SetIntVector(name: string, vector: [number, number], unsigned: boolean): void;
    SetIntVector(name: string, x: number, y: number): void;
    SetIntVector(name: string, x: number, y: number, unsigned: boolean): void;
    SetIntVector(name: string, vector: Vector3): void;
    SetIntVector(name: string, vector: Vector3, unsigned: boolean): void;
    SetIntVector(name: string, vector: [number, number, number]): void;
    SetIntVector(name: string, vector: [number, number, number], unsigned: boolean): void;
    SetIntVector(name: string, x: number, y: number, z: number): void;
    SetIntVector(name: string, x: number, y: number, z: number, unsigned: boolean): void;
    SetIntVector(name: string, vector: Vector4): void;
    SetIntVector(name: string, vector: Vector4, unsigned: boolean): void;
    SetIntVector(name: string, vector: [number, number, number, number]): void;
    SetIntVector(name: string, vector: [number, number, number, number], unsigned: boolean): void;
    SetIntVector(name: string, x: number, y: number, z: number, w: number): void;
    SetIntVector(name: string, x: number, y: number, z: number, w: number, unsigned: boolean): void;
    SetIntVector(name: string, _1: Vector2 | Vector3 | Vector4 | [number, number] | [number, number, number] | [number, number, number, number] | number, _2?: number | boolean, _3?: number | boolean, _4?: number | boolean, _5?: boolean): void
    {
        const location = this._getLocation(name);
        if (!location)
        {
            return;
        }

        switch (arguments.length)
        {
            case 6:
                {
                    if (_5 as boolean)
                    {
                        GL.uniform4ui(location, _1 as number, _2 as number, _3 as number, _4 as number);
                    }
                    else
                    {
                        GL.uniform4i(location, _1 as number, _2 as number, _3 as number, _4 as number);
                    }
                }
                break;
            case 5:
                {
                    if (typeof _4 === 'number')
                    {
                        GL.uniform4i(location, _1 as number, _2 as number, _3 as number, _4 as number);
                    }
                    else if (_4 as boolean)
                    {
                        GL.uniform3ui(location, _1 as number, _2 as number, _3 as number);
                    }
                    else
                    {
                        GL.uniform3i(location, _1 as number, _2 as number, _3 as number);
                    }
                }
                break;
            case 4:
                {
                    if (typeof _3 === 'number')
                    {
                        GL.uniform3i(location, _1 as number, _2 as number, _3 as number);
                    }
                    else if (_3 as boolean)
                    {
                        GL.uniform2ui(location, _1 as number, _2 as number);
                    }
                    else
                    {
                        GL.uniform2i(location, _1 as number, _2 as number);
                    }
                }
                break;
            case 3:
                {
                    if (typeof _2 === 'number')
                    {
                        GL.uniform2i(location, _1 as number, _2 as number);
                    }
                    else if (_2 as boolean)
                    {
                        switch ((_1 as number[]).length)
                        {
                            case 2: GL.uniform2uiv(location, _1 as number[]);
                                break;
                            case 3: GL.uniform3uiv(location, _1 as number[]);
                                break;
                            case 4: GL.uniform4uiv(location, _1 as number[]);
                                break;
                        }
                    }
                    else
                    {
                        switch ((_1 as number[]).length)
                        {
                            case 2: GL.uniform2iv(location, _1 as number[]);
                                break;
                            case 3: GL.uniform3iv(location, _1 as number[]);
                                break;
                            case 4: GL.uniform4iv(location, _1 as number[]);
                                break;
                        }
                    }
                }
                break;
            case 2:
                {
                    switch ((_1 as number[]).length)
                    {
                        case 2: GL.uniform2iv(location, _1 as number[]);
                            break;
                        case 3: GL.uniform3iv(location, _1 as number[]);
                            break;
                        case 4: GL.uniform4iv(location, _1 as number[]);
                            break;
                    }
                }
                break;
        }
    }

    SetFloatVector(name: string, vector: Vector2): void;
    SetFloatVector(name: string, vector: [number, number]): void;
    SetFloatVector(name: string, x: number, y: number): void;
    SetFloatVector(name: string, vector: Vector3 | Colour3): void;
    SetFloatVector(name: string, vector: [number, number, number]): void;
    SetFloatVector(name: string, x: number, y: number, z: number): void;
    SetFloatVector(name: string, vector: Vector4 | Colour4): void;
    SetFloatVector(name: string, vector: [number, number, number, number]): void;
    SetFloatVector(name: string, x: number, y: number, z: number, w: number): void;
    SetFloatVector(name: string, _1: Vector2 | Vector3 | Vector4 | Colour3 | Colour4 | [number, number] | [number, number, number] | [number, number, number, number] | number, _2?: number, _3?: number, _4?: number): void
    {
        const location = this._getLocation(name);
        if (!location)
        {
            return;
        }

        switch (arguments.length)
        {
            case 5:
                GL.uniform4f(location, _1 as number, _2 as number, _3 as number, _4 as number);
                break;
            case 4:
                GL.uniform3f(location, _1 as number, _2 as number, _3 as number);
                break;
            case 3:
                GL.uniform2f(location, _1 as number, _2 as number);
                break;
            case 2:
                switch ((_1 as number[]).length)
                {
                    case 2:
                        GL.uniform2fv(location, _1 as number[]);
                        break;
                    case 3:
                        GL.uniform3fv(location, _1 as number[]);
                        break;
                    case 4:
                        GL.uniform4fv(location, _1 as number[]);
                        break;
                }
                break;
        }
        if (typeof _1 === 'number')
        {

        }
        else
        {
            switch (_1.length)
            {
                case 2:
                    GL.uniform2fv(location, _1);
                    break;
                case 3:
                    GL.uniform3fv(location, _1);
                    break;
                case 4:
                    GL.uniform4fv(location, _1);
                    break;
            }
        }
    }

    SetMatrix(name: string, matrix: Matrix2): void;
    SetMatrix(name: string, matrix: Matrix2, transpose: boolean): void;
    SetMatrix(name: string, matrix: [number, number, number, number]): void;
    SetMatrix(name: string, matrix: [number, number, number, number], transpose: boolean): void;
    SetMatrix(name: string, matrix: Matrix3): void;
    SetMatrix(name: string, matrix: Matrix3, transpose: boolean): void;
    SetMatrix(name: string, matrix: [number, number, number, number, number, number, number, number, number]): void;
    SetMatrix(name: string, matrix: [number, number, number, number, number, number, number, number, number], transpose: boolean): void;
    SetMatrix(name: string, matrix: Matrix4): void;
    SetMatrix(name: string, matrix: Matrix4, transpose: boolean): void;
    SetMatrix(name: string, matrix: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]): void;
    SetMatrix(name: string, matrix: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number], transpose: boolean): void;
    SetMatrix(name: string, matrix: Matrix2 | Matrix3 | Matrix4 | [number, number, number, number] | [number, number, number, number, number, number, number, number, number] | [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number], transpose: boolean = false): void
    {
        const location = this._getLocation(name);
        if (!location)
        {
            return;
        }

        switch (matrix.length)
        {
            case 4:
                GL.uniformMatrix2fv(location, transpose, matrix);
                break;
            case 9:
                GL.uniformMatrix3fv(location, transpose, matrix);
                break;
            case 16:
                GL.uniformMatrix4fv(location, transpose, matrix);
                break;
        }
    }
}

type Layout140Size = 1 | 2 | 3 | 4 | 8 | 12 | 16;

type Layout140 = {
    fields: {
        [field: string]: {
            size: Layout140Size;
            offset: number;
        };
    };
    totalSize: number;
}

function buildLayout140(uniform: Map<string, string>): Layout140 {
    const layout: Layout140 = {
        totalSize: 0,
        fields: {}
    };

    for (const [field, type] of uniform)
    {
        if (field === '_instance_') continue;

        const size = STD140[type as ShaderVariableType];
        layout.fields[field] = {

            size: size,
            offset: layout.totalSize
        };

        const offset = layout.totalSize % 4;
        if (
            (offset === 0)  ||
            (offset === 1 && (size === 1 || size === 3)) ||
            (offset === 2 && (size === 1 || size === 2)) ||
            (offset === 3 && size === 1)) {
            layout.totalSize += size;
        } else {
            layout.totalSize += offset + size;
        }
    }

    layout.totalSize += layout.totalSize % 4;

    return layout;
}

function layout140(fieldTypes: ShaderVariableType[]): number
{    
    let totalBufferLength = 0;

    for (const fieldType of fieldTypes)
    {
        const size = STD140[fieldType];
        const offset = totalBufferLength % 4;
        
        if (offset === 0)
        {
            totalBufferLength += size;
        } 
        else if (offset === 1)
        {
            if (size !== 2)
            {
                totalBufferLength += size;
            }
            
            totalBufferLength += 3;
        }
        else if (offset === 2)
        {
            if (size !== 1 && size !== 2)
            {
                totalBufferLength += size;
            }
            
            totalBufferLength += 2;
        }
        else
        {
            if (size !== 1)
            {
                totalBufferLength += size
            }

            totalBufferLength += 1;
        }
    }

    return totalBufferLength + (totalBufferLength % 4);
};

(window as any).layout140 = layout140;
