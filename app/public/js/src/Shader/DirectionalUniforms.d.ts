export default class DirectionalUniforms {
    readonly Colour: WebGLUniformLocation;
    readonly Intensity: WebGLUniformLocation;
    readonly Direction: WebGLUniformLocation;
    constructor(gl: WebGLRenderingContext, program: WebGLProgram);
}
