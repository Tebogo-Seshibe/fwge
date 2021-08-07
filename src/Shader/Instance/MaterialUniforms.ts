export default class MaterialUniforms
{
    public readonly Ambient: WebGLUniformLocation | null
    public readonly Diffuse: WebGLUniformLocation | null
    public readonly Specular: WebGLUniformLocation | null
    public readonly Shininess: WebGLUniformLocation | null
    public readonly Alpha: WebGLUniformLocation | null
    public readonly HasImage: WebGLUniformLocation | null
    public readonly HasBump: WebGLUniformLocation | null
    public readonly HasSpecular: WebGLUniformLocation | null
    
    constructor(gl: WebGLRenderingContext, program: WebGLProgram)
    {
        this.Ambient = gl.getUniformLocation(program, 'U_MaterialAmbient')
        this.Diffuse = gl.getUniformLocation(program, 'U_MaterialDiffuse')
        this.Specular = gl.getUniformLocation(program, 'U_MaterialSpecular')
        this.Shininess = gl.getUniformLocation(program, 'U_MaterialShininess')
        this.Alpha = gl.getUniformLocation(program, 'U_MaterialAlpha')
        this.HasImage = gl.getUniformLocation(program, 'U_MaterialHasImage')
        this.HasBump = gl.getUniformLocation(program, 'U_MaterialHasBump')
        this.HasSpecular = gl.getUniformLocation(program, 'U_MaterialHasSpecular')
    }
}
