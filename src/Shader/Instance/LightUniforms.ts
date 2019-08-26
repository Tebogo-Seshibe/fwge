import AmbientUniforms from './AmbientUniforms';
import DirectionalUniforms from './DirectionalUniforms';
import PointUniform from './PointUniform';

export default class LightUniforms
{
    private static readonly MAX_LIGHT: number = 8
    
    public readonly Ambient: AmbientUniforms
    public readonly Directional: DirectionalUniforms
    public readonly PointCount: WebGLUniformLocation
    public readonly Point: Array<PointUniform>

    constructor(gl: WebGLRenderingContext, program: WebGLProgram)
    {
        this.Ambient = new AmbientUniforms(gl, program)
        this.Directional = new DirectionalUniforms(gl, program)
        this.PointCount = gl.getUniformLocation(program, `U_Point_Count`)
        this.Point = new Array<PointUniform>()
        
        for (var i = 0; i < LightUniforms.MAX_LIGHT; ++i)
        {
            this.Point.push(new PointUniform(gl, program, i))
        }
    }
}