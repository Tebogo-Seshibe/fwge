export class PointLightUniform
{
    constructor(
        public readonly Colour: WebGLUniformLocation | null,
        public readonly Intensity: WebGLUniformLocation | null,
        public readonly Position: WebGLUniformLocation | null,
        public readonly Radius: WebGLUniformLocation | null,
    ) { }
}

Object.setPrototypeOf(PointLightUniform.prototype, null)