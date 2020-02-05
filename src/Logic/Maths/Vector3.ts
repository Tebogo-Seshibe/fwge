import Cloneable from '../Interfaces/Cloneable';
import List from '../Utility/List';
import './Math';

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
        return Math.clean(Math.sqrt(this.X ** 2 + this.Y ** 2 + this.Z ** 2))
    }
    //#endregion

    //#region Public Methods
    constructor()
    constructor(x: number, y: number, z: number)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(list: List<number>)
    constructor(x?: number | Float32Array | number[] | List<number>, y?: number, z?: number)
    {
        super(3)

        if (x !== undefined)
        {
            if (typeof x === 'number')
            {
                this.Set(x, y, z)
            }
            else
            {
                this.Set([ ...x ])
            }
        }
    }

    public Set(x: number, y: number, z: number): Vector3
    public Set(array: Float32Array): Vector3
    public Set(array: number[]): Vector3
    public Set(list: List<number>): Vector3
    public Set(x: number | Float32Array | number[] | List<number>, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        this.X = x
        this.Y = y
        this.Z = z
        
        return this
    }

    public Sum(x: number, y: number, z: number): Vector3
    public Sum(array: Float32Array): Vector3
    public Sum(array: number[]): Vector3
    public Sum(list: List<number>): Vector3
    public Sum(x: number | Float32Array | number[] | List<number>, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        this.X += x
        this.Y += y
        this.Z += z
        
        return this
    }
    
    public Diff(x: number, y: number, z: number): Vector3
    public Diff(array: Float32Array): Vector3
    public Diff(array: number[]): Vector3
    public Diff(list: List<number>): Vector3
    public Diff(x: number | Float32Array | number[] | List<number>, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        this.X -= x
        this.Y -= y
        this.Z -= z
        
        return this
    }

    public Mult(x: number, y: number, z: number): Vector3
    public Mult(array: Float32Array): Vector3
    public Mult(array: number[]): Vector3
    public Mult(list: List<number>): Vector3
    public Mult(x: number | Float32Array | number[] | List<number>, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        return this.Set(this.X * x, this.Y * y, this.Z * z)
    }

    public Scale(scalar: number): Vector3
    {
        return this.Mult(scalar, scalar, scalar)
    }

    public Dot(x: number, y: number, z: number): number
    public Dot(array: Float32Array): number
    public Dot(array: number[]): number
    public Dot(list: List<number>): number
    public Dot(x: number | Float32Array | number[] | List<number>, y?: number, z?: number): number
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        return Math.clean(this.X * x + this.Y * y + this.Z * z)
    }
    
    public Lerp(time: number, x: number, y: number, z: number): Vector3
    public Lerp(time: number, array: Float32Array): Vector3
    public Lerp(time: number, array: number[]): Vector3
    public Lerp(time: number, list: List<number>): Vector3
    public Lerp(time: number, x: number | Float32Array | number[] | List<number>, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        return this.Set(
            Math.lerp(this.X, x, time),
            Math.lerp(this.Y, y, time),
            Math.lerp(this.Z, z, time)
        )
    }

    public Cross(x: number, y: number, z: number): Vector3
    public Cross(array: Float32Array): Vector3
    public Cross(array: number[]): Vector3
    public Cross(list: List<number>): Vector3
    public Cross(x: number | Float32Array | number[] | List<number>, y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Vector3.Destructure(x, y, z)

        return this.Set(this.Y * z - this.Z * y, this.Z * x - this.X * z, this.X * y - this.Y * x)
    }

    public Unit(): Vector3
    {
        let length = this.Length

        if (length !== 0)
        {
            this.Scale(1 / length)
        }

        return this
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
    //#endregion

    //#region Static Helpers
    private static Destructure(x: number | Float32Array | number[] | List<number>, y?: number, z?: number): number[]
    {
        if (x instanceof Float32Array || x instanceof Array || x instanceof List)
        {
            [ x, y, z ] = x
        }

        return [ x, y, z ]
    }
    //#endregion
}
