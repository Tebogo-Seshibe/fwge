export default class DirectionalUniforms {
    constructor(gl, program) {
        this.Colour = gl.getUniformLocation(program, 'U_Directional.Colour');
        this.Intensity = gl.getUniformLocation(program, 'U_Directional.Intensity');
        this.Direction = gl.getUniformLocation(program, 'U_Directional.Direction');
    }
}
//# sourceMappingURL=DirectionalUniforms.js.map