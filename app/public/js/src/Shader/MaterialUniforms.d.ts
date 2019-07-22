export default class MaterialUniforms {
    readonly Ambient: WebGLUniformLocation;
    readonly Diffuse: WebGLUniformLocation;
    readonly Specular: WebGLUniformLocation;
    readonly Shininess: WebGLUniformLocation;
    readonly Alpha: WebGLUniformLocation;
    readonly HasImage: WebGLUniformLocation;
    readonly HasBump: WebGLUniformLocation;
    readonly HasSpecular: WebGLUniformLocation;
    constructor(gl: WebGLRenderingContext, program: WebGLProgram);
}
