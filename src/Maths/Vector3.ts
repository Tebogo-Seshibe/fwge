import Cloneable from '../Interfaces/Cloneable'
import Maths, { Sigfigs } from '../Maths/Maths'
import List from '../Utility/List'
import Vector2 from './Vector2'
import Vector4 from './Vector4'

export type Vector3Tuple = 
[
    number, number, number
]

export default class Vector3 extends Float32Array implements Cloneable<Vector3>
{
    //#region Public Properties
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

    get Z(): number
    {
        return this[2]
    }

    set Z(z: number)
    {
        this[2] = Sigfigs(z)
    }

    get Length(): number
    {
        return Vector3.Length(this)
    }
    //#endregion

    //#region Public Methods
    constructor()
    constructor(x: number, y: number, z: number)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(list: List<number>)
    constructor(vector: Vector2)
    constructor(vector: Vector3)
    constructor(vector: Vector4)
    constructor(x?: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number)
    {
        super(3)

        if (x)
        {
            Vector3.Set(this, x, y, z)
        }
    }

    Set(x: number, y: number, z: number): Vector3
    Set(array: Float32Array): Vector3
    Set(array: number[]): Vector3
    Set(list: List<number>): Vector3
    Set(vector: Vector2): Vector3
    Set(vector: Vector3): Vector3
    Set(vector: Vector4): Vector3
    Set(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        return Vector3.Set(this, x, y, z)
    }

    Sum(x: number, y: number, z: number): Vector3
    Sum(array: Float32Array): Vector3
    Sum(array: number[]): Vector3
    Sum(list: List<number>): Vector3
    Sum(vector: Vector2): Vector3
    Sum(vector: Vector3): Vector3
    Sum(vector: Vector4): Vector3
    Sum(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        return Vector3.Sum(this, x, y, z)
    }
    
    Diff(x: number, y: number, z: number): Vector3
    Diff(array: Float32Array): Vector3
    Diff(array: number[]): Vector3
    Diff(list: List<number>): Vector3
    Diff(vector: Vector2): Vector3
    Diff(vector: Vector3): Vector3
    Diff(vector: Vector4): Vector3
    Diff(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y, z ] = x
        }

        return Vector3.Diff(this, x, y, z)
    }

    Mult(x: number, y: number, z: number): Vector3
    Mult(array: Float32Array): Vector3
    Mult(array: number[]): Vector3
    Mult(list: List<number>): Vector3
    Mult(vector: Vector2): Vector3
    Mult(vector: Vector3): Vector3
    Mult(vector: Vector4): Vector3
    Mult(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        return Vector3.Mult(this, x, y, z)
    }

    Scale(scalar: number): Vector3
    {
        return Vector3.Scale(this, scalar)
    }

    Dot(x: number, y: number, z: number): number
    Dot(array: Float32Array): number
    Dot(array: number[]): number
    Dot(list: List<number>): number
    Dot(vector: Vector2): number
    Dot(vector: Vector3): number
    Dot(vector: Vector4): number
    Dot(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): number
    {
        return Vector3.Dot(this, x, y, z)
    }

    Cross(x: number, y: number, z: number): Vector3
    Cross(array: Float32Array): Vector3
    Cross(array: number[]): Vector3
    Cross(list: List<number>): Vector3
    Cross(vector: Vector2): Vector3
    Cross(vector: Vector3): Vector3
    Cross(vector: Vector4): Vector3
    Cross(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        return Vector3.Cross(this, x, y, z)
    }

    Unit(): Vector3
    {
        return Vector3.Unit(this)
    }

    toString(): string
    {
        return `<${this.X}, ${this.Y}, ${this.Z}>`
    }
    
    Clone(): Vector3
    {
        return new Vector3(this)
    }
    //#endregion

    //#region Static Properties
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

    static Length(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number)
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y, z ] = x
        }

        return Maths.CleanFloat(Math.sqrt(x ** 2 + y ** 2 + z ** 2))
    }
    //#endregion

    //#region  Static Methods
    static Set(vector: Vector3, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        vector.X = x
        vector.Y = y
        vector.Z = z

        return vector
    }

    static Sum(vector: Vector3, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        return Vector3.Set(vector, vector.X + x, vector.Y + y, vector.Z + z)
    }

    static Diff(vector: Vector3, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        return Vector3.Set(vector, vector.X - x, vector.Y - y, vector.Z - z)
    }

    static Mult(vector: Vector3, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        return Vector3.Set(vector, vector.X * x, vector.Y * y, vector.Z * z)
    }

    static Cross(vector: Vector3, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        return Vector3.Set(vector, vector.Y * z - vector.Z * y, vector.Z * x - vector.X * z, vector.X * y - vector.Y * x)
    }

    static Scale(vector: Vector3, scalar: number): Vector3
    {
        return Vector3.Mult(vector, scalar, scalar, scalar)
    }

    static Dot(vector: Vector3, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): number
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        return Maths.CleanFloat(vector.X * x + vector.Y * y + vector.Z * z)
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
    //#endregion

    //#region Static Helpers
    private static Destructure(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3Tuple
    {
        if (x instanceof Vector2)
        {
            [ x, y, z ] = [ x.X, x.Y, 0 ]
        }
        else if (x instanceof Vector3 || x instanceof Vector4)
        {
            [ x, y, z ] = [ x.X, x.Y, x.Z ]
        }
        else if (x instanceof Float32Array || x instanceof Array || x instanceof List)
        {
            [ x, y, z ] = x
        }

        return [ x, y, z ]
    }
    //#endregion
}
