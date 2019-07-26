export default class AmbientUniforms {
    readonly Colour: WebGLUniformLocation;
    readonly Intensity: WebGLUniformLocation;
    constructor(gl: WebGLRenderingContext, program: WebGLProgram);
}
