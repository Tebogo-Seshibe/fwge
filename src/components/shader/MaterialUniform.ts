export class MaterialUniform
{
    constructor(
        public readonly AmbientColour: WebGLUniformLocation | null,
        public readonly DiffuseColour: WebGLUniformLocation | null,
        public readonly SpecularColour: WebGLUniformLocation | null,
        public readonly Shininess: WebGLUniformLocation | null,
        public readonly Alpha: WebGLUniformLocation | null,        
        public readonly ImageSampler: WebGLUniformLocation | null,
        public readonly BumpSampler: WebGLUniformLocation | null,
        public readonly SpecularSampler: WebGLUniformLocation | null
    ) { }
}
