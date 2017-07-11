/**
 * @name        Vector3
 * @module      FWGE.Game.Maths
 * @description  MathsTHis object represents a 3-valued vector.
 */

window.Vector3 = (function()
{
    /**
     * @param {number}  x 
     * @param {number}  y 
     * @param {number}  z 
     */
    function Vector3(x = 0, y = 0, z = 0)
    {
        BufferedArray.call(this, 3, Float32Array);
        this.Set(x, y, z);

        Object.seal(this);
    }
    Object.defineProperties(Vector3,
    {
        /**
         * @property    {Zero}
         * @type        {Vector3}
         */
        Zero: { get: function Zero() { return new Vector3(0, 0, 0); }, configurable: false, enumerable: true },

        /**
         * @property    {One}
         * @type        {Vector3}
         */
        One: { get: function One() { return new Vector3(1, 1, 1); }, configurable: false, enumerable: true },

        /**
         * @property    {Unit}
         * @type        {Vector3}
         */
        Unit: { get Unit() { return new Vector3(Math.sqrt(1/3), Math.sqrt(1/3), Math.sqrt(1/3)); }, configurable: false, enumerable: true },
        

        /**
         * @function    Set
         * @param       {Vector3}   vector
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector3}
         */
        Set: 
        { 
            value: function Set(vector, x, y, z)
            {        
                vector.X = x;
                vector.Y = y;
                vector.Z = z;

                return vector;
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Length
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {numbers}
         * @description ...
         */
        Length:
        {
            value: function Length(x, y, z)
            {
                return Math.sqrt(x * x + y * y + z * z);
            },
            configurable: false, enumerable: true, writable: false
        },

        /**
         * @function    Sum
         * @param       {Vector3}   vector
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector3}
         * @description ...
         */
        Sum:
        {
            value: function Sum(vector, x, y, z)
            {
                return new Vector3(vector.X + x, vector.Y + y, vector.Z + z)
            },
            configurable: false, enumerable: true, writable: false
        },

        /**
         * @function    Diff
         * @param       {Vector3}   vector
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector3}
         * @description ...
         */
        Diff:
        {
            value: function Diff(vector, x, y, z)
            {
                return new Vector3(x - vector.X, y - vector.Y, z - vector.Z);
            },
            configurable: false, enumerable: true, writable: false
        },

        /**
         * @function    Mult
         * @param       {Vector3}   vector
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector3}
         * @description ...
         */
        Mult:
        {
            value: function Mult(vector, x, y, z)
            {
                return new Vector3(vector.X * x, vector.Y * y, vector.Z * z)
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Scale
         * @param       {Vector3}   vector
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector3}
         * @description ...
         */
        Scale:
        {
            value: function Scale(vector, scaler)
            {
                return Vector3.Mult(vector, scaler, scaler, scaler);
            },
            configurable: false, enumerable: true, writable: false
        },

        /**
         * @function    Dot
         * @param       {Vector3} vector
         * @param       {number} x
         * @param       {number} x
         * @param       {number} x
         */
        Dot:
        {
            value: function Dot(vector, x, y, z)
            {
                return vector.X * x + vector.Y * y + vector.Z * z;
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Cross
         * @param       {Vector3}   vector
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector3}
         * @description ...
         */
        Cross:
        {
            value: function Cross(vector, x, y, z)
            {
                return new Vector3(vector.Y * z + vector.Z * y, vector.Z * x - vector.X * z, vector.X * y + vector.Y * x);
            },
            configurable: false, enumerable: true, writable: false
        },

        /**
         * @function    Unit
         * @param       {Vector3}   vector
         * @return      {Vector3}
         * @description ...
         */
        Unit:
        {
            value: function Unit(vector)
            {
                var length = vector.Length;

                if (length !== 0)
                    length = 1;

                return Vector3.Scale(vector, 1 / length);
            },
            configurable: false, enumerable: true, writable: false
        }
    });

    Vector3.prototype = Object.create(null);
    Object.defineProperties(Vector3.prototype,
    {    
        /**
         * @property    {X}
         * @type        {number}
         * @description Returns a zero-valued vector
         */
        X:
        {
            get: function get()  { return this.Buffer[0]; },
            set: function set(x) { this.Buffer[0] = x; },
            configurable: false, enumerable: true
        },

        /**
         * @property    {Y}
         * @type        {number}
         * @description Returns a zero-valued vector
         */
        Y:
        {
            get: function get()  { return this.Buffer[1]; },
            set: function set(y) { this.Buffer[1] = y; },
            configurable: false, enumerable: true
        },

        /**
         * @property    {Z}
         * @type        {number}
         * @description Returns a zero-valued vector
         */
        Z:
        {
            get: function get()  { return this.Buffer[2]; },
            set: function set(z) { this.Buffer[2] = z; },
            configurable: false, enumerable: true
        },
            
        /**
         * @property    {Length}
         * @type        {number}
         * @description Returns a zero-valued vector
         */
        Length:
        {
            get: function get() { return Vector3.Length(this.X, this.Y, this.Z); },
            configurable: false, enumerable: true
        },
        
        
        /**
         * @function    Cross
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector3}
         */
        Set:
        {
            value: function Set(x, y, z)
            {
                return Vector3.Set(this, x, y, z);
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Cross
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector3}
         */
        Sum:
        {
            value: function Sum(x, y, z)
            {
                return Vector3.Set(this, this.X + x, this.Y + y, this.Z + z);
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Diff
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector3}
         */
        Diff:
        {
            value: function Diff(x, y, z)
            {
                return Vector3.Set(this, x - this.X, y - this.Y, z - this.Z);
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Mult
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector3}
         */
        Mult:
        {
            value: function Mult(x, y, z)
            {        
                return Vector3.Set(this.X * x, this.Y * y, this.Z * z);
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Dot
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {number}
         */
        Dot:
        {
            value: function Dot(x, y, z)
            {
                return Vector3.Dot(this, x, y, Z);
            },
            configurable: false, enumerable: true, writable: false
        },

        /**
         * @function    Cross
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector3}
         */
        Cross:
        {     
            value: function Cross(x, y, z)
            {
                return Vector3.Set(this, this.Y * z + this.Z * y, this.Z * x - this.X * z, this.X * y + this.Y * x);
            },
            configurable: false, enumerable: true, writable: false
        },

        /**
         * @function    Scale
         * @param       {number}    scalar
         * @return      {Vector3}
         */
        Scale:
        {
            value: function Scale(scaler)
            {
                return Vector3.Set(this, this.X * scaler, this.Y * scaler, this.Z * scaler);
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Unit
         * @return      {Vector3}
         */
        Unit:
        {
            value: function Unit()
            {
                var length = this.Length;

                if (length !== 0)
                    Vector3.Scale(this, 1 / length);

                return this;
            },
            configurable: false, enumerable: true, writable: false
        }
    });
    Object.seal(Vector3.prototype);

    return Vector3;
})();
Object.seal(Vector3);
