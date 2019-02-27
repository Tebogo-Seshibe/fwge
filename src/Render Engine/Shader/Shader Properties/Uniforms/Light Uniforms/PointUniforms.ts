export default class PointUniforms
{
    constructor(GL, Program, index)
    {

    }
    
    Object.defineProperties(this,
    {
        /**
         * @property    {Colour}
         * @type        {WebGLUniformLocations}
         */
        Colour: { value: GL.getUniformLocation(Program, `U_Point[${index}].Colour`), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Intensity}
         * @type        {WebGLUniformLocations}
         */
        Intensity:  { value: GL.getUniformLocation(Program, `U_Point[${index}].Intensity`), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Position}
         * @type        {WebGLUniformLocations}
         */
        Position:   { value: GL.getUniformLocation(Program, `U_Point[${index}].Position`), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Radius}
         * @type        {WebGLUniformLocations}
         */
        Radius: { value: GL.getUniformLocation(Program, `U_Point[${index}].Radius`), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {Angle}
         * @type        {WebGLUniformLocations}
         */
        Angle:  { value: GL.getUniformLocation(Program, `U_Point[${index}].Angle`), configurable: false, enumerable: true, writable: false }
    });
 
    Object.seal(this);
}
Object.seal(PointUniforms);

PointUniforms.prototype = Object.create(null);
Object.seal(PointUniforms.prototype);
