export default class SamplerUniforms
{
    public readonly Image: WebGLUniformLocation | null
    public readonly Bump: WebGLUniformLocation | null
    public readonly Specular: WebGLUniformLocation | null

    constructor(gl: WebGLRenderingContext, program: WebGLProgram)
    {
        this.Image = gl.getUniformLocation(program, 'U_SamplerImage')
        this.Bump = gl.getUniformLocation(program, 'U_SamplerBump')
        this.Specular = gl.getUniformLocation(program, 'U_SamplerSpecular')
    }
}
