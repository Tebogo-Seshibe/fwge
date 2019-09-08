import Cloneable from '../Interfaces/Cloneable';
import './Maths';
import List from '../Utility/List';
import Vector2 from './Vector2';
import Vector4 from './Vector4';

export default class Vector3 extends Float32Array implements Cloneable<Vector3>
{
    //#region Public Properties
    public get X(): number
    {
        return this[0]
    }

    public set X(x: number)
    {
        this[0] = Math.clean(x)
    }

    public get Y(): number
    {
        return this[1]
    }

    public set Y(y: number)
    {
        this[1] = Math.clean(y)
    }

    public get Z(): number
    {
        return this[2]
    }

    public set Z(z: number)
    {
        this[2] = Math.clean(z)
    }

    public get Length(): number
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

    public Set(x: number, y: number, z: number): Vector3
    public Set(array: Float32Array): Vector3
    public Set(array: number[]): Vector3
    public Set(list: List<number>): Vector3
    public Set(vector: Vector2): Vector3
    public Set(vector: Vector3): Vector3
    public Set(vector: Vector4): Vector3
    public Set(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        return Vector3.Set(this, x, y, z)
    }

    public Sum(x: number, y: number, z: number): Vector3
    public Sum(array: Float32Array): Vector3
    public Sum(array: number[]): Vector3
    public Sum(list: List<number>): Vector3
    public Sum(vector: Vector2): Vector3
    public Sum(vector: Vector3): Vector3
    public Sum(vector: Vector4): Vector3
    public Sum(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        return Vector3.Sum(this, x, y, z)
    }
    
    public Diff(x: number, y: number, z: number): Vector3
    public Diff(array: Float32Array): Vector3
    public Diff(array: number[]): Vector3
    public Diff(list: List<number>): Vector3
    public Diff(vector: Vector2): Vector3
    public Diff(vector: Vector3): Vector3
    public Diff(vector: Vector4): Vector3
    public Diff(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y, z ] = x
        }

        return Vector3.Diff(this, x, y, z)
    }

    public Mult(x: number, y: number, z: number): Vector3
    public Mult(array: Float32Array): Vector3
    public Mult(array: number[]): Vector3
    public Mult(list: List<number>): Vector3
    public Mult(vector: Vector2): Vector3
    public Mult(vector: Vector3): Vector3
    public Mult(vector: Vector4): Vector3
    public Mult(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        return Vector3.Mult(this, x, y, z)
    }

    public Scale(scalar: number): Vector3
    {
        return Vector3.Scale(this, scalar)
    }

    public Dot(x: number, y: number, z: number): number
    public Dot(array: Float32Array): number
    public Dot(array: number[]): number
    public Dot(list: List<number>): number
    public Dot(vector: Vector2): number
    public Dot(vector: Vector3): number
    public Dot(vector: Vector4): number
    public Dot(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): number
    {
        return Vector3.Dot(this, x, y, z)
    }
    
    public Lerp(time: number, x: number, y: number, z: number): Vector3
    public Lerp(time: number, array: Float32Array): Vector3
    public Lerp(time: number, array: number[]): Vector3
    public Lerp(time: number, list: List<number>): Vector3
    public Lerp(time: number, vector: Vector2): Vector3
    public Lerp(time: number, vector: Vector3): Vector3
    public Lerp(time: number, vector: Vector4): Vector3
    public Lerp(time: number, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        let to = new Vector3(Vector3.Destructure(x, y, z))

        return Vector3.Lerp(this, to, time)
    }

    public Cross(x: number, y: number, z: number): Vector3
    public Cross(array: Float32Array): Vector3
    public Cross(array: number[]): Vector3
    public Cross(list: List<number>): Vector3
    public Cross(vector: Vector2): Vector3
    public Cross(vector: Vector3): Vector3
    public Cross(vector: Vector4): Vector3
    public Cross(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        return Vector3.Cross(this, x, y, z)
    }

    public Unit(): Vector3
    {
        return Vector3.Unit(this)
    }

    public toString(): string
    {
        return `<${this.X}, ${this.Y}, ${this.Z}>`
    }
    
    public Clone(): Vector3
    {
        return new Vector3(this)
    }
    //#endregion

    //#region Static Properties
    public static get ZERO(): Vector3
    {
        return new Vector3(0, 0, 0)
    }

    public static get ONE(): Vector3
    {
        return new Vector3(1, 1, 1)
    }

    public static get UNIT(): Vector3
    {
        return new Vector3(Math.sqrt(1/3), Math.sqrt(1/3), Math.sqrt(1/3))
    }

    public static Length(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number)
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y, z ] = x
        }

        return Math.clean(Math.sqrt(x ** 2 + y ** 2 + z ** 2))
    }
    //#endregion

    //#region  Static Methods
    public static Set(vector: Vector3, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        vector.X = x
        vector.Y = y
        vector.Z = z

        return vector
    }

    public static Sum(vector: Vector3, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        return Vector3.Set(vector, vector.X + x, vector.Y + y, vector.Z + z)
    }

    public static Diff(vector: Vector3, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        return Vector3.Set(vector, vector.X - x, vector.Y - y, vector.Z - z)
    }

    public static Mult(vector: Vector3, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        return Vector3.Set(vector, vector.X * x, vector.Y * y, vector.Z * z)
    }

    public static Cross(vector: Vector3, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        return Vector3.Set(vector, vector.Y * z - vector.Z * y, vector.Z * x - vector.X * z, vector.X * y - vector.Y * x)
    }

    public static Scale(vector: Vector3, scalar: number): Vector3
    {
        return Vector3.Mult(vector, scalar, scalar, scalar)
    }

    public static Dot(vector: Vector3, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): number
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        return Math.clean(vector.X * x + vector.Y * y + vector.Z * z)
    }

    public static Unit(vector: Vector3): Vector3
    {
        var length = vector.Length;

        if (length !== 0)
        {
            Vector3.Scale(vector, 1 / length)
        }

        return vector
    }

    public static Lerp(from: Vector3, to: Vector3, time: number): Vector3
    {
        return new Vector3
        (
            Math.lerp(from.X, to.X, time),
            Math.lerp(from.Y, to.Y, time),
            Math.lerp(from.Z, to.Z, time)
        )
    }
    //#endregion

    //#region Static Helpers
    private static Destructure(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number): number[]
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
