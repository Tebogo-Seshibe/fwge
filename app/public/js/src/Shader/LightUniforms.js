import AmbientUniforms from './AmbientUniforms';
import DirectionalUniforms from './DirectionalUniforms';
import PointUniform from './PointUniform';
export default class LightUniforms {
    constructor(gl, program) {
        this.Ambient = new AmbientUniforms(gl, program);
        this.Directional = new DirectionalUniforms(gl, program);
        this.PointCount = gl.getUniformLocation(program, `U_Point_Count`);
        this.Point = new Array(LightUniforms.MAX_LIGHT);
        for (var i = 0; i < LightUniforms.MAX_LIGHT; ++i) {
            this.Point.push(new PointUniform(gl, program, i));
        }
    }
}
LightUniforms.MAX_LIGHT = 8;
//# sourceMappingURL=LightUniforms.js.map