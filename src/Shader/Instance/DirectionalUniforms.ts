export default class DirectionalUniforms
{
    public readonly Colour: WebGLUniformLocation
    public readonly Intensity: WebGLUniformLocation
    public readonly Direction: WebGLUniformLocation

    constructor(gl: WebGLRenderingContext, program: WebGLProgram)
    {
        this.Colour = gl.getUniformLocation(program, 'U_DirectionalColour')
        this.Intensity = gl.getUniformLocation(program, 'U_DirectionalIntensity')
        this.Direction = gl.getUniformLocation(program, 'U_DirectionalDirection')
    }  
}