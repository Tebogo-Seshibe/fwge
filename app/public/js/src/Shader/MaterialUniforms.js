export default class MaterialUniforms {
    constructor(gl, program) {
        this.Ambient = gl.getUniformLocation(program, 'U_Material.Ambient');
        this.Diffuse = gl.getUniformLocation(program, 'U_Material.Diffuse');
        this.Specular = gl.getUniformLocation(program, 'U_Material.Specular');
        this.Shininess = gl.getUniformLocation(program, 'U_Material.Shininess');
        this.Alpha = gl.getUniformLocation(program, 'U_Material.Alpha');
        this.HasImage = gl.getUniformLocation(program, 'U_Material.HasImage');
        this.HasBump = gl.getUniformLocation(program, 'U_Material.HasBump');
        this.HasSpecular = gl.getUniformLocation(program, 'U_Material.HasSpecular');
    }
}
//# sourceMappingURL=MaterialUniforms.js.map