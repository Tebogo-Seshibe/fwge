import Cloneable from '../Interfaces/Cloneable'
import Maths, { Sigfigs } from './Maths'
import List from '../Utility/List'
import Vector3 from './Vector3'
import Vector4 from './Vector4'

export default class Vector2 extends Float32Array implements Cloneable<Vector2>
{
    constructor()
    constructor(vector: Vector2)
    constructor(vector: Vector3)
    constructor(vector: Vector4)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(list: List<number>)
    constructor(x: number, y: number)
    constructor(x?: Vector2 | Float32Array | number[] | List<number> | number, y?: number)
    {
        super(2)

        if (x)
        {
            Vector2.Set(this, x, y)
        }
    }

    get X(): number
    {
        return this[0]
    }
    set X(x: number)
    {
        this[0] = Sigfigs(x)
    }

    get Y(): number
    {
        return this[1]
    }
    set Y(y: number)
    {
        this[1] = Sigfigs(y)
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

    get Length(): number
    {
        return Vector2.Length(this)
    }

    static Length(x?: Vector2 | Float32Array | number[] | number, y?: number): number
    {
        [ x, y ] = Vector2.Destructure(x, y)

        return Maths.CleanFloat(Math.sqrt(x ** 2 + y ** 2))
    }

    Set(array: Float32Array): Vector2
    Set(array: number[]): Vector2
    Set(list: List<number>): Vector2
    Set(x: number, y: number): Vector2
    Set(x?: Vector2 | Float32Array | number[] | List<number> | number, y?: number): Vector2
    {
        return Vector2.Set(this, x, y)
    }

    static Set(vector: Vector2, x: Vector2 | Vector3 | Vector4 | Float32Array | number[] | List<number> | number, y?: number): Vector2
    {
        [ x, y ] = Vector2.Destructure(x, y)

        vector.X = x
        vector.Y = y
        
        return vector
    }

    Sum(vector: Vector2): Vector2
    Sum(vector: Vector3): Vector2
    Sum(vector: Vector4): Vector2
    Sum(array: Float32Array): Vector2
    Sum(array: number[]): Vector2
    Sum(list: List<number>): Vector2
    Sum(x: number, y: number): Vector2
    Sum(x?: Vector2 | Vector3 | Vector4 | Float32Array | number[] | List<number> | number, y?: number): Vector2
    {
        return Vector2.Sum(this, x, y)
    }

    static Sum(vector: Vector2, x: Vector2 | Vector3 | Vector4 | Float32Array | number[] | List<number> | number, y?: number): Vector2
    {
        [ x, y ] = Vector2.Destructure(x, y)

        return Vector2.Set(vector, vector.X + x, vector.Y + y)
    }

    Diff(vector: Vector2): Vector2
    Diff(vector: Vector3): Vector2
    Diff(vector: Vector4): Vector2
    Diff(array: Float32Array): Vector2
    Diff(array: number[]): Vector2
    Diff(list: List<number>): Vector2
    Diff(x: number, y: number): Vector2
    Diff(x?: Vector2 | Vector3 | Vector4 | Float32Array | number[] | List<number> | number, y?: number): Vector2
    {
        return Vector2.Diff(this, x, y)
    }

    static Diff(vector: Vector2, x: Vector2 | Vector3 | Vector4 | Float32Array | number[] | List<number> | number, y?: number): Vector2
    {
        [ x, y ] = Vector2.Destructure(x, y)

        return Vector2.Set(vector, vector.X - x, vector.Y - y)
    }

    Mult(vector: Vector2): Vector2
    Mult(vector: Vector3): Vector2
    Mult(vector: Vector4): Vector2
    Mult(array: Float32Array): Vector2
    Mult(array: number[]): Vector2
    Mult(list: List<number>): Vector2
    Mult(x: number, y: number): Vector2
    Mult(x: Vector2 | Vector3 | Vector4 | Float32Array | number[] | List<number> | number, y?: number): Vector2
    {
        return Vector2.Mult(this, x, y)
    }

    static Mult(vector: Vector2, x: Vector2 | Vector3 | Vector4 | Float32Array | number[] | List<number> | number, y?: number): Vector2
    {
        [ x, y ] = Vector2.Destructure(x, y)

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

    Dot(vector: Vector2): number
    Dot(vector: Vector3): number
    Dot(vector: Vector4): number
    Dot(array: Float32Array): number
    Dot(array: number[]): number
    Dot(list: List<number>): number
    Dot(x: number, y: number): number
    Dot(x: Vector2 | Vector3 | Vector4 | Float32Array | number[] | List<number> | number, y?: number): number
    {
        return Vector2.Dot(this, x, y)
    }

    static Dot(vector: Vector2, x: Vector2 | Vector3 | Vector4 | Float32Array | number[] | List<number> | number, y?: number): number
    {
        [ x, y ] = Vector2.Destructure(x, y)

        return Sigfigs(vector.X * x + vector.Y * y)
    }

    Unit(): Vector2
    {
        return Vector2.Unit(this)
    }

    static Unit(vector: Vector2): Vector2
    {
        let length = vector.Length

        if (length !== 0)
        {
            Vector2.Scale(vector, 1 / length)
        }

        return vector
    }

    toString(): string
    {
        return `<${this.X}, ${this.Y}>`
    }
    
    Clone(): Vector2
    {
        return new Vector2(this)
    }

    private static Destructure(x: Vector2 | Vector3 | Vector4 | Float32Array | number[] | List<number> | number, y?: number): [ number, number ]
    {

        if (x instanceof Vector2 || x instanceof Vector3 || x instanceof Vector4)
        {
            [ x, y ] = [ x.X, x.Y ]
        }
        else if (x instanceof Float32Array || x instanceof List || x instanceof Array)
        {
            [
                x, y
            ] = x
        }

        return [ x, y ]
    }
}
