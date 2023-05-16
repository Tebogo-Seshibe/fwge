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

export interface STD140 {
    type: ShaderVariableType;
    field: string;
    size: 1 | 2 | 3 | 4
}

type Layout140Size = 1 | 2 | 3 | 4 | 8 | 12 | 16;

let a: Partial<STD140>

export const STD140: {[key in ShaderVariableType]: Layout140Size} = {
    bool: 1,
    int: 1,
    uint: 1,
    float: 1,
    double: 1,
    bvec2: 2,
    bvec3: 3,
    bvec4: 4,
    uvec2: 2,
    uvec3: 3,
    uvec4: 4,
    ivec2: 2,
    ivec3: 3,
    ivec4: 4,
    vec2: 2,
    vec3: 3,
    vec4: 4,
    dvec2: 2,
    dvec3: 3,
    dvec4: 4,
    mat2: 8,
    mat2x2: 8,
    mat2x3: 12,
    mat2x4: 16,
    mat3: 12,
    mat3x2: 8,
    mat3x3: 12,
    mat3x4: 16,
    mat4: 16,
    mat4x2: 8,
    mat4x3: 12,
    mat4x4: 16,
    sampler1D: 1,
    sampler2D: 1,
    sampler3D: 1,
    samplerCube: 1,
    sampler2DRect: 1,
    sampler1DArray: 1,
    sampler2DArray: 1,
    samplerCubeArray: 1,
    samplerBuffer: 1,
    sampler2DMS: 1,
    sampler2DMSArray: 1
}

export function layout140(fieldTypes: ShaderVariableType[]): number
{
    let totalBufferLength = 0;

    for (const fieldType of fieldTypes)
    {
        const size = STD140[fieldType];
        const offset = totalBufferLength % 4;
        if (
            (offset === 0)  ||
            (offset === 1 && (size === 1 || size === 3)) ||
            (offset === 2 && (size === 1 || size === 2)) ||
            (offset === 3 && size === 1)) {
            totalBufferLength += size;
        } else {
            totalBufferLength += offset + size;
        }
    }

    return totalBufferLength + (totalBufferLength % 4);
}
