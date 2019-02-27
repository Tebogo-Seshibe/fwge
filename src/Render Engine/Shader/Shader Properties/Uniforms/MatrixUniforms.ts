export default class MatrixUniforms
{
    public readonly ModelView: WebGLUniformLocation
    public readonly Projection: WebGLUniformLocation
    public readonly Normal: WebGLUniformLocation
    public readonly Camera: WebGLUniformLocation

    constructor(gl: WebGLRenderingContext, program: WebGLProgram)
    {
        this.ModelView = gl.getUniformLocation(program, 'U_Matrix.ModelView')
        this.Projection = gl.getUniformLocation(program, 'U_Matrix.Projection')
        this.Normal = gl.getUniformLocation(program, 'U_Matrix.Normal')
        this.Camera = gl.getUniformLocation(program, 'U_Matrix.Camera')
    }
}
