export class MatrixUniform
{
    constructor(
        public readonly ModelView: WebGLUniformLocation | null,
        public readonly Projection: WebGLUniformLocation | null,
        public readonly Normal: WebGLUniformLocation | null,
        public readonly View: WebGLUniformLocation | null
    ) { }
}

Object.setPrototypeOf(MatrixUniform.prototype, null)
