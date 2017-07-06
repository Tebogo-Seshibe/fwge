/**
 * @param {WebGLRenderingContext}   GL 
 * @param {WebGLProgram}            Program 
 */
function MatrixUniforms(GL, Program)
{
    Object.defineProperties(this,
    {
        /**
         * @property    {ModelView}
         * @type        {WebGLUniformLocations}
         */
        ModelView:  { value: GL.getUniformLocation(Program, "U_Matrix.ModelView"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Projection}
         * @type        {WebGLUniformLocations}
         */
        Projection: { value: GL.getUniformLocation(Program, "U_Matrix.Projection"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Normal}
         * @type        {WebGLUniformLocations}
         */
        Normal:     { value: GL.getUniformLocation(Program, "U_Matrix.Normal"), configurable: false, enumerable: true, writable: false }
    });
    
    Object.seal(this);
}
Object.seal(MatrixUniforms);

MatrixUniforms.prototype = Object.create(null);
Object.seal(MatrixUniforms.prototype);
