import { clean, lerp } from '../helpers/Math'

export class Vector4 extends Float32Array
{
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

    get Z(): number
    {
        return this[2]
    }

    set Z(z: number)
    {
        this[2] = clean(z)
    }

    get W(): number
    {
        return this[3]
    }

    set W(w: number)
    {
        this[3] = clean(w)
    }

    get Length(): number
    {
        return clean(Math.sqrt(this.X ** 2 + this.Y ** 2 + this.Z ** 2 + this.W ** 2))
    }

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

    Set(x: number, y: number, z: number, w: number): Vector4
    Set(array: Float32Array): Vector4
    Set(array: number[]): Vector4
    Set(x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Destructure(x, y, z, w)

        this.X = x
        this.Y = y
        this.Z = z
        this.W = w
        
        return this
    }
    
    Sum(x: number, y: number, z: number, w: number): Vector4
    Sum(array: Float32Array): Vector4
    Sum(array: number[]): Vector4
    Sum(x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Destructure(x, y, z, w)

        this.X += x
        this.Y += y
        this.Z += z
        this.W += w
        
        return this
    }
    
    Diff(x: number, y: number, z: number, w: number): Vector4
    Diff(array: Float32Array): Vector4
    Diff(array: number[]): Vector4
    Diff(x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Destructure(x, y, z, w)

        this.X -= x
        this.Y -= y
        this.Z -= z
        this.W -= w
        
        return this
    }

    Scale(scalar: number): Vector4
    {
        return this.Mult(scalar, scalar, scalar, scalar)
    }
    
    Mult(x: number, y: number, z: number, w: number): Vector4
    Mult(array: Float32Array): Vector4
    Mult(array: number[]): Vector4
    Mult(x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Destructure(x, y, z, w)

        return this.Set(this.X * x, this.Y * y, this.Z * z, this.W * w)
    }
    
    Dot(x: number, y: number, z: number, w: number): number
    Dot(array: Float32Array): number
    Dot(array: number[]): number
    Dot(x: number | Float32Array | number[], y?: number, z?: number, w?: number): number
    {
        [ x, y, z, w ] = Destructure(x, y, z, w)

        return clean(this.X * x + this.Y * y + this.Z * z + this.W * w)
    }
    
    Lerp(time: number, x: number, y: number, z: number, w: number): Vector4
    Lerp(time: number, array: Float32Array): Vector4
    Lerp(time: number, array: number[]): Vector4
    Lerp(time: number, x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        [ x, y, z, w ] = Destructure(x, y, z, w)

        return this.Set(
            lerp(this.X, x, time),
            lerp(this.Y, y, time),
            lerp(this.Z, z, time),
            lerp(this.W, w, time)
        )
    }
    
    Unit(): Vector4
    {
        let length = this.Length

        if (length !== 0)
        {
            this.Scale(1 / length)
        }

        return this
    }
    
    Clone(): Vector4
    {
        return new Vector4(this)
    }

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
        return new Vector4(0.5, 0.5, 0.5, 0.5)
    }

    static get SIZE(): number
    {
        return 4
    }
}

function Destructure(x: number | Float32Array | number[], y?: number, z?: number, w?: number): number[]
{
    if (x instanceof Float32Array || x instanceof Array)
    {
        [ x, y, z, w ] = x
    }

    return [ x, y!, z!, w! ]
}
