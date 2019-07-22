export default class MatrixUniforms {
    readonly ModelView: WebGLUniformLocation;
    readonly Projection: WebGLUniformLocation;
    readonly Normal: WebGLUniformLocation;
    readonly Camera: WebGLUniformLocation;
    constructor(gl: WebGLRenderingContext, program: WebGLProgram);
}
