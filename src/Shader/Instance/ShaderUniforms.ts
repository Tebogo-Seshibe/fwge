import MaterialUniforms from './MaterialUniforms'
import MatrixUniforms from './MatrixUniforms'
import LightUniforms from './LightUniforms'
import SamplerUniforms from './SamplerUniforms'

export default class ShaderUniforms
{
    public readonly Material: MaterialUniforms
    public readonly Matrix: MatrixUniforms
    public readonly Light: LightUniforms
    public readonly Sampler: SamplerUniforms

    constructor(gl: WebGLRenderingContext, program: WebGLProgram)
    {
        this.Material = new MaterialUniforms(gl, program)
        this.Matrix = new MatrixUniforms(gl, program)
        this.Light = new LightUniforms(gl, program)
        this.Sampler = new SamplerUniforms(gl, program)
    }
}