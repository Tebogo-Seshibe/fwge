export default class MatrixUniforms {
    constructor(gl, program) {
        this.ModelView = gl.getUniformLocation(program, 'U_Matrix.ModelView');
        this.Projection = gl.getUniformLocation(program, 'U_Matrix.Projection');
        this.Normal = gl.getUniformLocation(program, 'U_Matrix.Normal');
        this.Camera = gl.getUniformLocation(program, 'U_Matrix.Camera');
    }
}
//# sourceMappingURL=MatrixUniforms.js.map