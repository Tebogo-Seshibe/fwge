/**
 * @param {WebGLRenderingContext}   GL
 * @param {WebGLProgram}            Program
 */
function SamplerUniforms(GL, Program)
{
    Object.defineProperties(this,
    {
        /**
         * @property    {Image}
         * @type        {WebGLUniformLocations}
         */
        Image:  { value: GL.getUniformLocation(Program, "U_Sampler.Image"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Bump}
         * @type        {WebGLUniformLocations}
         */
        Bump:   { value: GL.getUniformLocation(Program, "U_Sampler.Bump"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Specular}
         * @type        {WebGLUniformLocations}
         */
        Specular:   { value: GL.getUniformLocation(Program, "U_Sampler.Specular"), configurable: false, enumerable: true, writable: false }
    });
 
    Object.seal(this);
}
Object.seal(SamplerUniforms);

SamplerUniforms.prototype = Object.create(null);
Object.seal(SamplerUniforms.prototype);
