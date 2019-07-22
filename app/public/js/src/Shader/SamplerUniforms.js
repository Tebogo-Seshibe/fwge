export default class SamplerUniforms {
    constructor(gl, program) {
        this.Image = gl.getUniformLocation(program, 'U_Sampler.Image');
        this.Bump = gl.getUniformLocation(program, 'U_Sampler.Bump');
        this.Specular = gl.getUniformLocation(program, 'U_Sampler.Specular');
    }
}
//# sourceMappingURL=SamplerUniforms.js.map