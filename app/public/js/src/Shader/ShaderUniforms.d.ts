import MaterialUniforms from './MaterialUniforms';
import MatrixUniforms from './MatrixUniforms';
import LightUniforms from './LightUniforms';
import SamplerUniforms from './SamplerUniforms';
export default class ShaderUniforms {
    readonly Material: MaterialUniforms;
    readonly Matrix: MatrixUniforms;
    readonly Light: LightUniforms;
    readonly Sampler: SamplerUniforms;
    constructor(gl: WebGLRenderingContext, program: WebGLProgram);
}
