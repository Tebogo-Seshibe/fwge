import Maths from "./Maths";
import Vector3 from "./Vector3";

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
        this[0] = Maths.CleanFloat(w)
    }
    
    get X(): number
    {
        return this[1]
    }
    set X(x: number)
    {
        this[1] = Maths.CleanFloat(x)
    }
    
    get Y(): number
    {
        return this[2]
    }
    set Y(y: number)
    {
        this[2] = Maths.CleanFloat(y)
    }
    
    get Z(): number
    {
        return this[3]
    }
    set Z(z: number)
    {
        this[3] = Maths.CleanFloat(z)
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

        return Maths.CleanFloat(Math.sqrt(w ** 2 + x ** 2 + y ** 2 + z ** 2))
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
            [ w, x, y, z ] = [ w[0], w[1], w[2], w[3] ]
        }

        vector.W = Maths.CleanFloat(w)
        vector.X = Maths.CleanFloat(x)
        vector.Y = Maths.CleanFloat(y)
        vector.Z = Maths.CleanFloat(z)

        return vector;
    }
    
    Sum(w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): Vector4
    {
        return Vector4.Sum(this, w, x, y, z)
    }

    static Sum(vector: Vector4, w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): Vector4
    {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array)
        {
            [ w, x, y, z ] = [ w[0], w[1], w[2], w[3] ]
        }

        return Vector4.Set(vector, vector.W + w, vector.X + x, vector.Y + y, vector.Z + z);
    }
    
    Diff(w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): Vector4
    {
        return Vector4.Diff(this, w, x, y, z)
    }

    static Diff(vector: Vector4, w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): Vector4
    {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array)
        {
            [ w, x, y, z ] = [ w[0], w[1], w[2], w[3] ]
        }

        return Vector4.Set(vector, vector.W - w, vector.X - x, vector.Y - y, vector.Z - z);
    }
    
    Mult(w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): Vector4
    {
        return Vector4.Mult(this, w, x, y, z)
    }

    static Mult(vector: Vector4, w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): Vector4
    {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array)
        {
            [ w, x, y, z ] = [ w[0], w[1], w[2], w[3] ]
        }

        return Vector4.Set(vector, vector.W * w, vector.X * x, vector.Y * y, vector.Z * z);
    }
    
    static Scale(vector: Vector4, scaler: number): Vector4
    {

        return Vector4.Mult(vector, scaler, scaler, scaler, scaler);
    }
    
    Dot(w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): number
    {
        return Vector4.Dot(this, w, x, y, z)
    }

    static Dot(vector: Vector4, w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): number
    {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array)
        {
            [ w, x, y, z ] = [ w[0], w[1], w[2], w[3] ]
        }

        return vector.W * w + vector.X * x + vector.Y * y + vector.Z * z;
    }
    
    Unit(): Vector4
    {
        return Vector4.Unit(this)
    }

    static Unit(vector: Vector4): Vector4
    {   
        let length = vector.Length;

        if (length !== 0)
        {
            Vector4.Scale(vector, 1 / length)
        }

        return vector
    }

    toString(): string
    {
        return `<${this.W}, ${this.X}, ${this.Y}, ${this.Z}>`
    }

    toLocaleString(): string
    {
        return this.toString()
    }
}
