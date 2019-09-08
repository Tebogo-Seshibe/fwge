import Cloneable from '../Interfaces/Cloneable';
import List from '../Utility/List';
import './Maths';
import Vector3 from './Vector3';
import Vector4 from './Vector4';

export default class Vector2 extends Float32Array implements Cloneable<Vector2>
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

    public get Length(): number
    {
        return Vector2.Length(this)
    }
    //#endregion

    //#region Public Methods
    constructor()
    constructor(x: number, y: number)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(list: List<number>)
    constructor(vector: Vector2)
    constructor(vector: Vector3)
    constructor(vector: Vector4)
    constructor(x?: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number)
    {
        super(2)

        if (x)
        {
            Vector2.Set(this, x, y)
        }
    }

    public Set(x: number, y: number): Vector2
    public Set(array: Float32Array): Vector2
    public Set(array: number[]): Vector2
    public Set(list: List<number>): Vector2
    public Set(vector: Vector2): Vector2
    public Set(vector: Vector3): Vector2
    public Set(vector: Vector4): Vector2
    public Set(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number): Vector2
    {
        return Vector2.Set(this, x, y)
    }

    public Sum(x: number, y: number): Vector2
    public Sum(array: Float32Array): Vector2
    public Sum(array: number[]): Vector2
    public Sum(list: List<number>): Vector2
    public Sum(vector: Vector2): Vector2
    public Sum(vector: Vector3): Vector2
    public Sum(vector: Vector4): Vector2
    public Sum(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number): Vector2
    {
        return Vector2.Sum(this, x, y)
    }

    public Diff(x: number, y: number): Vector2
    public Diff(array: Float32Array): Vector2
    public Diff(array: number[]): Vector2
    public Diff(list: List<number>): Vector2
    public Diff(vector: Vector2): Vector2
    public Diff(vector: Vector3): Vector2
    public Diff(vector: Vector4): Vector2
    public Diff(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number): Vector2
    {
        return Vector2.Diff(this, x, y)
    }

    public Mult(x: number, y: number): Vector2
    public Mult(array: Float32Array): Vector2
    public Mult(array: number[]): Vector2
    public Mult(list: List<number>): Vector2
    public Mult(vector: Vector2): Vector2
    public Mult(vector: Vector3): Vector2
    public Mult(vector: Vector4): Vector2
    public Mult(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number): Vector2
    {
        return Vector2.Mult(this, x, y)
    }

    public Scale(scalar: number): Vector2
    {
        return Vector2.Scale(this, scalar)
    }

    public Dot(vector: Vector2): number
    public Dot(vector: Vector3): number
    public Dot(vector: Vector4): number
    public Dot(array: Float32Array): number
    public Dot(array: number[]): number
    public Dot(list: List<number>): number
    public Dot(x: number, y: number): number
    public Dot(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number): number
    {
        return Vector2.Dot(this, x, y)
    }

    public Unit(): Vector2
    {
        return Vector2.Unit(this)
    }

    public toString(): string
    {
        return `<${this.X}, ${this.Y}>`
    }
    
    public Clone(): Vector2
    {
        return new Vector2(this)
    }
    //#endregion

    //#region Static Methods
    public static Set(vector: Vector2, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number): Vector2
    {
        [ x, y ] = Vector2.Destructure(x, y)

        vector.X = x
        vector.Y = y
        
        return vector
    }

    public static Sum(vector: Vector2, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number): Vector2
    {
        [ x, y ] = Vector2.Destructure(x, y)

        return Vector2.Set(vector, vector.X + x, vector.Y + y)
    }

    public static Diff(vector: Vector2, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number): Vector2
    {
        [ x, y ] = Vector2.Destructure(x, y)

        return Vector2.Set(vector, vector.X - x, vector.Y - y)
    }

    public static Mult(vector: Vector2, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number): Vector2
    {
        [ x, y ] = Vector2.Destructure(x, y)

        return Vector2.Set(vector, vector.X * x, vector.Y * y)
    }

    public static Scale(vector: Vector2, scalar: number): Vector2
    {
        return Vector2.Mult(vector, scalar, scalar)
    }

    public static Dot(vector: Vector2, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number): number
    {
        [ x, y ] = Vector2.Destructure(x, y)

        return Math.clean(vector.X * x + vector.Y * y)
    }

    public static Unit(vector: Vector2): Vector2
    {
        let length = vector.Length

        if (length !== 0)
        {
            Vector2.Scale(vector, 1 / length)
        }

        return vector
    }
    //#endregion

    //#region Static Properties
    public static get ZERO(): Vector2
    {
        return new Vector2(0, 0)
    }

    public static get ONE(): Vector2
    {
        return new Vector2(1, 1)
    }

    public static get UNIT(): Vector2
    {
        return new Vector2(Math.sqrt(1/2), Math.sqrt(1/2))
    }

    public static Length(x?: Vector2 | Float32Array | number[] | number, y?: number): number
    {
        [ x, y ] = Vector2.Destructure(x, y)

        return Math.clean(Math.sqrt(x ** 2 + y ** 2))
    }
    //#endregion

    //#region Static Helpers
    private static Destructure(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number): number[]
    {
        if (x instanceof Vector2 || x instanceof Vector3 || x instanceof Vector4)
        {
            [ x, y ] = [ x.X, x.Y ]
        }
        else if (x instanceof Float32Array || x instanceof List || x instanceof Array)
        {
            [ x, y ] = x
        }

        return [ x, y ]
    }
    //#endregion
}
