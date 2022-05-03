export class DirectionalLightUniform
{
    constructor(
        public readonly Colour: WebGLUniformLocation | null,
        public readonly Intensity: WebGLUniformLocation | null,
        public readonly Direction: WebGLUniformLocation | null
    ) { }
}

Object.setPrototypeOf(DirectionalLightUniform.prototype, null)
