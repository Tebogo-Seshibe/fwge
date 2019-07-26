import AmbientUniforms from './AmbientUniforms';
import DirectionalUniforms from './DirectionalUniforms';
import PointUniform from './PointUniform';
export default class LightUniforms {
    private static readonly MAX_LIGHT;
    readonly Ambient: AmbientUniforms;
    readonly Directional: DirectionalUniforms;
    readonly PointCount: WebGLUniformLocation;
    readonly Point: Array<PointUniform>;
    constructor(gl: WebGLRenderingContext, program: WebGLProgram);
}
