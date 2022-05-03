import { clean, lerp } from '../utils/Math'

export class Vector2 extends Float32Array
{
    private _dirty: boolean = true
    get Dirty(): boolean
    {
        return this._dirty
    }
    
    set Dirty(dirty: boolean)
    {
        this._dirty = dirty
    }

    get X(): number
    {
        return this[0]
    }

    set X(x: number)
    {
        this[0] = x
        this._dirty = true
    }

    get Y(): number
    {
        return this[1]
    }

    set Y(y: number)
    {
        this[1] = y
        this._dirty = true
    }
    
    private _length: number = 0
    get Length(): number
    {
        if (this._dirty)
        {
            this._length = Math.sqrt(this.X ** 2 + this.Y ** 2)
        }

        return this._length
    }

    constructor()
    constructor(xy: number)
    constructor(x: number, y: number)
    constructor(array: Vector2)
    constructor(array: [number, number])
    constructor(arrayBuffer: ArrayBuffer)
    constructor(x: ArrayBuffer | Vector2 | [number, number] | number = 0, y?: number)
    {
        super(typeof x === 'number' ? 
        [
            x,
            y !== undefined ? y : x
        ] : x)
    }

    Set(xy: number): Vector2
    Set(x: number, y: number): Vector2
    Set(array: Vector2): Vector2
    Set(array: [number, number]): Vector2
    Set(x: Vector2 | [number, number] | number, y?: number): Vector2
    {
        x = typeof x === 'number' ?
        [
            x,
            y !== undefined ? y : x
        ] : x

        this[0] = x[0]
        this[1] = x[1]
        this._dirty = true
        
        return this
    }

    Sum(xy: number): Vector2
    Sum(x: number, y: number): Vector2
    Sum(array: Vector2): Vector2
    Sum(array: [number, number]): Vector2
    Sum(x: Vector2 | [number, number] | number, y?: number): Vector2
    {
        x = typeof x === 'number' ?
        [
            x,
            y !== undefined ? y : x
        ] : x

        this[0] += x[0]
        this[1] += x[1]
        this._dirty = true
        
        return this
    }

    Diff(xy: number): Vector2
    Diff(x: number, y: number): Vector2
    Diff(array: Vector2): Vector2
    Diff(array: [number, number]): Vector2
    Diff(x: Vector2 | [number, number] | number, y?: number): Vector2
    {
        x = typeof x === 'number' ?
        [
            x,
            y !== undefined ? y : x
        ] : x

        this[0] -= x[0]
        this[1] -= x[1]
        this._dirty = true
        
        return this
    }

    Mult(xy: number): Vector2
    Mult(x: number, y: number): Vector2
    Mult(array: Vector2): Vector2
    Mult(array: [number, number]): Vector2
    Mult(x: Vector2 | [number, number] | number, y?: number): Vector2
    {
        x = typeof x === 'number' ?
        [
            x,
            y !== undefined ? y : x
        ] : x

        this[0] *= x[0]
        this[1] *= x[1]
        this._dirty = true

        return this
    }

    Scale(scalar: number): Vector2
    {
        return this.Mult(scalar, scalar)
    }
    
    Dot(xy: number): number
    Dot(x: number, y: number): number
    Dot(array: Vector2): number
    Dot(array: [number, number]): number
    Dot(x: Vector2 | [number, number] | number, y?: number): number
    {
        x = typeof x === 'number' ?
        [
            x,
            y !== undefined ? y : x
        ] : x

        return this[0] * x[0] + this[1] * x[1]
    }
    
    Lerp(time: number, x: number, y: number): Vector2
    Lerp(time: number, array: Vector2): Vector2
    Lerp(time: number, array: [number, number]): Vector2
    Lerp(time: number, x: Vector2 | [number, number] | number, y?: number): Vector2
    {
        x = typeof x === 'number' ?
        [
            x,
            y !== undefined ? y : x
        ] : x

        this[0] = lerp(this[0], x[0], time)
        this[1] = lerp(this[1], x[1], time)
        this._dirty = true

        return this
    }

    Unit(): Vector2
    {
        const length = this.Length

        if (length !== 0)
        {
            this[0] /= length
            this[1] /= length
            this._dirty = true
        }

        return this
    }
    
    Clone(): Vector2
    {
        return new Vector2(this)
    }

    static get ZERO(): Vector2
    {
        return new Vector2(0)
    }

    static get ONE(): Vector2
    {
        return new Vector2(1)
    }

    static get UNIT(): Vector2
    {
        return new Vector2(Math.sqrt(1/2))
    }

    public static readonly SIZE: number = 2
}
