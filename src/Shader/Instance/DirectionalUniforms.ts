export default class DirectionalUniforms
{
    public readonly Colour: WebGLUniformLocation | null
    public readonly Intensity: WebGLUniformLocation | null
    public readonly Direction: WebGLUniformLocation | null

    constructor(gl: WebGLRenderingContext, program: WebGLProgram)
    {
        this.Colour = gl.getUniformLocation(program, 'U_DirectionalColour')
        this.Intensity = gl.getUniformLocation(program, 'U_DirectionalIntensity')
        this.Direction = gl.getUniformLocation(program, 'U_DirectionalDirection')
    }  
}