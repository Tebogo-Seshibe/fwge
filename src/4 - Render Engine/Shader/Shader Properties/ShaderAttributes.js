/**
 * @param {WebGLRenderingContext}   GL 
 * @param {WebGLProgram}            Program 
 */
function ShaderAttributes(GL, Program)
{
    Object.defineProperties(this,
    {
        /**
         * @property    {Position}
         * @type        {number}
         */
        Position:   { value: GL.getAttribLocation(Program, "A_Position"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Colour}
         * @type        {number}
         */
        Colour:     { value: GL.getAttribLocation(Program, "A_Colour"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {UV}
         * @type        {number}
         */
        UV:         { value: GL.getAttribLocation(Program, "A_UV"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Normal}
         * @type        {number}
         */
        Normal:     { value: GL.getAttribLocation(Program, "A_Normal"), configurable: false, enumerable: true, writable: false },
    });

    Object.seal(this);
}
Object.seal(ShaderAttributes);

ShaderAttributes.prototype = Object.create(null);
Object.seal(ShaderAttributes.prototype);
