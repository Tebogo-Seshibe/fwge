/**
 * @param {WebGLRenderingContext}   GL 
 * @param {WebGLProgram}            Program 
 */
function MaterialUniforms(GL, Program)
{
    Object.defineProperties(this,
    {
        /**
         * @property    {Ambient}
         * @type        {WebGLUniformLocations}
         */
        Ambient:    { value: GL.getUniformLocation(Program, "U_Material.Ambient"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Diffuse}
         * @type        {WebGLUniformLocations}
         */
        Diffuse:    { value: GL.getUniformLocation(Program, "U_Material.Diffuse"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Specular}
         * @type        {WebGLUniformLocations}
         */
        Specular:   { value: GL.getUniformLocation(Program, "U_Material.Specular"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Shininess}
         * @type        {WebGLUniformLocations}
         */
        Shininess:  { value: GL.getUniformLocation(Program, "U_Material.Shininess"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Alpha}
         * @type        {WebGLUniformLocations}
         */
        Alpha:      { value: GL.getUniformLocation(Program, "U_Material.Alpha"), configurable: false, enumerable: true, writable: false },

        
        /**
         * @property    {HasImage}
         * @type        {WebGLUniformLocations}
         */
        HasImage:    { value: GL.getUniformLocation(Program, "U_Material.HasImage"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {HasBump}
         * @type        {WebGLUniformLocations}
         */
        HasBump:     { value: GL.getUniformLocation(Program, "U_Material.HasBump"), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {HasSpecular}
         * @type        {WebGLUniformLocations}
         */
        HasSpecular: { value: GL.getUniformLocation(Program, "U_Material.HasSpecular"), configurable: false, enumerable: true, writable: false }
    });
    
    Object.seal(this);
}
Object.seal(MaterialUniforms);

MaterialUniforms.prototype = Object.create(null);
Object.seal(MaterialUniforms.prototype);
