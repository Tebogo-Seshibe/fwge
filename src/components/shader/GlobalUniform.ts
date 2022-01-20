export class GlobalUniform
{
    constructor(        
        public readonly Time: WebGLUniformLocation | null,
        public readonly Resolution: WebGLUniformLocation | null,
        public readonly NearClip: WebGLUniformLocation | null,
        public readonly FarClip: WebGLUniformLocation | null,
        public readonly ObjectID: WebGLUniformLocation | null,
        public readonly ObjectCount: WebGLUniformLocation | null
    ) { }
}
