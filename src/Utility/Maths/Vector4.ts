/**
 * @name        Vector4
 * @module      FWGE.Game.Maths 
 * @description vector library contains the methods for 2 component vector operations.
 *              4 component vector are represented as a Float32Array of length 4.
 */

export default class Vector4 extends Float32Array
{
    constructor(w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number)
    {
        super(4)

        this.Set(w, x, y, z);
    }

    get W(): number
    {
        return this[0]
    }
    set W(w: number)
    {
        this[0] = w
    }
    
    get X(): number
    {
        return this[1]
    }
    set X(x: number)
    {
        this[1] = x
    }
    
    get Y(): number
    {
        return this[2]
    }
    set Y(y: number)
    {
        this[2] = y
    }
    
    get Z(): number
    {
        return this[3]
    }
    set Z(z: number)
    {
        this[3] = z
    }

    get Length(): number
    {
        return Vector4.Length(this)   
    }

    static Length(w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): number
    {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array)
        {
            [ w, x, y, z ] = w
        }

        return Math.sqrt(w ** 2 + x ** 2 + y ** 2 + z ** 2)
    }
    
    get ZERO(): Vector4
    {
        return new Vector4(0, 0, 0, 0)
    }
    
    get ONE(): Vector4
    {
        return new Vector4(1, 1, 1, 1)
    }
    
    get UNIT(): Vector4
    {
        return new Vector4(0.5, 0.5, 0.5, 0.5)
    }

    Set(w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): Vector4
    {
        return Vector4.Set(this, w, x, y, z)
    }
    
    static Set(vector: Vector4,  w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): Vector4
    {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array)
        {
            [ w, x, y, z ] = w
        }

        vector.W = w | vector.W
        vector.X = x | vector.X
        vector.Y = y | vector.Y
        vector.Z = z | vector.Z

        return vector;
    }
        
        
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
