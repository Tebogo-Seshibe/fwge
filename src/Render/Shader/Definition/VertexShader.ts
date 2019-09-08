export type ShaderType = 'bool' | 'bvec2' | 'bvec3' | 'bvec4' | 'int'| 'ivec2' | 'ivec3' | 'ivec4' | 'uint'| 'uvec2' | 'uvec3' | 'uvec4' | 'float' | 'vec2' | 'vec3' | 'vec4' | 'mat2' | 'mat3' | 'mat4'

export class IShaderField
{
    type: 'int' | 'float' | 'double' | 'vec2' | 'vec3' | 'vec4' | 'mat2' | 'mat3' | 'mat4'
    collection: string
}

export class IVertexAttribute
{
    position: boolean
    normal: boolean
    colour: boolean
    uv: boolean
}

export class IVertexUniform
{
    projection: boolean
    modelview: boolean
    normal: boolean
}

export class IVertexShader
{
    attribute?: IVertexAttribute
    uniform?: IVertexUniform
    varying: string[]
}

export default function VertexShader(vs: IVertexShader): string
{
    let shader: string = '#Vertex Stuffs\n'

    if (vs.attribute)
    {
        shader += '\n'

        if (vs.attribute.position)  shader += 'attribute vec3 A_Position;'
        if (vs.attribute.uv)        shader += 'attribute vec3 A_UV;'
        if (vs.attribute.colour)    shader += 'attribute vec3 A_Colour;'
        if (vs.attribute.normal)    shader += 'attribute vec3 A_Normal;'

        shader += '\n'
    }

    if (vs.uniform)
    {
        shader += '\n'

        if (vs.uniform.modelview)   shader += 'mat4 ModelView;\n'
        if (vs.uniform.normal)      shader += 'mat4 Normal;\n'
        if (vs.uniform.projection)  shader += 'mat3 Projection;\n'

        shader += '\n'
    }

    return shader
}