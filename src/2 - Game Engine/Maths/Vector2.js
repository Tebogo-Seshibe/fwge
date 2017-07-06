/**
 * @name        Vector2
 * @module      FWGE.Game.Maths 
 * @description This library contains the methods for 2 component vector operations.
 *              2 component vector are represented as a Float32Array of length 2.
 */

window.Vector2 = (function()
{
    /**
     * @param   {number}    x
     * @param   {number}    y
     */
    function Vector2(x = 0, y = 0)
    {
        BufferedArray.call(this, 2, Float32Array);
        this.Set(x, y);

        Object.seal(this);
    }
    Vector2.prototype = Object.create(null);

    Object.defineProperties(Vector2,
    {
        /**
         * @property    {Zero}
         * @type        {Vector2}
         */
        Zero: { get Zero()   { return new Vector2(0, 0); } },
        
        /**
         * @property    {One}
         * @type        {Vector2}
         */
        One: { get One()    { return new Vector2(1, 1); } },
        
        /**
         * @property    {Unit}
         * @type        {Vector2}
         */
        Unit: { get Unit()   { return new Vector2(Math.sqrt(1/2), Math.sqrt(1/2)); } },
        

        /**
         * @function    Length
         * @param       {Vector2}   vector
         * @param       {number}    x
         * @param       {number}    y
         * @return      {number}
         */
        Length:
        {
            value: function Length(x, y)
            {
                return Math.sqrt(x * x + y * y);
            }
        },

        /**
         * @function    Set
         * @param       {Vector2}   vector
         * @param       {number}    x
         * @param       {number}    y
         * @return      {Vector2}
         */
        Set:
        {
            value: function Set(vector, x, y)
            {
                vector.X = x;
                vector.Y = y;

                return vector;
            }
        },
        
        /**
         * @function    Sum
         * @param       {Vector}    vector
         * @param       {number}    x
         * @param       {number}    y
         * @return      {Vector2}
         */
        Sum:
        {
            value: function Sum(vector, x, y)
            {   
                return new Vector2(vector.X + x, vector.Y + y);
            }
        },
        
        /**
         * @function    Diff
         * @param       {Vector}    vector
         * @param       {number}    x
         * @param       {number}    y
         * @return      {Vector2}
         */
        Diff:
        {
            value: function Diff(vector, x, y)
            {   
                return new Vector2(x - vector.X, y - vector.Y);
            }
        },
        
        /**
         * @function    Mult
         * @param       {Vector}    vector
         * @param       {number}    x
         * @param       {number}    y
         * @return      {Vector2}
         */
        Mult:
        {
            value: function Mult(vector, x, y)
            {   
                return new Vector2(vector.X * x, vector.Y * y);
            }
        },
        
        /**
         * @function    Scale
         * @param       {Vector}    vector
         * @param       {number}    x
         * @param       {number}    y
         * @return      {Vector2}
         */
        Scale:
        {
            value: function Scale(vector, scalar)
            {   
                return Vector2.Mult(vector, scalar, scalar);
            }
        },
        
        /**
         * @function    Dot
         * @param       {Vector2}   vector
         * @param       {number}    x
         * @param       {number}    y
         * @return      {number}
         */
        Dot:
        {
            value: function Dot(vector, x, y)
            {
                return vector.X * x + vector.Y * y;
            }
        },
        
        /**
         * @function    Unit
         * @param       {Vector2} vector
         * @return      {Vector2}
         */
        Unit:
        {
            value: function Unit(vector)
            {
                let length = vector.Length;

                if (length !== 0)
                    length = 1;

                return Vector2.Scale(vector, 1 / length);
            }
        }
    });

    Object.defineProperties(Vector2.prototype,
    {
        constructor: { value: Vector2 },

        /**
         * @property    {X}
         * @type        {number}
         */
        X:
        {
            get: function X()  { return this.Buffer[0]; },
            set: function X(x) { this.Buffer[0] = x;    }
        },

        /**
         * @property    {Y}
         * @type        {number}
         */
        Y:
        {
            get: function Y()  { return this.Buffer[1]; },
            set: function Y(y) { this.Buffer[1] = y;    }
        },

        /**
         * @function    Length
         * @param       {number}    x
         * @param       {number}    y
         * @return      {number}
         */
        Length:
        {
            get: function Length()
            {
                return Vector2.Length(this.X, this.Y);
            }
        },
        
        /**
         * @function    Set
         * @param       {number}    x
         * @param       {number}    y
         * @return      {Vector2}
         */
        Set:
        {
            value: function Set(x, y)
            {
                return Vector2.Set(this, x, y);
            }
        },
        
        /**
         * @function    Sum
         * @param       {number}    x
         * @param       {number}    y
         * @return      {Vector2}
         */
        Sum:
        {
            value: function Sum(x, y)
            {   
                return Vector2.Set(this, this.X + x, this.Y + y);
            }
        },
        
        
        /**
         * @function    Diff
         * @param       {number}    x
         * @param       {number}    y
         * @return      {Vector2}
         */
        Diff:
        {
            value: function Diff(x, y)
            {   
                return Vector2.Set(this, x - this.X, y - this.Y);
            }
        },
        

        /**
         * @function    Mult
         * @param       {number}    x
         * @param       {number}    y
         * @return      {Vector2}
         */
        Mult:
        {
            value: function Mult(x, y)
            {   
                return Vector2.Set(this, this.X * x, this.Y * y);
            }
        },
        

        /**
         * @function    Scale
         * @param       {number}    scalar
         * @return      {Vector2}
         */
        Scale:
        {
            value: function Scale(scalar)
            {   
                return this.Mult(scalar, scalar);
            }
        },
        
        
        /**
         * @function    Dot
         * @param       {number}    x
         * @param       {number}    y
         * @return      {number}
         */
        Dot:
        {
            value: function Dot(x, y)
            {
                return Vector2.Dot(this, x, y);
            }
        },

        
        /**
         * @function    Unit
         * @return      {Vector2}
         */
        Unit:
        {
            value: function Unit()
            {
                let length = this.Length;

                if (length !== 0)
                    length = 1;

                return this.Scale(1 / length);
            }
        }
    });
    Object.seal(Vector2.prototype);

    return Vector2;
})();
Object.seal(Vector2);

