export default class ShaderAttributes {
    readonly Position: number;
    readonly Colour: number;
    readonly UV: number;
    readonly Normal: number;
    constructor(gl: WebGLRenderingContext, program: WebGLProgram);
}
