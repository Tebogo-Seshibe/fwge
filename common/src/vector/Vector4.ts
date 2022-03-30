import { clean, lerp } from '../utils/Math'

export class Vector4 extends Float32Array
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

    get Z(): number
    {
        return this[2]
    }

    set Z(z: number)
    {
        this[2] = z
        this._dirty = true
    }

    get W(): number
    {
        return this[3]
    }

    set W(w: number)
    {
        this[3] = w
        this._dirty = true
    }

    private _length: number = 0
    get Length(): number
    {
        if (this._dirty)
        {
            this._length = Math.sqrt(this.X ** 2 + this.Y ** 2 + this.Z ** 2 + this.W ** 2)
        }

        return this._length
    }

    constructor()
    constructor(xyzw: number)
    constructor(x: number, y: number, z: number, w: number)
    constructor(vector: Vector4)
    constructor(array: [number, number, number, number])
    constructor(arrayBuffer: ArrayBuffer)
    constructor(x: ArrayBuffer | Vector4 | number[] | number = 0, y?: number, z?: number, w?: number)
    {
        super(typeof x === 'number' ?
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x,
            w !== undefined ? w : x
        ] : x)
    }

    Set(xyzw: number): Vector4
    Set(x: number, y: number, z: number, w: number): Vector4
    Set(array: Float32Array): Vector4
    Set(array: number[]): Vector4
    Set(x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        x = typeof x === 'number' ?
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x,
            w !== undefined ? w : x
        ] : x

        this[0] = x[0]
        this[1] = x[1]
        this[2] = x[2]
        this[3] = x[3]
        this._dirty = true
        
        return this
    }
    
    Sum(xyzw: number): Vector4
    Sum(x: number, y: number, z: number, w: number): Vector4
    Sum(array: Float32Array): Vector4
    Sum(array: number[]): Vector4
    Sum(x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        x = typeof x === 'number' ?
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x,
            w !== undefined ? w : x
        ] : x

        this[0] += x[0]
        this[1] += x[1]
        this[2] += x[2]
        this[3] += x[3]
        this._dirty = true
        
        return this
    }
    
    Diff(xyzw: number): Vector4
    Diff(x: number, y: number, z: number, w: number): Vector4
    Diff(array: Float32Array): Vector4
    Diff(array: number[]): Vector4
    Diff(x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        x = typeof x === 'number' ?
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x,
            w !== undefined ? w : x
        ] : x

        this[0] -= x[0]
        this[1] -= x[1]
        this[2] -= x[2]
        this[3] -= x[3]
        this._dirty = true
        
        return this
    }

    Scale(scalar: number): Vector4
    {
        this[0] *= scalar
        this[1] *= scalar
        this[2] *= scalar
        this[3] *= scalar
        this._dirty = true
        
        return this
    }
    
    Mult(xyzw: number): Vector4
    Mult(x: number, y: number, z: number, w: number): Vector4
    Mult(array: Float32Array): Vector4
    Mult(array: number[]): Vector4
    Mult(x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        x = typeof x === 'number' ?
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x,
            w !== undefined ? w : x
        ] : x

        this[0] *= x[0]
        this[1] *= x[1]
        this[2] *= x[2]
        this[3] *= x[3]
        this._dirty = true
        
        return this
    }
    
    Dot(xyzw: number): number
    Dot(x: number, y: number, z: number, w: number): number
    Dot(array: Float32Array): number
    Dot(array: number[]): number
    Dot(x: number | Float32Array | number[], y?: number, z?: number, w?: number): number
    {
        x = typeof x === 'number' ?
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x,
            w !== undefined ? w : x
        ] : x

        return this[0] * x[0] + this[1] * x[1] + this[2] * x[2] + this[3] * x[3]
    }
    
    Lerp(time: number, x: number, y: number, z: number, w: number): Vector4
    Lerp(time: number, array: Float32Array): Vector4
    Lerp(time: number, array: number[]): Vector4
    Lerp(time: number, x: number | Float32Array | number[], y?: number, z?: number, w?: number): Vector4
    {
        x = typeof x === 'number' ?
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x,
            w !== undefined ? w : x
        ] : x

        this[0] = lerp(this[0], x[0], time)
        this[1] = lerp(this[1], x[1], time)
        this[2] = lerp(this[2], x[2], time)
        this[3] = lerp(this[3], x[3], time)
        this._dirty = true

        return this
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
        return new Vector4(0)
    }
    
    static get ONE(): Vector4
    {
        return new Vector4(1)
    }
    
    static get UNIT(): Vector4
    {
        return new Vector4(0.5)
    }

    public static readonly SIZE: number = 4
}
