export default class ShaderAttributes
{
    public readonly Position: number
    public readonly Colour: number
    public readonly UV: number
    public readonly Normal: number

    constructor(gl: WebGLRenderingContext, program: WebGLProgram)
    {
        this.Position = gl.getAttribLocation(program, 'A_Position')
        this.Colour = gl.getAttribLocation(program, 'A_Colour')
        this.UV = gl.getAttribLocation(program, 'A_UV')
        this.Normal = gl.getAttribLocation(program, 'A_Normal')
    }
}
