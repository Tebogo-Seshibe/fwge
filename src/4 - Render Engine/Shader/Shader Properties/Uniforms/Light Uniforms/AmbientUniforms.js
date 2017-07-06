/**
 * @param {WebGLRenderingContext}   GL
 * @param {WebGLProgram}            Program
 */
function AmbientUniforms(GL, Program)
{
    Object.defineProperties(this,
    {
        /**
         * @property    {Colour}
         * @type        {WebGLUniformLocations}
         */
        Colour: {value: GL.getUniformLocation(Program, "U_Ambient.Colour"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Intensity}
         * @type        {WebGLUniformLocations}
         */
        Intensity: {value: GL.getUniformLocation(Program, "U_Ambient.Intensity"), configurable: false, enumerable: true, writable: false }
    });
 
    Object.seal(this);
}
Object.seal(AmbientUniforms);

AmbientUniforms.prototype = Object.create(null);
Object.seal(AmbientUniforms.prototype);
