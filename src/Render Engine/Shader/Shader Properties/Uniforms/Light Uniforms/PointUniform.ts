export default class PointUniform
{
    public readonly Colour: WebGLUniformLocation
    public readonly Intensity: WebGLUniformLocation
    public readonly Position: WebGLUniformLocation
    public readonly Radius: WebGLUniformLocation
    public readonly Angle: WebGLUniformLocation
    
    constructor(gl: WebGLRenderingContext, program: WebGLProgram, index: number)
    {
        this.Colour = gl.getUniformLocation(program, `U_Point[${index}].Colour`)
        this.Intensity = gl.getUniformLocation(program, `U_Point[${index}].Intensity`)
        this.Position = gl.getUniformLocation(program, `U_Point[${index}].Position`)
        this.Radius = gl.getUniformLocation(program, `U_Point[${index}].Radius`)
        this.Angle = gl.getUniformLocation(program, `U_Point[${index}].Angle`)
    }
}
