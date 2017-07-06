/**
 * @param {WebGLRenderingContext}   GL
 * @param {WebGLProgram}            Program
 */
function ShaderUniforms(GL, Program)
{
    Object.defineProperties(this,
    {
        /**
         * @property    {Material}
         * @type        {WebGLUniformLocations}
         */
        Material:   { value:  new MaterialUniforms(GL,  Program), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Matrix}
         * @type        {WebGLUniformLocations}
         */
        Matrix: { value:  new MatrixUniforms(GL,    Program), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Light}
         * @type        {WebGLUniformLocations}
         */
        Light:  { value:  new LightUniforms(GL,     Program), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Sampler}
         * @type        {WebGLUniformLocations}
         */
        Sampler:    { value:  new SamplerUniforms(GL,   Program), configurable: false, enumerable: true, writable: false }
    });
 
    Object.seal(this);
}
Object.seal(ShaderUniforms);

ShaderUniforms.prototype = Object.create(null);
Object.seal(ShaderUniforms.prototype);
