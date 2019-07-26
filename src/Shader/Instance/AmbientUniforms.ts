export default class AmbientUniforms
{
    public readonly Colour: WebGLUniformLocation
    public readonly Intensity: WebGLUniformLocation

    constructor(gl: WebGLRenderingContext, program: WebGLProgram)
    {
        this.Colour = gl.getUniformLocation(program, 'U_Ambient.Colour')
        this.Intensity = gl.getUniformLocation(program, 'U_Ambient.Intensity')
    }
}
