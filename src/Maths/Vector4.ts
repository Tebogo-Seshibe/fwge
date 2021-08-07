import Cloneable from '../Interfaces/Cloneable';
import List from '../Utility/List';
import './Math';
import { clean, lerp } from './Math';

export default class Vector4 extends Float32Array implements Cloneable<Vector4>
{
    //#region Public Properties
    public get X(): number
    {
        return this[0]
    }

    public set X(x: number)
    {
        this[0] = clean(x)
    }

    public get Y(): number
    {
        return this[1]
    }

    public set Y(y: number)
    {
        this[1] = clean(y)
    }

    public get Z(): number
    {
        return this[2]
    }

    public set Z(z: number)
    {
        this[2] = clean(z)
    }

    public get W(): number
    {
        return this[3]
    }

    public set W(w: number)
    {
        this[3] = clean(w)
    }

    public get Length(): number
    {
        return clean(Math.sqrt(this.X ** 2 + this.Y ** 2 + this.Z ** 2 + this.W ** 2))
    }
    //#endregion

    //#region Public Methods
    constructor()
    constructor(x: number, y: number, z: number, w: number)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(x?: number | Float32Array | number[], y?: number, z?: number, w?: number)
    {
        super(4)

        if (x !== undefined)
        {
            if (typeof x === 'number')
            {
                this.Set(x, y!, z!, w!)
            }
            else
            {
                this.Set([ ...x ])
            }
        }
    }

    public Set(x: number, y: number, z: number, w: number): Vector4
    public Set(array: Float32Array): Vector4
    public Set(array: number[]): Vector4
    public Set(x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        this.X = x
        this.Y = y
        this.Z = z
        this.W = w
        
        return this
    }
    
    public Sum(x: number, y: number, z: number, w: number): Vector4
    public Sum(array: Float32Array): Vector4
    public Sum(array: number[]): Vector4
    public Sum(x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        this.X += x
        this.Y += y
        this.Z += z
        this.W += w
        
        return this
    }
    
    public Diff(x: number, y: number, z: number, w: number): Vector4
    public Diff(array: Float32Array): Vector4
    public Diff(array: number[]): Vector4
    public Diff(x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        this.X -= x
        this.Y -= y
        this.Z -= z
        this.W -= w
        
        return this
    }

    public Scale(scalar: number): Vector4
    {
        return this.Mult(scalar, scalar, scalar, scalar)
    }
    
    public Mult(x: number, y: number, z: number, w: number): Vector4
    public Mult(array: Float32Array): Vector4
    public Mult(array: number[]): Vector4
    public Mult(x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        return this.Set(this.X * x, this.Y * y, this.Z * z, this.W * w)
    }
    
    public Dot(x: number, y: number, z: number, w: number): number
    public Dot(array: Float32Array): number
    public Dot(array: number[]): number
    public Dot(x: number | Float32Array | number[], y?: number, z?: number, w?: number): number
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        return clean(this.X * x + this.Y * y + this.Z * z + this.W * w)
    }
    
    public Lerp(time: number, x: number, y: number, z: number, w: number): Vector4
    public Lerp(time: number, array: Float32Array): Vector4
    public Lerp(time: number, array: number[]): Vector4
    public Lerp(time: number, x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Vector4.Destructure(x, y, z, w)

        return this.Set(
            lerp(this.X, x, time),
            lerp(this.Y, y, time),
            lerp(this.Z, z, time),
            lerp(this.W, w, time)
        )
    }
    
    public Unit(): Vector4
    {
        let length = this.Length

        if (length !== 0)
        {
            this.Scale(1 / length)
        }

        return this
    }
    
    public Clone(): Vector4
    {
        return new Vector4(this)
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
    private static Destructure(x: number | Float32Array | number[], y?: number, z?: number, w?: number): number[]
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y, z, w ] = x
        }

        return [ x, y!, z!, w! ]
    }
    //#endregion
}
