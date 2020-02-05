import { GL } from "../../../Main";

export default class ShaderAttributes
{
    public readonly Position: number
    public readonly Colour: number
    public readonly UV: number
    public readonly Normal: number
    public readonly Exists: boolean

    constructor(program: WebGLProgram)
    {
        this.Position = GL.getAttribLocation(program, 'A_Position')
        this.Colour = GL.getAttribLocation(program, 'A_Colour')
        this.UV = GL.getAttribLocation(program, 'A_UV')
        this.Normal = GL.getAttribLocation(program, 'A_Normal')

        this.Exists = (this.Position + this.Colour + this.UV + this.Normal) > -4
    }
}
