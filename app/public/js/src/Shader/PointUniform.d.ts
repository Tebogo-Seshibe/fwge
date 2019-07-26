export default class PointUniform {
    readonly Colour: WebGLUniformLocation;
    readonly Intensity: WebGLUniformLocation;
    readonly Position: WebGLUniformLocation;
    readonly Radius: WebGLUniformLocation;
    readonly Angle: WebGLUniformLocation;
    constructor(gl: WebGLRenderingContext, program: WebGLProgram, index: number);
}
