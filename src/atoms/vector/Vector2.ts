import { clean, lerp } from '../helpers/Math'

export class Vector2 extends Float32Array
{
    //#region Properties
    get X(): number
    {
        return this[0]
    }

    set X(x: number)
    {
        this[0] = clean(x)
    }

    get Y(): number
    {
        return this[1]
    }

    set Y(y: number)
    {
        this[1] = clean(y)
    }

    get Length(): number
    {
        return clean(Math.sqrt(this.X ** 2 + this.Y ** 2))
    }
    //#endregion

    //#region Methods
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

    Set(x: number, y: number): Vector2
    Set(array: Float32Array): Vector2
    Set(array: number[]): Vector2
    Set(x: number | Float32Array | number[], y?: number): Vector2
    {
        [ x, y ] = Destructure(x, y)

        this.X = x
        this.Y = y
        
        return this
    }

    Sum(x: number, y: number): Vector2
    Sum(array: Float32Array): Vector2
    Sum(array: number[]): Vector2
    Sum(x: number | Float32Array | number[], y?: number): Vector2
    {
        [ x, y ] = Destructure(x, y)

        this.X += x
        this.Y += y
        
        return this
    }

    Diff(x: number, y: number): Vector2
    Diff(array: Float32Array): Vector2
    Diff(array: number[]): Vector2
    Diff(x: number | Float32Array | number[], y?: number): Vector2
    {
        [ x, y ] = Destructure(x, y)

        this.X -= x
        this.Y -= y
        
        return this
    }

    Mult(x: number, y: number): Vector2
    Mult(array: Float32Array): Vector2
    Mult(array: number[]): Vector2
    Mult(x: number | Float32Array | number[], y?: number): Vector2
    {
        [ x, y ] = Destructure(x, y)

        return this.Set(this.X * x, this.Y * y)
    }

    Scale(scalar: number): Vector2
    {
        return this.Mult(scalar, scalar)
    }
    
    Dot(x: number, y: number): number
    Dot(array: Float32Array): number
    Dot(array: number[]): number
    Dot(x: number | Float32Array | number[], y?: number): number
    {
        [ x, y ] = Destructure(x, y)

        return clean(this.X * x + this.Y * y)
    }
    
    Lerp(time: number, x: number, y: number): Vector2
    Lerp(time: number, array: Float32Array): Vector2
    Lerp(time: number, array: number[]): Vector2
    Lerp(time: number, x: number | Float32Array | number[], y?: number): Vector2
    {
        [ x, y ] = Destructure(x, y)

        return this.Set(
            lerp(this.X, x, time),
            lerp(this.Y, y, time)
        )
    }

    Unit(): Vector2
    {
        let length = this.Length

        if (length !== 0)
        {
            this.Scale(1 / length)
        }

        return this
    }
    
    Clone(): Vector2
    {
        return new Vector2(this)
    }
    //#endregion

    //#region Static Properties
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

    static get SIZE(): number
    {
        return 2
    }
    //#endregion
}

function Destructure(x: number | Float32Array | number[], y?: number): number[]
{
    if (x instanceof Float32Array || x instanceof Array)
    {
        [ x, y ] = x
    }

    return [ x, y! ]
}
