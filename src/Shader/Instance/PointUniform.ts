export default class PointUniform
{
    public readonly Colour: WebGLUniformLocation | null
    public readonly Intensity: WebGLUniformLocation | null
    public readonly Position: WebGLUniformLocation | null
    public readonly Radius: WebGLUniformLocation | null
    public readonly Angle: WebGLUniformLocation | null
    
    constructor(gl: WebGLRenderingContext, program: WebGLProgram, index: number)
    {
        this.Colour = gl.getUniformLocation(program, `U_Point[${index}].Colour`)
        this.Intensity = gl.getUniformLocation(program, `U_Point[${index}].Intensity`)
        this.Position = gl.getUniformLocation(program, `U_Point[${index}].Position`)
        this.Radius = gl.getUniformLocation(program, `U_Point[${index}].Radius`)
        this.Angle = gl.getUniformLocation(program, `U_Point[${index}].Angle`)
    }
}
