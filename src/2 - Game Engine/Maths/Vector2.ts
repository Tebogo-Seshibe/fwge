export default class Vector2 extends Float32Array
{
    constructor(x?: Vector2 | Float32Array | number[] | number, y?: number)
    {
        super(2)

        this.Set(x, y)
    }


    get X(): number
    {
        return this[0]
    }
    set X(x: number)
    {
        this[0] = x
    }

    get Y(): number
    {
        return this[1]
    }
    set Y(y: number)
    {
        this[1] = y
    }

    static get ZERO(): Vector2
    {
        return new Vector2(0, 0)
    }

    static get ONE(): Vector2
    {
        return new Vector2(1, 1)
    }

    static get UNIT(): Vector2
    {
        return new Vector2(Math.sqrt(1/2), Math.sqrt(1/2))
    }

    get Length():number
    {
        return Vector2.Length(this)
    }

    static Length(x?: Vector2 | Float32Array | number[] | number, y?: number): number
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y ] = x
        }

        return Math.sqrt(x ** 2 + y ** 2)
    }


    Set(x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2
    {
        return Vector2.Set(this, x, y)
    }

    static Set(vector: Vector2, x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y ] = x
        }

        vector.X = x | vector.X
        vector.Y = y | vector.Y

        return vector
    }

    Sum(x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2
    {
        return Vector2.Sum(this, x, y)
    }

    static Sum(vector: Vector2, x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y ] = x
        }

        return Vector2.Set(vector, vector.X + x, vector.Y + y)
    }

    Diff(x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2
    {
        return Vector2.Diff(this, x, y)
    }

    static Diff(vector: Vector2, x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y ] = x
        }

        return Vector2.Set(vector, vector.X - x,vector.Y - y)
    }

    Mult(x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2
    {
        return Vector2.Mult(this, x, y)
    }

    static Mult(vector: Vector2, x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y ] = x
        }
        return Vector2.Set(vector, vector.X * x, vector.Y * y)
    }

    Scale(scalar: number): Vector2
    {
        return Vector2.Scale(this, scalar)
    }

    static Scale(vector: Vector2, scalar: number): Vector2
    {
        return Vector2.Mult(vector, scalar, scalar)
    }

    Dot(x?: Vector2 | Float32Array | number[] | number, y?: number): number
    {
        return Vector2.Dot(this, x, y)
    }

    static Dot(vector: Vector2, x?: Vector2 | Float32Array | number[] | number, y?: number): number
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y ] = x
        }

        return vector.X * x + vector.Y * y
    }

    Unit(): Vector2
    {
        return Vector2.Unit(this)
    }

    static Unit(vector: Vector2): Vector2
    {
        let length = vector.Length;

        if (length !== 0)
            length = 1;

        return Vector2.Scale(vector, 1 / length);
    }
}
