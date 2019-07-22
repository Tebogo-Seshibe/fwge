export default class AmbientUniforms {
    constructor(gl, program) {
        this.Colour = gl.getUniformLocation(program, 'U_Ambient.Colour');
        this.Intensity = gl.getUniformLocation(program, 'U_Ambient.Intensity');
    }
}
//# sourceMappingURL=AmbientUniforms.js.map