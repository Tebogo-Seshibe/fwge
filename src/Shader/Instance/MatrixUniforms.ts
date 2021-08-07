export default class MatrixUniforms
{
    public readonly ModelView: WebGLUniformLocation | null
    public readonly Projection: WebGLUniformLocation | null
    public readonly Normal: WebGLUniformLocation | null
    public readonly Camera: WebGLUniformLocation | null

    constructor(gl: WebGLRenderingContext, program: WebGLProgram)
    {
        this.ModelView = gl.getUniformLocation(program, 'U_MatrixModelView')
        this.Projection = gl.getUniformLocation(program, 'U_MatrixProjection')
        this.Normal = gl.getUniformLocation(program, 'U_MatrixNormal')
        this.Camera = gl.getUniformLocation(program, 'U_MatrixCamera')
    }
}
