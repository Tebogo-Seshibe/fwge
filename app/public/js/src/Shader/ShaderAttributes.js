export default class ShaderAttributes {
    constructor(gl, program) {
        this.Position = gl.getAttribLocation(program, 'A_Position');
        this.Colour = gl.getAttribLocation(program, 'A_Colour');
        this.UV = gl.getAttribLocation(program, 'A_UV');
        this.Normal = gl.getAttribLocation(program, 'A_Normal');
    }
}
//# sourceMappingURL=ShaderAttributes.js.map