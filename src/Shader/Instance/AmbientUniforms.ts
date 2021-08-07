export default class AmbientUniforms
{
    public readonly Colour: WebGLUniformLocation | null
    public readonly Intensity: WebGLUniformLocation | null

    constructor(gl: WebGLRenderingContext, program: WebGLProgram)
    {
        this.Colour = gl.getUniformLocation(program, 'U_AmbientColour')
        this.Intensity = gl.getUniformLocation(program, 'U_AmbientIntensity')
    }
}
