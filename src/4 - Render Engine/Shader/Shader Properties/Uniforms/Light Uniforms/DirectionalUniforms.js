/**
 * @param {WebGLRenderingContext}   GL
 * @param {WebGLProgram}            Program
 */
function DirectionalUniforms(GL, Program)
{
    Object.defineProperties(this,
    {
        /**
         * @property    {Colour}
         * @type        {WebGLUniformLocations}
         */
        Colour: { value: GL.getUniformLocation(Program, "U_Directional.Colour"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Intensity}
         * @type        {WebGLUniformLocations}
         */
        Intensity: { value: GL.getUniformLocation(Program, "U_Directional.Intensity"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Direction}
         * @type        {WebGLUniformLocations}
         */
        Direction: { value: GL.getUniformLocation(Program, "U_Directional.Direction"), configurable: false, enumerable: true, writable: false }
    });
 
    Object.seal(this);
}
Object.seal(DirectionalUniforms);

DirectionalUniforms.prototype = Object.create(null);
Object.seal(DirectionalUniforms.prototype);
