export default class MatrixUniforms
{
    public readonly ModelView: WebGLUniformLocation
    public readonly Projection: WebGLUniformLocation
    public readonly Normal: WebGLUniformLocation
    public readonly Camera: WebGLUniformLocation

    constructor(gl: WebGLRenderingContext, program: WebGLProgram)
    {
        this.ModelView = gl.getUniformLocation(program, 'U_MatrixModelView')
        this.Projection = gl.getUniformLocation(program, 'U_MatrixProjection')
        this.Normal = gl.getUniformLocation(program, 'U_MatrixNormal')
        this.Camera = gl.getUniformLocation(program, 'U_MatrixCamera')
    }
}
