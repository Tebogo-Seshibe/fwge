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

export type UniformBlockRegexMatch = {
    name: string;
    body: string;
    instance: string;
};
export const UniformBlockRegex = /uniform\s+(?<name>\w+)[\n\s]*{(?<body>(?:(?:\w|[*/\\]|\[\d+\]|[\n\s]*)+;)+[\n\s]*)}[\n\s]*(?<instance>\w+)*;/g;

export type StructBlockRegexMatch = {
    name: string;
    body: string;
    instance: string;
};
export const StructRegex = /struct\s+(?<name>\w+)[\n\s]*{(?<body>(?:(?:\w|[*/\\]|\[\d+\]|[\n\s]*)+;)+[\n\s]*)}[\n\s]*(?<instance>\w+)*;/g;

export type PropertyRegexMatch = {
    property: string;
    prop_type: string;
    prop_length_prefix_length: string;
    prop_length_prefix_name: string;
    prop_length_postfix_name: string;
    prop_length_postfix_length: string;
    prop_name: string;
};
export const PropertyRegex = /(?<property>(?<prop_type>\w+)[\s\n]*(?:(?<prop_length_prefix_length>\[\d+\])[\s\n]*(?<prop_length_prefix_name>\w+)|(?<prop_length_postfix_name>\w+)[\s\n]*(?<prop_length_postfix_length>\[\d+\])|(?:[\s\n]+(?<prop_name>\w+)))[\s\n]*;)/g;

export type UniformVariableRegexMatch = {
    type: string;
    name: string;
};
export const UniformVariable = /(?:uniform[\n\s]+)(?<type>\w+)(?:[\n\s]?)(?:\[\d\][\n\s]?)?(?<name>\w+)(?:[\n\s]*;)/g;

export type ShaderProp = {
    name: string;
    type: string;
    length?: number;
    
};

export class Shader
{
    private static CurrentBlockIndex = 0;
    private static readonly Includes: Map<string, string> = new Map();
    private static readonly BlockIndex: Map<string, number> = new Map();
    private static readonly BlockOffset: Map<string, number> = new Map();
    private static readonly BindingPoint: Map<string, number> = new Map();
    private static readonly UniformBlocks: Map<string, UniformBlock> = new Map();

    private static readonly IncludeRegex = /\/\/#include\s+(.+)([\s\n\r]*)/;
    //TODO Fix borked regex for uniforms
    // Allow for arrays
    // Fix buildLayout140 method not including structs
    private static readonly UniformBlockRegex = /uniform\s+(?<name>\w+)[\n\s]*{(?<body>(?:\s*\w+\s+\w+\s*;|\n)*)}(?<instance>[\n\s]*\w+)?;/g;
    private static readonly StructRegex = /struct\s+(?<name>\w+)[\n\s]*{(?<body>(?:\s*\w+\s+\w+\s*;|\n)*)}(?<instance>[\n\s]*\w+)?;/g;
    private static readonly PropertyRegex = /(?<property>(?<prop_type>\w+)[\s\n]*(?:(?<prop_length_prefix_length>\[\d+\])[\s\n]*(?<prop_length_prefix_name>\w+)|(?<prop_length_postfix_name>\w+)[\s\n]*(?<prop_length_postfix_length>\[\d+\])|(?:[\s\n]+(?<prop_name>\w+)))[\s\n]*;)/g;
    private static readonly UniformVariable = /(?:uniform[\n\s]+)(?<type>\w+)(?:[\n\s]+)(?<name>\w+)(?:[\n\s]*;)/g;

    private _program: WebGLProgram | null = null;
    private _rawVertexSource: string | null = null;
    private _rawFragmentSource: string | null = null;
    private _vertexSource: string | null = null;
    private _fragmentSource: string | null = null;
    private _buffer: WebGLBuffer | null = null;

    private _samplerIndex: number = 0;
    private _maxSamplerIndex: number = GL.getParameter(GL.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

    private readonly _inputs: { [key: string]: WebGLUniformLocation | undefined; } = {};
    private readonly _ignore: Set<string> = new Set();

    //TODO Make this a lot cleaner
    private readonly _structs: Map<string, Map<string, ShaderProp>> = new Map();
    private readonly _structLayouts: Map<string, Layout140> = new Map();
    private readonly _uniforms: Map<string, Map<string, ShaderProp>> = new Map();
    private readonly _uniformBlocksProps: Map<string, Layout140> = new Map();
    private readonly _uniformBlocks: {[key: string]: UniformBlock} = {};

    private get Buffer(): WebGLBuffer
    {
        return this._buffer!;
    }

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

    // set VertexSource(vertexSource: string | null)
    // {
    //     if (vertexSource)
    //     {
    //         this._rawVertexSource = vertexSource;
    //         this._vertexSource = this._addIncludes(vertexSource);
    //     }
    //     else
    //     {
    //         this._rawVertexSource = null;
    //         this._vertexSource = null;
    //     }
    //     this._compileShaders();
    // }

    get FragmentSource(): string | null
    {
        return this._rawFragmentSource;
    }

    get FullFragmentSource(): string | null
    {
        return this._rawFragmentSource ? this._addIncludes(this._rawFragmentSource) : null;
    }

    // set FragmentSource(fragmentSource: string | null)
    // {
    //     if (fragmentSource)
    //     {
    //         this._rawFragmentSource = fragmentSource;
    //         this._fragmentSource = this._addIncludes(fragmentSource);
    //     }
    //     else
    //     {
    //         this._rawFragmentSource = null;
    //         this._fragmentSource = null;
    //     }
    //     this._compileShaders();
    // }

    constructor(vertexShader: string, fragmentShader: string)
    constructor(vertexShader: string, fragmentShader: string, name: string)
    constructor(vertexShader: string, fragmentShader: string, name: string = 'Shader')
    {
        this._rawVertexSource = vertexShader;
        this._rawFragmentSource = fragmentShader;
        this._vertexSource = this._addIncludes(vertexShader);
        this._fragmentSource = this._addIncludes(fragmentShader);

        this._addUniformStructs();        
        this._addUniformVariables();
        this._indexUniformBlocks();
    }

    Init(gl: WebGL2RenderingContext): void
    {
        this._compileShaders(gl);
    }

    _addUniformStructs(): void
    {
        const source = this._vertexSource + "\n" + this._fragmentSource;
        const structs = [...source.matchAll(StructRegex)];
        const uniforms = [...source.matchAll(UniformBlockRegex)];

        for (let match of structs)
        {
            const { name, body } = match.groups! as StructBlockRegexMatch;
            const propMatches = [...body.matchAll(PropertyRegex)];
            const mappedProps = new Map<string, ShaderProp>()

            for (const propMatch of propMatches)
            {
                const { 
                    prop_name,
                    prop_length_prefix_name,
                    prop_length_postfix_name,

                    prop_type,
                    prop_length_prefix_length,
                    prop_length_postfix_length
                } = propMatch.groups! as PropertyRegexMatch;

                const name = prop_name ?? prop_length_prefix_name ?? prop_length_postfix_name;
                const type = prop_type;
                const length = prop_length_prefix_length 
                    ? Number(prop_length_prefix_length.replace(/(\[|\])/g, ''))
                    : prop_length_postfix_length
                        ? Number(prop_length_postfix_length.replace(/(\[|\])/g, ''))
                        : undefined;
                
                mappedProps.set(name, { name, type, length });
            }

            this._structs.set(name, mappedProps);
        }

        for (let match of uniforms)
        {
            const { name, body } = match.groups! as StructBlockRegexMatch;
            const propMatches = [...body.matchAll(PropertyRegex)];
            const mappedProps = new Map<string, ShaderProp>()
            
            for (const propMatch of propMatches)
            {
                const { 
                    prop_name,
                    prop_length_prefix_name,
                    prop_length_postfix_name,

                    prop_type,
                    prop_length_prefix_length,
                    prop_length_postfix_length
                } = propMatch.groups! as PropertyRegexMatch;

                const name = prop_name ?? prop_length_prefix_name ?? prop_length_postfix_name;
                const type = prop_type;
                const length = prop_length_prefix_length 
                    ? Number(prop_length_prefix_length.replace(/(\[|\])/g, ''))
                    : prop_length_postfix_length
                        ? Number(prop_length_postfix_length.replace(/(\[|\])/g, ''))
                        : undefined;
                
                mappedProps.set(name, { name, type, length });
            }
            
            this._uniforms.set(name, mappedProps);
            
            if (name === 'MeshData') debugger;
            this._uniformBlocksProps.set(name, this.BuildLayout140([...mappedProps.values()]));
        }
    }

    private _addUniformVariables(): void
    {
        const source = this._vertexSource + "\n" + this._fragmentSource;
        const uniforms = source.matchAll(UniformVariable);

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
        for (const [uniform, layout] of this._uniformBlocksProps)
        {
            const uniformBlock: UniformBlock = Object.create(null);
            uniformBlock.size = layout.totalSize;
            uniformBlock.buffer = GL.createBuffer()!;
            uniformBlock.bindingPoint = Shader.CurrentBlockIndex++;
            uniformBlock.index = GL.getUniformBlockIndex(this._program!, uniform);
            uniformBlock.offset = 0;
            uniformBlock.data = new Float32Array(uniformBlock.size);
            uniformBlock.layout = this._uniformBlocksProps.get(uniform)!;
            
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

    _compileShaders(GL: WebGL2RenderingContext): void
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

    SetBufferDataBlock(name: string, data: TypedArray, offset: number = 0): void
    {
        const uniformBlock = this._uniformBlocks[name];
        if (!uniformBlock)
        { 
            return;
        }

        uniformBlock.data.set(data, offset);
    }

    SetBufferDataField(name: string, field: string, data: TypedArray | number | Scalar | Vector2 | Vector3 | Vector4 | Matrix2 | Matrix3 | Matrix4): void
    SetBufferDataField(name: string, field: string, data: TypedArray | number | Scalar | Vector2 | Vector3 | Vector4 | Matrix2 | Matrix3 | Matrix4, transpose: boolean): void
    SetBufferDataField(name: string, field: string, data: TypedArray | number | Scalar | Vector2 | Vector3 | Vector4 | Matrix2 | Matrix3 | Matrix4, offset: number): void
    SetBufferDataField(name: string, field: string, data: TypedArray | number | Scalar | Vector2 | Vector3 | Vector4 | Matrix2 | Matrix3 | Matrix4, offset: number, transpose: boolean): void
    SetBufferDataField(name: string, field: string, data: TypedArray | number | Scalar | Vector2 | Vector3 | Vector4 | Matrix2 | Matrix3 | Matrix4, transpose_offset: number | boolean = 0, transpose: boolean = false): void
    {
        const offset = typeof transpose_offset === 'number'
            ? transpose_offset
            : 0
        transpose = typeof transpose_offset === 'number'
            ? transpose
            : transpose_offset
            
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
                uniformBlock.data[layout.offset + offset + 0] = data[0];
                break;

            case 2:
                uniformBlock.data[layout.offset + offset + 0] = data[0];
                uniformBlock.data[layout.offset + offset + 1] = data[1];
                break;

            case 3:
                uniformBlock.data[layout.offset + offset + 0] = data[0];
                uniformBlock.data[layout.offset + offset + 1] = data[1];
                uniformBlock.data[layout.offset + offset + 2] = data[2];
                break;

            case 4:
                uniformBlock.data[layout.offset + offset + 0] = data[0];
                uniformBlock.data[layout.offset + offset + 1] = data[1];
                uniformBlock.data[layout.offset + offset + 2] = data[2];
                uniformBlock.data[layout.offset + offset + 3] = data[3];
                break;
                
            case 8:
                if (transpose) {
                    uniformBlock.data[layout.offset + offset + 0] = data[0];
                    uniformBlock.data[layout.offset + offset + 1] = data[2];
                    
                    uniformBlock.data[layout.offset + offset + 4] = data[1];
                    uniformBlock.data[layout.offset + offset + 5] = data[3];
                } else {
                    uniformBlock.data[layout.offset + offset + 0] = data[0];
                    uniformBlock.data[layout.offset + offset + 1] = data[1];
                    
                    uniformBlock.data[layout.offset + offset + 4] = data[2];
                    uniformBlock.data[layout.offset + offset + 5] = data[3];
                }
                break;

            case 12:
                if (transpose) {
                    uniformBlock.data[layout.offset + offset +  0] = data[0];
                    uniformBlock.data[layout.offset + offset +  1] = data[3];
                    uniformBlock.data[layout.offset + offset +  2] = data[6];

                    uniformBlock.data[layout.offset + offset +  4] = data[1];
                    uniformBlock.data[layout.offset + offset +  5] = data[4];
                    uniformBlock.data[layout.offset + offset +  6] = data[7];

                    uniformBlock.data[layout.offset + offset +  8] = data[2];
                    uniformBlock.data[layout.offset + offset +  9] = data[5];
                    uniformBlock.data[layout.offset + offset + 10] = data[8];
                } else {
                    uniformBlock.data[layout.offset + offset +  0] = data[0];
                    uniformBlock.data[layout.offset + offset +  1] = data[1];
                    uniformBlock.data[layout.offset + offset +  2] = data[2];

                    uniformBlock.data[layout.offset + offset +  4] = data[3];
                    uniformBlock.data[layout.offset + offset +  5] = data[4];
                    uniformBlock.data[layout.offset + offset +  6] = data[5];

                    uniformBlock.data[layout.offset + offset +  8] = data[6];
                    uniformBlock.data[layout.offset + offset +  9] = data[7];
                    uniformBlock.data[layout.offset + offset + 10] = data[8];
                }
                break;
                
            case 16:
                if (transpose) {
                    uniformBlock.data[layout.offset + offset +  0] = data[ 0];
                    uniformBlock.data[layout.offset + offset +  1] = data[ 4];
                    uniformBlock.data[layout.offset + offset +  2] = data[ 8];
                    uniformBlock.data[layout.offset + offset +  3] = data[12];

                    uniformBlock.data[layout.offset + offset +  4] = data[ 1];
                    uniformBlock.data[layout.offset + offset +  5] = data[ 5];
                    uniformBlock.data[layout.offset + offset +  6] = data[ 9];
                    uniformBlock.data[layout.offset + offset +  7] = data[13];

                    uniformBlock.data[layout.offset + offset +  8] = data[ 2];
                    uniformBlock.data[layout.offset + offset +  9] = data[ 6];
                    uniformBlock.data[layout.offset + offset + 10] = data[10];
                    uniformBlock.data[layout.offset + offset + 11] = data[14];

                    uniformBlock.data[layout.offset + offset + 12] = data[ 3];
                    uniformBlock.data[layout.offset + offset + 13] = data[ 7];
                    uniformBlock.data[layout.offset + offset + 14] = data[11];
                    uniformBlock.data[layout.offset + offset + 15] = data[15];
                } else {
                    uniformBlock.data[layout.offset + offset +  0] = data[ 0];
                    uniformBlock.data[layout.offset + offset +  1] = data[ 1];
                    uniformBlock.data[layout.offset + offset +  2] = data[ 2];
                    uniformBlock.data[layout.offset + offset +  3] = data[ 3];

                    uniformBlock.data[layout.offset + offset +  4] = data[ 4];
                    uniformBlock.data[layout.offset + offset +  5] = data[ 5];
                    uniformBlock.data[layout.offset + offset +  6] = data[ 6];
                    uniformBlock.data[layout.offset + offset +  7] = data[ 7];

                    uniformBlock.data[layout.offset + offset +  8] = data[ 8];
                    uniformBlock.data[layout.offset + offset +  9] = data[ 9];
                    uniformBlock.data[layout.offset + offset + 10] = data[10];
                    uniformBlock.data[layout.offset + offset + 11] = data[11];

                    uniformBlock.data[layout.offset + offset + 12] = data[12];
                    uniformBlock.data[layout.offset + offset + 13] = data[13];
                    uniformBlock.data[layout.offset + offset + 14] = data[14];
                    uniformBlock.data[layout.offset + offset + 15] = data[15];
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

    //#region Set uniform variables
    SetBool(name: string, bool: boolean): void
    {
        const location = this._getLocation(name);
        if (!location)
        {
            return;
        }

        GL.uniform1i(location, bool ? 1 : 0);
    }

    SetInt(name: string, int: number): void
    SetInt(name: string, int: Scalar): void
    SetInt(name: string, int: [number]): void
    SetInt(name: string, int: number, unsigned: boolean): void
    SetInt(name: string, int: [number], unsigned: boolean): void
    SetInt(name: string, int: Scalar, unsigned: boolean): void
    SetInt(name: string, int: Scalar | [number] | number, unsigned: boolean = false): void
    {
        const location = this._getLocation(name);
        if (!location)
        {
            return;
        }

        if (typeof int === 'number')
        {
            if (unsigned)
            {
                GL.uniform1ui(location, int);
            }
            else
            {
                GL.uniform1i(location, int);
            }
        }
        else
        {
            if (unsigned)
            {
                GL.uniform1uiv(location, int as [number]);
            }
            else
            {
                GL.uniform1iv(location, int as [number]);
            }
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

        if (typeof _1 !== 'number')
        {
            const unsigned = _2 as boolean ?? false;
            
            switch (_1.length)
            {
                case 2: 
                    if (unsigned)
                    {
                        GL.uniform2uiv(location, _1 as number[]);
                    }
                    else
                    {
                        GL.uniform2iv(location, _1 as number[]);
                    }
                    break;
                case 3: 
                    if (unsigned)
                    {
                        GL.uniform3uiv(location, _1 as number[]);
                    }
                    else
                    {
                        GL.uniform3iv(location, _1 as number[]);
                    }
                    break;
                case 4: 
                    if (unsigned)
                    {
                        GL.uniform4uiv(location, _1 as number[]);
                    }
                    else
                    {
                        GL.uniform4iv(location, _1 as number[]);
                    }
                    break;
            }
        }
        else
        {
            switch (arguments.length)
            {
                case 3:
                    GL.uniform2i(location, _1 as number, _2 as number);
                    break;

                case 4:
                    if (typeof _3 === 'number')
                    {
                        GL.uniform3i(location, _1 as number, _2 as number, _3 as number);
                    }
                    else if (_3)
                    {
                        GL.uniform2ui(location, _1 as number, _2 as number);
                    }
                    break;
                case 5:
                    {
                        if (typeof _4 === 'number' || !_5)
                        {
                            GL.uniform4i(location, _1 as number, _2 as number, _3 as number, _4 as number);
                        }
                        else if (_4)
                        {
                            GL.uniform3ui(location, _1 as number, _2 as number, _3 as number);
                        }
                    }
                    break;

                case 6:
                    if (_5)
                    {
                        GL.uniform4ui(location, _1 as number, _2 as number, _3 as number, _4 as number);
                    }
                    break;
            }
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

        if (typeof _1 !== 'number')
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
        else
        {
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
    //#endregion

    BuildLayout140(uniform: ShaderProp[]): Layout140 {        
        const layout: Layout140 = {
            totalSize: 0,
            fields: {}
        };
    
        let currentOffset = 0;

        for (const {name, type, length} of uniform)
        {
            const size = this.CalculateFieldSize(layout.totalSize % 4, type, length);

            layout.totalSize += size;
            layout.fields[name] = {    
                size: size,
                offset: currentOffset
            };

            currentOffset += size;
        }
        
        layout.totalSize += layout.totalSize % 4;
    
        return layout;
    }
    
    CalculateFieldSize(offset: number, type: string, length: number = 1): number
    {
        let totalSize = 0;

        while (length-- > 0)
        {
            let size = STD140[type as ShaderVariableType];
            if (!size)
            {
                const struct = this._structs.get(type)!;
                const fields = [...struct.values()];

                for (const { type, length } of fields)
                {
                    totalSize += this.CalculateFieldSize((offset + totalSize) % 4, type, length);
                }
            }
            else
            {         
                if (
                    (offset === 0 && (size === 1 || size === 2 || size === 3)) ||
                    (offset === 1 && size === 1) ||
                    (offset === 2 && (size === 1 || size === 2)) ||
                    (offset === 3 && size === 1)) {
                    totalSize += size;
                } else {
                    totalSize += size + (size % 4);
                }
                offset = totalSize % 4;
            }
        }

        return totalSize;
    }
}

type Layout140Size = 1 | 2 | 3 | 4 | 8 | 12 | 16;

type Layout140 = {
    fields: {
        [field: string]: {
            size: number;
            offset: number;
        };
    };
    totalSize: number;
}
