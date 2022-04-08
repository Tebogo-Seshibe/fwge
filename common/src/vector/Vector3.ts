import { lerp } from '../utils/Math'

export class Vector3 extends Float32Array
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

    private _length: number = 0
    get Length(): number
    {
        if (this._dirty)
        {
            this._length = Math.sqrt(this.X ** 2 + this.Y ** 2 + this.Z ** 2)
        }

        return this._length
    }

    constructor()
    constructor(xyz: number)
    constructor(x: number, y: number, z: number)
    constructor(vector: Vector3)
    constructor(array: [number, number, number])
    constructor(arrayBuffer: ArrayBuffer)
    constructor(x: ArrayBuffer | Vector3 | number[] | number = 0, y?: number, z?: number)
    {
        super(typeof x === 'number' ? 
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x
        ] : x)
    }

    Set(xyz: number): Vector3
    Set(x: number, y: number, z: number): Vector3
    Set(vector: Vector3): Vector3
    Set(array: [number, number, number]): Vector3
    Set(x: Vector3 | number[] | number, y?: number, z?: number): Vector3
    {        
        x = typeof x === 'number' ? 
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x
        ] : x

        this[0] = x[0]
        this[1] = x[1]
        this[2] = x[2]
        this._dirty = true
        
        return this
    }

    Sum(xyz: number): Vector3
    Sum(x: number, y: number, z: number): Vector3
    Sum(vector: Vector3): Vector3
    Sum(array: [number, number, number]): Vector3
    Sum(x: Vector3 | number[] | number, y?: number, z?: number): Vector3
    {
        x = typeof x === 'number' ? 
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x
        ] : x

        this[0] += x[0]
        this[1] += x[1]
        this[2] += x[2]
        this._dirty = true
        
        return this
    }

    Diff(xyz: number): Vector3
    Diff(x: number, y: number, z: number): Vector3
    Diff(vector: Vector3): Vector3
    Diff(array: [number, number, number]): Vector3
    Diff(x: Vector3 | number[] | number, y?: number, z?: number): Vector3
    {
        x = typeof x === 'number' ? 
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x
        ] : x

        this[0] -= x[0]
        this[1] -= x[1]
        this[2] -= x[2]
        this._dirty = true
        
        return this
    }

    Mult(xyz: number): Vector3
    Mult(x: number, y: number, z: number): Vector3
    Mult(array: Float32Array): Vector3
    Mult(array: number[]): Vector3
    Mult(x: number | Float32Array | number[], y?: number, z?: number): Vector3
    {
        x = typeof x === 'number' ? 
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x
        ] : x

        this[0] *= x[0]
        this[1] *= x[1]
        this[2] *= x[2]
        this._dirty = true

        return this
    }

    Scale(scalar: number): Vector3
    {
        this[0] *= scalar
        this[1] *= scalar
        this[2] *= scalar
        this._dirty = true

        return this
    }
    
    Lerp(time: number, x: number, y: number, z: number): Vector3
    Lerp(time: number, array: Float32Array): Vector3
    Lerp(time: number, array: number[]): Vector3
    Lerp(time: number, x: number | Float32Array | number[], y?: number, z?: number): Vector3
    {
        x = typeof x === 'number' ?
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x
        ] : x

        this[0] = lerp(this[0], x[0], time)
        this[1] = lerp(this[1], x[1], time)
        this[2] = lerp(this[2], x[2], time)
        this._dirty = true

        return this
    }

    Dot(xyz: number): number
    Dot(x: number, y: number, z: number): number
    Dot(array: Float32Array): number
    Dot(array: number[]): number
    Dot(x: number | Float32Array | number[], y?: number, z?: number): number
    {
        x = typeof x === 'number' ? 
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x
        ] : x

        return this[0] * x[0] + this[1] * x[1] + this[2] * x[2]
    }

    Cross(xyz: number): Vector3
    Cross(x: number, y: number, z: number): Vector3
    Cross(array: Float32Array): Vector3
    Cross(array: number[]): Vector3
    Cross(x: number | Float32Array | number[], y?: number, z?: number): Vector3
    {
        x = typeof x === 'number' ? 
        [
            x,
            y !== undefined ? y : x,
            z !== undefined ? z : x
        ] : x

        const cross0 = this[1] * x[2] - this[2] * x[1]
        const cross1 = this[2] * x[0] - this[0] * x[2]
        const cross2 = this[0] * x[1] - this[1] * x[0]

        this[0] = cross0
        this[0] = cross1
        this[0] = cross2
        this._dirty = true

        return this
    }

    Normalize(): Vector3
    {        
        const length = this.Length

        if (length !== 0)
        {
            this[0] /= length
            this[1] /= length
            this[2] /= length
            this._dirty = true
        }

        return this
    }

    Clone(): Vector3
    {
        return new Vector3(this)
    }

    Equals(other: Vector3): boolean
    {
        return this[0] === other[0] &&
            this[1] === other[1] &&
            this[2] === other[2]
    }

    Distance(other: Vector3): number
    {
        return Vector3.Distance(this, other)
    }

    static Distance(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number,): number
    static Distance(left: Vector3, right: Vector3): number
    static Distance(x1: Vector3 | number, y1: Vector3 | number, z1: number = 0, x2: number = 0, y2: number = 0, z2: number = 0): number
    {
        
        return typeof x1 === 'number'
            ? Math.sqrt(
                (x2 - x1) ** 2 +
                (y2 - (<number>y1)) ** 2 +
                (z2 - z1) ** 2
            )
            : Math.sqrt(
                ((<Vector3>y1)[0] - x1[0]) ** 2 +
                ((<Vector3>y1)[1] - x1[1]) ** 2 +
                ((<Vector3>y1)[2] - x1[2]) ** 2
            )
    }

    static get ZERO(): Vector3
    {
        return new Vector3(0)
    }

    static get ONE(): Vector3
    {
        return new Vector3(1)
    }

    static get UNIT(): Vector3
    {
        return new Vector3(Math.sqrt(1/3))
    }

    public static readonly SIZE: number = 3

    override toString(): string
    {
        return `[ ${(this.X < 0 ? '' : ' ') + this.X.toFixed(3)}  ][ ${(this.Y < 0 ? '' : ' ') + this.Y.toFixed(3)}  ][ ${(this.Z < 0 ? '' : ' ') + this.Z.toFixed(3)}  ]`
    }
}
