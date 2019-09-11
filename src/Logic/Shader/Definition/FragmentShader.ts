export class IFragmentShader
{
    uniform:
    {
        material:
        {
            diffuse: boolean
            ambient: boolean
            specular: boolean
        }
    }
}

export default function FragmentShader(fs: IFragmentShader): string
{
    let shader: string = '#Fragment Stuffs\n'

    if (fs.uniform.material)
    {
        shader += '\nstruct Matrix\n{\n'

        if (fs.uniform.material.ambient)    shader += '\tvec4 Ambient;\n'
        if (fs.uniform.material.diffuse)    shader += '\tvec4 Diffuse;\n'
        if (fs.uniform.material.specular)   shader += '\tvec4 Specular;\n'

        shader += '\n};\n'
    }
    return shader
}