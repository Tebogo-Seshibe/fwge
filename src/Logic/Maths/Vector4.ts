import Cloneable from '../Interfaces/Cloneable';
import List from '../Utility/List';
import './Maths';
import Vector2 from './Vector2';
import Vector3 from './Vector3';

export default class Vector4 extends Float32Array implements Cloneable<Vector4>
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

    public get W(): number
    {
        return this[3]
    }

    public set W(w: number)
    {
        this[3] = Math.clean(w)
    }

    public get Length(): number
    {
        return Vector4.Length(this)   
    }
    //#endregion

    //#region Public Methods
    constructor()
    constructor(x: number, y: number, z: number, w: number)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(list: List<number>)
    constructor(vector: Vector2)
    constructor(vector: Vector3)
    constructor(vector: Vector4)
    constructor(x?: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number)
    {
        super(4)

        if (x)
        {
            Vector4.Set
            (
                this,
                x, y, z, w
            )
        }
    }

    public Set(x: number, y: number, z: number, w: number): Vector4
    public Set(array: Float32Array): Vector4
    public Set(array: number[]): Vector4
    public Set(list: List<number>): Vector4
    public Set(vector: Vector2): Vector4
    public Set(vector: Vector3): Vector4
    public Set(vector: Vector4): Vector4
    public Set(x?: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        return Vector4.Set
        (
            this,
            x, y, z, w
        )
    }
    
    public Sum(x: number, y: number, z: number, w: number): Vector4
    public Sum(array: Float32Array): Vector4
    public Sum(array: number[]): Vector4
    public Sum(list: List<number>): Vector4
    public Sum(vector: Vector2): Vector4
    public Sum(vector: Vector3): Vector4
    public Sum(vector: Vector4): Vector4
    public Sum(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        return Vector4.Sum(this, x, y, z, w)
    }
    
    public Diff(x: number, y: number, z: number, w: number): Vector4
    public Diff(array: Float32Array): Vector4
    public Diff(array: number[]): Vector4
    public Diff(list: List<number>): Vector4
    public Diff(vector: Vector2): Vector4
    public Diff(vector: Vector3): Vector4
    public Diff(vector: Vector4): Vector4
    public Diff(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        return Vector4.Diff(this, x, y, z, w)
    }
    
    public Mult(x: number, y: number, z: number, w: number): Vector4
    public Mult(array: Float32Array): Vector4
    public Mult(array: number[]): Vector4
    public Mult(list: List<number>): Vector4
    public Mult(vector: Vector2): Vector4
    public Mult(vector: Vector3): Vector4
    public Mult(vector: Vector4): Vector4
    public Mult(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        return Vector4.Mult(this, x, y, z, w)
    }
    
    public Dot(x: number, y: number, z: number, w: number): number
    public Dot(array: Float32Array): number
    public Dot(array: number[]): number
    public Dot(list: List<number>): number
    public Dot(vector: Vector2): number
    public Dot(vector: Vector3): number
    public Dot(vector: Vector4): number
    public Dot(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): number
    {
        return Vector4.Dot(this, x, y, z, w)
    }
    
    public Lerp(time: number, x: number, y: number, z: number, w: number): Vector4
    public Lerp(time: number, array: Float32Array): Vector4
    public Lerp(time: number, array: number[]): Vector4
    public Lerp(time: number, list: List<number>): Vector4
    public Lerp(time: number, vector: Vector2): Vector4
    public Lerp(time: number, vector: Vector3): Vector4
    public Lerp(time: number, vector: Vector4): Vector4
    public Lerp(time: number, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        let to = new Vector4(Vector4.Destructure(x, y, z, w))

        return Vector4.Lerp(this, to, time)
    }
    
    public Unit(): Vector4
    {
        return Vector4.Unit(this)
    }

    public toString(): string
    {
        return `<${this.W}, ${this.X}, ${this.Y}, ${this.Z}>`
    }

    public toLocaleString(): string
    {
        return this.toString()
    }    
    
    public Clone(): Vector4
    {
        return new Vector4(this)
    }
    //#endregion

    //#region Static Methods
    public static Set(vector: Vector4, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        vector.X = x
        vector.Y = y
        vector.Z = z
        vector.W = w

        return vector;
    }

    public static Sum(vector: Vector4, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        return Vector4.Set(vector, vector.W + w, vector.X + x, vector.Y + y, vector.Z + z);
    }

    public static Diff(vector: Vector4, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        return Vector4.Set(vector, vector.W - w, vector.X - x, vector.Y - y, vector.Z - z);
    }

    public static Mult(vector: Vector4, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        return Vector4.Set(vector, vector.W * w, vector.X * x, vector.Y * y, vector.Z * z);
    }
    
    public static Scale(vector: Vector4, scaler: number): Vector4
    {

        return Vector4.Mult(vector, scaler, scaler, scaler, scaler);
    }

    public static Dot(vector: Vector4, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): number
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        return vector.W * w + vector.X * x + vector.Y * y + vector.Z * z;
    }

    public static Unit(vector: Vector4): Vector4
    {   
        let length = vector.Length;

        if (length !== 0)
        {
            Vector4.Scale(vector, 1 / length)
        }

        return vector
    }

    public static Length(w?: Vector4 | Float32Array | Array<number> | List<number> | number, x?: number, y?: number, z?: number): number
    {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array || w instanceof List)
        {
            [ w, x, y, z ] = w
        }

        return Math.clean(Math.sqrt(w ** 2 + x ** 2 + y ** 2 + z ** 2))
    }

    public static Lerp(from: Vector4, to: Vector4, time: number, out: Vector4 = new Vector4): Vector4
    {
        return out.Set
        (
            Math.lerp(from.X, to.X, time),
            Math.lerp(from.Y, to.Y, time),
            Math.lerp(from.Z, to.Z, time),
            Math.lerp(from.W, to.W, time)
        )
    }
    //#endregion
    
    //#region Static Properties
    public static get ZERO(): Vector4
    {
        return new Vector4(0, 0, 0, 0)
    }
    
    public static get ONE(): Vector4
    {
        return new Vector4(1, 1, 1, 1)
    }
    
    public static get UNIT(): Vector4
    {
        return new Vector4(0.5, 0.5, 0.5, 0.5)
    }
    //#endregion    

    //#region Static Helpers
    private static Destructure(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): number[]
    {
        if (x instanceof Vector2)
        {
            [ x, y, z, w ] = [ x.X, x.Y, 0, 0 ]
        }
        else if (x instanceof Vector3)
        {
            [ x, y, z, w ] = [ x.X, x.Y, x.Z, 0 ]
        }
        else if (x instanceof Vector4)
        {
            [ x, y, z, w ] = [ x.X, x.Y, x.Z, x.W ]
        }
        else if (x instanceof Float32Array || x instanceof Array || x instanceof List)
        {
            [ x, y, z, w ] = x
        }

        return [ x, y, z, w ]
    }
    //#endregion
}