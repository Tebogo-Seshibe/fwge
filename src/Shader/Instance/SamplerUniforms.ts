export default class SamplerUniforms
{
    public readonly Image: WebGLUniformLocation
    public readonly Bump: WebGLUniformLocation
    public readonly Specular: WebGLUniformLocation

    constructor(gl: WebGLRenderingContext, program: WebGLProgram)
    {
        this.Image = gl.getUniformLocation(program, 'U_SamplerImage')
        this.Bump = gl.getUniformLocation(program, 'U_SamplerBump')
        this.Specular = gl.getUniformLocation(program, 'U_SamplerSpecular')
    }
}
