import { lerp } from '../utils/Math'

export class Vector3 extends Float32Array
{
    get X(): number
    {
        return this[0]
    }

    set X(x: number)
    {
        this[0] = (x)
    }

    get Y(): number
    {
        return this[1]
    }

    set Y(y: number)
    {
        this[1] = (y)
    }

    get Z(): number
    {
        return this[2]
    }

    set Z(z: number)
    {
        this[2] = (z)
    }

    get Length(): number
    {
        return (Math.sqrt(this.X ** 2 + this.Y ** 2 + this.Z ** 2))
    }

    constructor()
    constructor(xyz: number)
    constructor(x: number, y: number, z: number)
    constructor(array: Float32Array)
    constructor(array: Float64Array)
    constructor(array: number[])
    constructor(x?: number | Float64Array | Float32Array | number[], y?: number, z?: number)
    {
        super(3)

        if (x !== undefined)
        {
            if (typeof x === 'number')
            {
                if (arguments.length === 1)
                {
                    y = x
                    z = x
                }
                this.Set(x, y!, z!)
            }
            else
            {
                this.Set([ ...x ])
            }
        }
    }

    Set(x: number, y: number, z: number): Vector3
    Set(array: Float32Array): Vector3
    Set(array: number[]): Vector3
    Set(x: number | Float32Array | number[], y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Destructure(x, y, z)

        this.X = x
        this.Y = y
        this.Z = z
        
        return this
    }

    Sum(x: number, y: number, z: number): Vector3
    Sum(array: Float32Array): Vector3
    Sum(array: number[]): Vector3
    Sum(x: number | Float32Array | number[], y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Destructure(x, y, z)

        this.X += x
        this.Y += y
        this.Z += z
        
        return this
    }
    
    Diff(x: number, y: number, z: number): Vector3
    Diff(array: Float32Array): Vector3
    Diff(array: number[]): Vector3
    Diff(x: number | Float32Array | number[], y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Destructure(x, y, z)

        this.X -= x
        this.Y -= y
        this.Z -= z
        
        return this
    }

    Mult(x: number, y: number, z: number): Vector3
    Mult(array: Float32Array): Vector3
    Mult(array: number[]): Vector3
    Mult(x: number | Float32Array | number[], y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Destructure(x, y, z)

        return this.Set(this.X * x, this.Y * y, this.Z * z)
    }

    Scale(scalar: number): Vector3
    {
        return this.Mult(scalar, scalar, scalar)
    }

    Dot(x: number, y: number, z: number): number
    Dot(array: Float32Array): number
    Dot(array: number[]): number
    Dot(x: number | Float32Array | number[], y?: number, z?: number): number
    {
        [ x, y, z ] = Destructure(x, y, z)

        return (this.X * x + this.Y * y + this.Z * z)
    }

    Cross(x: number, y: number, z: number): Vector3
    Cross(array: Float32Array): Vector3
    Cross(array: number[]): Vector3
    Cross(x: number | Float32Array | number[], y?: number, z?: number): Vector3
    {
        [ x, y, z ] = Destructure(x, y, z)

        return this.Set(this.Y * z - this.Z * y, this.Z * x - this.X * z, this.X * y - this.Y * x)
    }

    Normalize(): Vector3
    {
        let length = this.Length

        if (length !== 0)
        {
            this.Scale(1 / length)
        }

        return this
    }

    Clone(): Vector3
    {
        return new Vector3(this)
    }

    static get ZERO(): Vector3
    {
        return new Vector3(0, 0, 0)
    }

    static get ONE(): Vector3
    {
        return new Vector3(1, 1, 1)
    }

    static get UNIT(): Vector3
    {
        return new Vector3(Math.sqrt(1/3), Math.sqrt(1/3), Math.sqrt(1/3))
    }

    static get SIZE(): number
    {
        return 3
    }

    override toString(): string
    {
        return `[ ${(this.X < 0 ? '' : ' ') + this.X.toFixed(3)}  ][ ${(this.Y < 0 ? '' : ' ') + this.Y.toFixed(3)}  ][ ${(this.Z < 0 ? '' : ' ') + this.Z.toFixed(3)}  ]`
    }

    static Lerp(time: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): Vector3
    static Lerp(time: number, array1: Float32Array, array2: Float32Array): Vector3
    static Lerp(time: number, array1: number[], array2: number[]): Vector3
    static Lerp(time: number, x1: number | Float32Array | number[], y1: number | Float32Array | number[], z1?: number, x2?: number, y2?: number, z2?: number): Vector3
    {
        let [vector1, vector2] = [new Vector3(), new Vector3()]

        if ((x1 instanceof Float32Array && y1 instanceof Float32Array) 
        || (x1 instanceof Array && y1 instanceof Array))
        {
            vector1.Set([...x1])
            vector2.Set([...y1])
        }
        else if (typeof x1 === 'number' && typeof y1 === 'number')
        {
            vector1.Set(x1, y1, z1!)
            vector2.Set(x2!, y2!, z2!)
        }
        
        return new Vector3(
            lerp(vector1.X, vector2.X, time),
            lerp(vector1.Y, vector2.Y, time),
            lerp(vector1.Z, vector2.Z, time)
        )
    }
}

function Destructure(x: number | Float32Array | number[], y?: number, z?: number): number[]
{
    if (x instanceof Float32Array || x instanceof Array)
    {
        [ x, y, z ] = x
    }

    return [ x, y!, z! ]
}
