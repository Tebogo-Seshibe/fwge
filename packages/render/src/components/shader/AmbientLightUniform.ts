export class AmbientLightUniform
{
    constructor(
        public readonly Colour: WebGLUniformLocation | null,
        public readonly Intensity: WebGLUniformLocation | null
    ) { }
}

Object.setPrototypeOf(AmbientLightUniform.prototype, null)
