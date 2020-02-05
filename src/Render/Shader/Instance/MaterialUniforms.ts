export default class MaterialUniforms
{
    public readonly Ambient: WebGLUniformLocation
    public readonly Diffuse: WebGLUniformLocation
    public readonly Specular: WebGLUniformLocation
    public readonly Shininess: WebGLUniformLocation
    public readonly Alpha: WebGLUniformLocation
    public readonly HasImage: WebGLUniformLocation
    public readonly HasBump: WebGLUniformLocation
    public readonly HasSpecular: WebGLUniformLocation
    
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
