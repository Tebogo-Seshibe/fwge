export default class SamplerUniforms {
    readonly Image: WebGLUniformLocation;
    readonly Bump: WebGLUniformLocation;
    readonly Specular: WebGLUniformLocation;
    constructor(gl: WebGLRenderingContext, program: WebGLProgram);
}
