import Cloneable from '../Interfaces/Cloneable'
import List from '../Utility/List'
import Maths, { Sigfigs } from './Maths'
import Vector2 from './Vector2'
import Vector3 from './Vector3'

export type Vector4Tuple = 
[
    number, number, number, number
]

export default class Vector4 extends Float32Array implements Cloneable<Vector4>
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

    get W(): number
    {
        return this[3]
    }

    set W(w: number)
    {
        this[3] = Sigfigs(w)
    }

    get Length(): number
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

    Set(x: number, y: number, z: number, w: number): Vector4
    Set(array: Float32Array): Vector4
    Set(array: number[]): Vector4
    Set(list: List<number>): Vector4
    Set(vector: Vector2): Vector4
    Set(vector: Vector3): Vector4
    Set(vector: Vector4): Vector4
    Set(x?: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        return Vector4.Set
        (
            this,
            x, y, z, w
        )
    }
    
    Sum(x: number, y: number, z: number, w: number): Vector4
    Sum(array: Float32Array): Vector4
    Sum(array: number[]): Vector4
    Sum(list: List<number>): Vector4
    Sum(vector: Vector2): Vector4
    Sum(vector: Vector3): Vector4
    Sum(vector: Vector4): Vector4
    Sum(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        return Vector4.Sum(this, x, y, z, w)
    }
    
    Diff(x: number, y: number, z: number, w: number): Vector4
    Diff(array: Float32Array): Vector4
    Diff(array: number[]): Vector4
    Diff(list: List<number>): Vector4
    Diff(vector: Vector2): Vector4
    Diff(vector: Vector3): Vector4
    Diff(vector: Vector4): Vector4
    Diff(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        return Vector4.Diff(this, x, y, z, w)
    }
    
    Mult(x: number, y: number, z: number, w: number): Vector4
    Mult(array: Float32Array): Vector4
    Mult(array: number[]): Vector4
    Mult(list: List<number>): Vector4
    Mult(vector: Vector2): Vector4
    Mult(vector: Vector3): Vector4
    Mult(vector: Vector4): Vector4
    Mult(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        return Vector4.Mult(this, x, y, z, w)
    }
    
    Dot(x: number, y: number, z: number, w: number): number
    Dot(array: Float32Array): number
    Dot(array: number[]): number
    Dot(list: List<number>): number
    Dot(vector: Vector2): number
    Dot(vector: Vector3): number
    Dot(vector: Vector4): number
    Dot(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): number
    {
        return Vector4.Dot(this, x, y, z, w)
    }
    
    Unit(): Vector4
    {
        return Vector4.Unit(this)
    }

    toString(): string
    {
        return `<${this.W}, ${this.X}, ${this.Y}, ${this.Z}>`
    }

    toLocaleString(): string
    {
        return this.toString()
    }    
    
    Clone(): Vector4
    {
        return new Vector4(this)
    }
    //#endregion

    //#region Static Methods
    static Set(vector: Vector4, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        vector.X = x
        vector.Y = y
        vector.Z = z
        vector.W = w

        return vector;
    }

    static Sum(vector: Vector4, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        return Vector4.Set(vector, vector.W + w, vector.X + x, vector.Y + y, vector.Z + z);
    }

    static Diff(vector: Vector4, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        return Vector4.Set(vector, vector.W - w, vector.X - x, vector.Y - y, vector.Z - z);
    }

    static Mult(vector: Vector4, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        return Vector4.Set(vector, vector.W * w, vector.X * x, vector.Y * y, vector.Z * z);
    }
    
    static Scale(vector: Vector4, scaler: number): Vector4
    {

        return Vector4.Mult(vector, scaler, scaler, scaler, scaler);
    }

    static Dot(vector: Vector4, x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): number
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        return vector.W * w + vector.X * x + vector.Y * y + vector.Z * z;
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

    static Length(w?: Vector4 | Float32Array | Array<number> | List<number> | number, x?: number, y?: number, z?: number): number
    {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array || w instanceof List)
        {
            [ w, x, y, z ] = w
        }

        return Maths.CleanFloat(Math.sqrt(w ** 2 + x ** 2 + y ** 2 + z ** 2))
    }
    //#endregion
    
    //#region Static Properties
    static get ZERO(): Vector4
    {
        return new Vector4(0, 0, 0, 0)
    }
    
    static get ONE(): Vector4
    {
        return new Vector4(1, 1, 1, 1)
    }
    
    static get UNIT(): Vector4
    {
        return new Vector4(1/2, 1/2, 1/2, 1/2)
    }
    //#endregion    

    //#region Static Helpers
    private static Destructure(x: Float32Array | number[] | List<number> | Vector2 | Vector3 | Vector4 | number, y?: number, z?: number, w?: number): Vector4Tuple
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