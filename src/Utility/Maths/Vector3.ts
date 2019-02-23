import Maths from '../Maths/Maths'
export default class Vector3 extends Float32Array
{
    constructor(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number)
    {
        super(3)

        this.Set(x, y, z)
    }


    get X(): number
    {
        return this[0]
    }

    set X(x: number)
    {
        this[0] = Maths.CleanFloat(x)
    }

    get Y(): number
    {
        return this[1]
    }

    set Y(y: number)
    {
        this[1] = Maths.CleanFloat(y)
    }

    get Z(): number
    {
        return this[2]
    }

    set Z(z: number)
    {
        this[2] = Maths.CleanFloat(z)
    }

    static get ZERO(): Vector3
    {
        return new Vector3(0, 0, 0)
    }

    static get ONE(): Vector3
    {
        return new Vector3(1, 1, 1)
    }

    static get UNIT(): Vector3
    {
        return new Vector3(Math.sqrt(1/3), Math.sqrt(1/3), Math.sqrt(1/3))
    }

    get Length(): number
    {
        return Vector3.Length(this)
    }

    static Length(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number)
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y, z ] = x
        }

        return Maths.CleanFloat(Math.sqrt(x ** 2 + y ** 2 + z ** 2))
    }


    Set(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number): Vector3
    {
        return Vector3.Set(this, x, y, z)
    }

    static Set(vector: Vector3, x: Float32Array | number[] | number, y: number, z: number): Vector3
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y, z ] = x
        }

        vector.X = x
        vector.Y = y
        vector.Z = z

        return vector
    }

    Sum(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number): Vector3
    {
        return Vector3.Sum(this, x, y, z)
    }

    static Sum(vector: Vector3, x?: Float32Array | number[] | number, y?: number, z?: number): Vector3
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y, z ] = x
        }

        return Vector3.Set(vector, vector.X + x, vector.Y + y, vector.Z + z)
    }
    
    Diff(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number): Vector3
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y, z ] = x
        }

        return Vector3.Diff(this, x, y, z)
    }

    static Diff(vector: Vector3, x?: Float32Array | number[] | number, y?: number, z?: number): Vector3
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y, z ] = x
        }

        return Vector3.Set(vector, vector.X - x, vector.Y - y, vector.Z - z)
    }

    Mult(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number): Vector3
    {
        return Vector3.Mult(this, x, y, z)
    }

    static Mult(vector: Vector3, x?: Float32Array | number[] | number, y?: number, z?: number): Vector3
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y, z ] = x
        }

        return Vector3.Set(vector, vector.X * x, vector.Y * y, vector.Z * z)
    }

    Scale(scalar: number): Vector3
    {
        return Vector3.Scale(this, scalar)
    }

    static Scale(vector: Vector3, scalar: number): Vector3
    {
        return Vector3.Mult(vector, scalar, scalar, scalar)
    }

    Dot(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number): number
    {
        return Vector3.Dot(this, x, y, z)
    }

    static Dot(vector: Vector3, x?: Float32Array | number[] | number, y?: number, z?: number): number
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y, z ] = x
        }

        return Maths.CleanFloat(vector.X * x + vector.Y * y + vector.Z * z)
    }

    Cross(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number): Vector3
    {
        return Vector3.Cross(this, x, y, z)
    }

    static Cross(vector: Vector3, x?: Float32Array | number[] | number, y?: number, z?: number): Vector3
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y, z ] = x
        }   

        return Vector3.Set(vector, vector.Y * z - vector.Z * y, vector.Z * x - vector.X * z, vector.X * y - vector.Y * x)
    }

    Unit(): Vector3
    {
        return Vector3.Unit(this)
    }

    static Unit(vector: Vector3): Vector3
    {
        var length = vector.Length;

        if (length !== 0)
        {
            Vector3.Scale(vector, 1 / length)
        }

        return vector
    }

    toString(): string
    {
        return `<${this.X}, ${this.Y}, ${this.Z}>`
    }

    toLocaleString(): string
    {
        return this.toString()
    }
}
