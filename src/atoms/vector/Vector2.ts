import { clean, lerp } from '../helpers/Math'

export class Vector2 extends Float32Array
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

    public get Length(): number
    {
        return clean(Math.sqrt(this.X ** 2 + this.Y ** 2))
    }
    //#endregion

    //#region Public Methods
    constructor()
    constructor(x: number, y: number)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(x?: number | Float32Array | number[], y?: number)
    {
        super(2)

        if (x !== undefined)
        {
            if (typeof x === 'number')
            {
                this.Set(x, y!)                    
            }
            else
            {
                this.Set([ ...x ])
            }
        }
    }

    public Set(x: number, y: number): Vector2
    public Set(array: Float32Array): Vector2
    public Set(array: number[]): Vector2
    public Set(x: number | Float32Array | number[], y?: number): Vector2
    {
        [ x, y ] = Vector2.Destructure(x, y)

        this.X = x
        this.Y = y
        
        return this
    }

    public Sum(x: number, y: number): Vector2
    public Sum(array: Float32Array): Vector2
    public Sum(array: number[]): Vector2
    public Sum(x: number | Float32Array | number[], y?: number): Vector2
    {
        [ x, y ] = Vector2.Destructure(x, y)

        this.X += x
        this.Y += y
        
        return this
    }

    public Diff(x: number, y: number): Vector2
    public Diff(array: Float32Array): Vector2
    public Diff(array: number[]): Vector2
    public Diff(x: number | Float32Array | number[], y?: number): Vector2
    {
        [ x, y ] = Vector2.Destructure(x, y)

        this.X -= x
        this.Y -= y
        
        return this
    }

    public Mult(x: number, y: number): Vector2
    public Mult(array: Float32Array): Vector2
    public Mult(array: number[]): Vector2
    public Mult(x: number | Float32Array | number[], y?: number): Vector2
    {
        [ x, y ] = Vector2.Destructure(x, y)

        return this.Set(this.X * x, this.Y * y)
    }

    public Scale(scalar: number): Vector2
    {
        return this.Mult(scalar, scalar)
    }
    
    public Dot(x: number, y: number): number
    public Dot(array: Float32Array): number
    public Dot(array: number[]): number
    public Dot(x: number | Float32Array | number[], y?: number): number
    {
        [ x, y ] = Vector2.Destructure(x, y)

        return clean(this.X * x + this.Y * y)
    }
    
    public Lerp(time: number, x: number, y: number): Vector2
    public Lerp(time: number, array: Float32Array): Vector2
    public Lerp(time: number, array: number[]): Vector2
    public Lerp(time: number, x: number | Float32Array | number[], y?: number): Vector2
    {
        [ x, y ] = Vector2.Destructure(x, y)

        return this.Set(
            lerp(this.X, x, time),
            lerp(this.Y, y, time)
        )
    }

    public Unit(): Vector2
    {
        let length = this.Length

        if (length !== 0)
        {
            this.Scale(1 / length)
        }

        return this
    }
    
    public Clone(): Vector2
    {
        return new Vector2(this)
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

    public static get SIZE(): number
    {
        return 2
    }
    //#endregion

    //#region Static Helpers
    private static Destructure(x: number | Float32Array | number[], y?: number): number[]
    {
        if (x instanceof Float32Array || x instanceof Array)
        {
            [ x, y ] = x
        }

        return [ x, y! ]
    }
    //#endregion
}
