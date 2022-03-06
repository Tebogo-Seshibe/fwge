import { clean, lerp } from '../utils/Math'

export class Vector2 extends Float32Array
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

    get Length(): number
    {
        return clean(Math.sqrt(this.X ** 2 + this.Y ** 2))
    }

    constructor()
    constructor(x: number, y: number)
    constructor(array: Vector2)
    constructor(array: [number, number])
    constructor(x: Vector2 | [number, number] | number = 0, y: number = 0)
    {
        super(typeof x === 'number' ? [x, y] : x)
    }

    Set(x: number, y: number): Vector2
    Set(array: Vector2): Vector2
    Set(array: [number, number]): Vector2
    Set(x: Vector2 | [number, number] | number = 0, y: number = 0): Vector2
    {
        x = typeof x === 'number' ? [x, y] : x

        this[0] = x[0]
        this[1] = x[1]
        
        return this
    }

    Sum(x: number, y: number): Vector2
    Sum(array: Vector2): Vector2
    Sum(array: [number, number]): Vector2
    Sum(x: Vector2 | [number, number] | number = 0, y: number = 0): Vector2
    {
        x = typeof x === 'number' ? [x, y] : x

        this[0] += x[0]
        this[1] += x[1]
        
        return this
    }

    Diff(x: number, y: number): Vector2
    Diff(array: Vector2): Vector2
    Diff(array: [number, number]): Vector2
    Diff(x: Vector2 | [number, number] | number = 0, y: number = 0): Vector2
    {
        x = typeof x === 'number' ? [x, y] : x

        this[0] -= x[0]
        this[1] -= x[1]
        
        return this
    }

    Mult(x: number, y: number): Vector2
    Mult(array: Vector2): Vector2
    Mult(array: [number, number]): Vector2
    Mult(x: Vector2 | [number, number] | number = 0, y: number = 0): Vector2
    {
        x = typeof x === 'number' ? [x, y] : x

        return this.Set(this[0] * x[0], this[0] * x[1])
    }

    Scale(scalar: number): Vector2
    {
        return this.Mult(scalar, scalar)
    }
    
    Dot(x: number, y: number): number
    Dot(array: Vector2): number
    Dot(array: [number, number]): number
    Dot(x: Vector2 | [number, number] | number = 0, y: number = 0): number
    {
        x = typeof x === 'number' ? [x, y] : x

        return clean(this[0] * x[0] + this[1] * x[1])
    }
    
    Lerp(time: number, x: number, y: number): Vector2
    Lerp(time: number, array: Vector2): Vector2
    Lerp(time: number, array: [number, number]): Vector2
    Lerp(time: number, x: Vector2 | [number, number] | number = 0, y: number = 0): Vector2
    {
        x = typeof x === 'number' ? [x, y] : x

        return this.Set(
            lerp(this[0], x[0], time),
            lerp(this[1], x[1], time)
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
}

function Destructure(x: number | Float32Array | number[], y?: number): number[]
{
    if (x instanceof Float32Array || x instanceof Array)
    {
        [ x, y ] = x
    }

    return [ x, y! ]
}
