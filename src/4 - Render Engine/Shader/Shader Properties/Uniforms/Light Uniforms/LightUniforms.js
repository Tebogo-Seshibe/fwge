/**
 * @param {WebGLRenderingContext}   GL
 * @param {WebGLProgram}            Program
 */
function LightUniforms(GL, Program)
{
    Object.defineProperties(this,
    {
        /**
         * @property    {Ambient}
         * @type        {WebGLUniformLocations}s
         */
        Ambient: { value: new AmbientUniforms(GL, Program), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Directional}
         * @type        {WebGLUniformLocations}
         */
        Directional: { value: new DirectionalUniforms(GL, Program), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {PointCount}
         * @type        {WebGLUniformLocations}
         */
        PointCount: { value: GL.getUniformLocation(Program, `U_PointCount`), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Point}
         * @type        {WebGLUniformLocations}
         */
        Point: { value: [], configurable: false, enumerable: true, writable: false }

    });

    for (var i = 0; i < 8; ++i)
        this.Point.push(new PointUniforms(GL, Program, i));
 
    Object.seal(this);
}
Object.seal(LightUniforms);

LightUniforms.prototype = Object.create(null);
Object.seal(LightUniforms.prototype);
