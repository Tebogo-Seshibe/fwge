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
        this.Ambient = gl.getUniformLocation(program, 'U_Material.Ambient')
        this.Diffuse = gl.getUniformLocation(program, 'U_Material.Diffuse')
        this.Specular = gl.getUniformLocation(program, 'U_Material.Specular')
        this.Shininess = gl.getUniformLocation(program, 'U_Material.Shininess')
        this.Alpha = gl.getUniformLocation(program, 'U_Material.Alpha')
        this.HasImage = gl.getUniformLocation(program, 'U_Material.HasImage')
        this.HasBump = gl.getUniformLocation(program, 'U_Material.HasBump')
        this.HasSpecular = gl.getUniformLocation(program, 'U_Material.HasSpecular')
    }
}
