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
        shader += '\nstruct Matrix\n{\n'

        if (vs.uniform.modelview)   shader += '\tmat4 ModelView;\n'
        if (vs.uniform.normal)      shader += '\tmat4 Normal;\n'
        if (vs.uniform.projection)  shader += '\tmat3 Projection;\n'

        shader += '\n};\n'
    }

    return shader
}