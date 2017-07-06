/**
 * @name        Vector4
 * @module      FWGE.Game.Maths 
 * @description vector library contains the methods for 2 component vector operations.
 *              4 component vector are represented as a Float32Array of length 4.
 */

window.Vector4 = (function()
{
    /**
     * @param   {number}    w
     * @param   {number}    x
     * @param   {number}    y
     * @param   {number}    z
     */
    function Vector4(w = 0, x = 0, y = 0, z = 0)
    {
        BufferedArray.call(this, 4, Float32Array);
        this.Set(w, x, y, z);

        Object.seal(this);
    }
    Object.defineProperties(Vector4,
    {
        
        Zero: { get: function Zero() { return new Vector4(0, 0, 0, 0); } },
        One: { get: function One() { return new Vector4(1, 1, 1, 1); } },
        Unit: { get: function Unit()  { return new Vector4(0.5, 0.5, 0.5, 0.5); } },

        /**
         * @function    Set
         * @param       {Vector4}   vector
         * @param       {number}    w
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector4}
         */
        Set:
        {
            value: function Set(vector, w, x, y, z)
            {
                vector.W = w;
                vector.X = x;
                vector.Y = y;
                vector.Z = z;

                return vector;
            }
        },
        
        /**
         * @function    Length
         * @param       {Vector4}   vector
         * @return      {number}
         */
        Length:
        {
            value: function Length(vector)
            {
                return Math.sqrt(vector.W * vector.W + vector.X * vector.X + vector.Y * vector.Y + vector.Z * vector.Z);
            }
        },
        
        /**
         * @function    Sum
         * @param       {Vector4}   vector
         * @param       {number}    w
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector4}
         */
        Sum:
        {
            value: function Sum(vector, w, x, y, z)
            {
                return new Vector4(vector.W + w, vector.X + x, vector.Y + y, vector.Z + z);
            }
        },
        
        /**
         * @function    Diff
         * @param       {Vector4}   vector
         * @param       {number}    w
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector4}
         */
        Diff:
        {
            value: function Diff(vector, w, x, y, z)
            {
                return new Vector4(w - vector.W, x - vector.X, y - vector.Y, z - vector.Z);
            }
        },

        /**
         * @function    Mult
         * @param       {Vector4}   vector
         * @param       {number}    w
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @param       {Vector4}
         */
        Mult:
        {
            value: function Mult(vector, w, x, y, z)
            {
                return new Vector4(vector.W * w, vector.X * x, vector.Y * y, vector.Z * z);
            }
        },

        /**
         * @function    Scale
         * @param       {Vector4}   vector
         * @param       {number}    scalar
         * @return      {Vector4}
         */
        Scale:
        {
            value: function Scale(vector, scaler)
            {
                return Vector4.Mult(vector, scaler, scaler, scaler, scaler);
            }
        },
        
        /**
         * @function    Dot
         * @param       {Vector4}   vector
         * @param       {number}    w
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector4}
         */
        Dot:
        {
            value: function Dot(vector, w, x, y, z)
            {
                return vector.W * w + vector.X * x + vector.Y * y + vector.Z * z;
            }
        },

        /**
         * @function    Unit
         * @param       {Vector4}   vector
         * @return      {Vector4}
         */
        Unit:
        {
            value: function Unit(vector)
            {   
                let length = vector.Length;

                if (length !== 0)
                    length = 1;

                return Vector4.Scale(vector, 1 / length);
            }
        }
    });

    Object.defineProperties(Vector4.prototype,
    {
        constructor: { value: Vector4 },

        W:
        {
            get: function W()  { return this.Buffer[0]; },
            set: function W(w) { this.Buffer[0] = w;    }
        },
        
        X:
        {
            get: function X()  { return this.Buffer[1]; },
            set: function X(x) { this.Buffer[1] = x;    }
        },

        Y:
        {
            get: function Y()  { return this.Buffer[2]; },
            set: function Y(y) { this.Buffer[2] = y;    }
        },
        
        Z:
        {
            get: function Z()  { return this.Buffer[3]; },
            set: function Z(z) { this.Buffer[3] = z;    }
        },

        /**
         * @function    Set
         * @param       {Vector4}   vector
         * @param       {number}    w
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector4}
         */
        Set:
        {
            value: function Set(w, x, y, z)
            {
                return Vector4.Set(this, w, x, y, z);
            }
        },
        
        /**
         * @function    Length
         * @param       {Vector4}   vector
         * @return      {number}
         */
        Length:
        {
            get: function Length()
            {
                return Vector4.Length(this);
            }
        },
        
        /**
         * @function    Sum
         * @param       {Vector4}   vector
         * @param       {number}    w
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector4}
         */
        Sum:
        {
            value: function Sum(w, x, y, z)
            {
                return new Vector4(this.W + w, this.X + x, this.Y + y, this.Z + z);
            }
        },
        
        /**
         * @function    Diff
         * @param       {Vector4}   vector
         * @param       {number}    w
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector4}
         */
        Diff:
        {
            value: function Diff(w, x, y, z)
            {
                return new Vector4(w - this.W, x - this.X, y - this.Y, z - this.Z);
            }
        },

        /**
         * @function    Mult
         * @param       {Vector4}   vector
         * @param       {number}    w
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @param       {Vector4}
         */
        Mult:
        {
            value: function Mult(w, x, y, z)
            {
                return new Vector4(this.W * w, this.X * x, this.Y * y, this.Z * z);
            }
        },

        /**
         * @function    Scale
         * @param       {Vector4}   vector
         * @param       {number}    scalar
         * @return      {Vector4}
         */
        Scale:
        {
            value: function Scale(scaler)
            {
                return this.Mult(scaler, scaler, scaler, scaler);
            }
        },
        
        /**
         * @function    Dot
         * @param       {Vector4}   vector
         * @param       {number}    w
         * @param       {number}    x
         * @param       {number}    y
         * @param       {number}    z
         * @return      {Vector4}
         */
        Dot:
        {
            value: function Dot(w, x, y, z)
            {
                return Vector4.Dot(this, w, x, y, z);
            }
        },

        /**
         * @function    Unit
         * @param       {Vector4}   vector
         * @return      {Vector4}
         */
        Unit:
        {
            value: function Unit(vector)
            {   
                let length = vector.Length;

                if (length !== 0)
                    length = 1;

                return this.Scale(vector, 1 / length);
            }
        }
    });
    Object.seal(Vector4.prototype);

    return Vector4;
})();
Object.seal(Vector4);
