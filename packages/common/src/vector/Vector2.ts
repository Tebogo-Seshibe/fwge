import { root_2 } from "../constants"
import { FixedLengthArray, NumberArray } from "../types"
import { radian } from "../utils"

export type Vector2Array = FixedLengthArray<number, 2>

export class Vector2 extends Float32Array
{
    //#region Local Properties
    get X(): number
    {
        return this[0]
    }

    set X(x: number)
    {
        this[0] = x
    }

    get Y(): number
    {
        return this[1]
    }

    set Y(y: number)
    {
        this[1] = y
    }

    get Length(): number
    {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1])
    }

    get LengthSquared(): number
    {
        return this[0] * this[0] + this[1] * this[1]
    }
    //#endregion

    constructor()
    constructor(xy: number)
    constructor(x: number, y: number)
    constructor(vector: Vector2)
    constructor(array: NumberArray)
    constructor(_0: Vector2 | NumberArray | number = 0, _1?: number)
    {
        super(typeof _0 === 'number' ? 
        [
            _0,
            _1 ?? _0
        ] : _0)
    }

    //#region Local Methods
    Set(xy: number): Vector2
    Set(x: number, y: number): Vector2
    Set(vector: Vector2): Vector2
    Set(array: NumberArray): Vector2
    Set(_0: Vector2 | NumberArray | number, _1?: number): Vector2
    {
        if (typeof _0 === 'number')
        {
            this[0] = _0
            this[1] = _1 ?? _0
        }
        else
        {            
            this[0] = _0[0]
            this[1] = _0[1]
        }
        
        return this
    }

    Negate(): Vector2
    {
        this[0] = -this[0]
        this[1] = -this[1]

        return this
    }
    
    Add(xy: number): Vector2
    Add(x: number, y: number): Vector2
    Add(vector: Vector2): Vector2
    Add(array: NumberArray): Vector2
    Add(_0: Vector2 | NumberArray | number, _1?: number): Vector2
    {
        if (typeof _0 === 'number')
        {
            this[0] += _0
            this[1] += _1 ?? _0
        }
        else
        {
            this[0] += _0[0]
            this[1] += _0[1]
        }
        
        return this
    }

    Subtract(xy: number): Vector2
    Subtract(x: number, y: number): Vector2
    Subtract(vector: Vector2): Vector2
    Subtract(array: NumberArray): Vector2
    Subtract(_0: Vector2 | NumberArray | number, _1?: number): Vector2
    {
        if (typeof _0 === 'number')
        {
            this[0] -= _0
            this[1] -= _1 ?? _0
        }
        else
        {
            this[0] -= _0[0]
            this[1] -= _0[1]
        }
        
        return this
    }

    Multiply(xy: number): Vector2
    Multiply(x: number, y: number): Vector2
    Multiply(vector: Vector2): Vector2
    Multiply(array: NumberArray): Vector2
    Multiply(_0: Vector2 | NumberArray | number, _1?: number): Vector2
    {
        if (typeof _0 === 'number')
        {
            this[0] *= _0
            this[1] *= _1 ?? _0
        }
        else
        {
            this[0] *= _0[0]
            this[1] *= _0[1]
        }
        
        return this
    }

    Divide(xy: number): Vector2
    Divide(x: number, y: number): Vector2
    Divide(vector: Vector2): Vector2
    Divide(array: NumberArray): Vector2
    Divide(_0: Vector2 | NumberArray | number, _1?: number): Vector2
    {
        if (typeof _0 === 'number')
        {
            this[0] /= _0
            this[1] /= _1 ?? _0
        }
        else
        {
            this[0] /= _0[0]
            this[1] /= _0[1]
        }
        
        return this
    }

    Scale(scalar: number): Vector2
    {
        this[0] *= scalar
        this[1] *= scalar
        
        return this
    }
    
    Dot(xy: number): number
    Dot(x: number, y: number): number
    Dot(vector: Vector2): number
    Dot(array: NumberArray): number
    Dot(_0: Vector2 | NumberArray | number, _1?: number): number
    {
        if (typeof _0 === 'number')
        {
            return this[0] * _0 + this[1] * (_1 ?? _0)
        }
        else
        {
            return this[0] * _0[0] + this[1] * _0[1]
        }
    }

    Rotate(degrees: number): Vector2
    {
        const theta = radian(degrees)
        const cosTheta = Math.cos(theta)
        const sinTheta = Math.sin(theta)

        return this.Set(
            (cosTheta * this[0]) - (sinTheta * this[1]),
            (sinTheta * this[0]) + (cosTheta * this[1])
        )
    }
    
    Distance(xy: number): number
    Distance(x: number, y: number): number
    Distance(vector: Vector2): number
    Distance(array: NumberArray): number
    Distance(_0: Vector2 | NumberArray | number, _1?: number): number
    {
        let x: number
        let y: number

        if (typeof _0 === 'number')
        {
            x = this[0] - _0,
            y = this[1] - (_1 ?? _0)
        }
        else
        {
            x = this[0] - _0[0]
            y = this[1] - _0[1]
        }

        return Math.sqrt(x * x + y * y)
    }

    Normalize(): Vector2
    {
        let length = this.LengthSquared

        if (length !== 0 && length !== 1)
        {
            length = Math.sqrt(length)
            this[0] /= length
            this[1] /= length
        }

        return this
    }
    
    Clone(): Vector2
    {
        return new Vector2(this)
    }

    Equals(other: Vector2)
    {
        return this[0] === other[0] && 
            this[1] === other[1]
    }
    //#endregion

    //#region Static Properties
    static get Zero(): Vector2
    {
        return new Vector2(0)
    }

    static get One(): Vector2
    {
        return new Vector2(1)
    }

    static get Unit(): Vector2
    {
        return new Vector2(root_2)
    }

    static get UnitX(): Vector2
    {
        return new Vector2(1, 0)
    }

    static get UnitY(): Vector2
    {
        return new Vector2(0, 1)
    }

    public static readonly SIZE: number = 2
    //#endregion
    
    //#region Static Methods
    static Negate(vector: Vector2): Vector2
    static Negate(vector: Vector2, outVector: Vector2): Vector2
    static Negate(_0: Vector2, _1?: Vector2): Vector2
    {
        const out = _1 ?? new Vector2()

        out[0] = -_0[0]
        out[1] = -_0[1]

        return out
    }

    static Add(x1: number, y1: number, x2: number, y2: number): Vector2
    static Add(x1: number, y1: number, x2: number, y2: number, out: Vector2): Vector2
    static Add(vector1: Vector2, vector2: Vector2): Vector2
    static Add(vector1: Vector2, vector2: Vector2, out: Vector2): Vector2
    static Add(array1: NumberArray, array2: NumberArray): Vector2
    static Add(array1: NumberArray, array2: NumberArray, out: Vector2): Vector2
    static Add(_0: Vector2 | NumberArray | number, _1: Vector2 | NumberArray | number, _2?: number | Vector2, _3?: number, _4?: Vector2): Vector2
    {
        const out: Vector2 = _4 ?? _2 instanceof Vector2 ? _2 as Vector2 : new Vector2()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) + (_2 as number)
            out[1] = (_1 as number) + (_3 as number)
        }
        else
        {
            out[0] = _0[0] + _1[0]
            out[1] = _0[1] + _1[1]
        }

        return out
    }

    static Subtract(x1: number, y1: number, x2: number, y2: number): Vector2
    static Subtract(x1: number, y1: number, x2: number, y2: number, out: Vector2): Vector2
    static Subtract(vector1: Vector2, vector2: Vector2): Vector2
    static Subtract(vector1: Vector2, vector2: Vector2, out: Vector2): Vector2
    static Subtract(array1: NumberArray, array2: NumberArray): Vector2
    static Subtract(array1: NumberArray, array2: NumberArray, out: Vector2): Vector2
    static Subtract(_0: Vector2 | NumberArray | number, _1: Vector2 | NumberArray | number, _2?: number | Vector2, _3?: Vector2 | number, _4?: Vector2): Vector2
    {
        const out: Vector2 = _4 ?? _2 instanceof Vector2 ? _2 as Vector2 : new Vector2()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) - (_2 as number)
            out[1] = (_1 as number) - (_3 as number)
        }
        else
        {
            out[0] = _0[0] - _1[0]
            out[1] = _0[1] - _1[1]
        }

        return out
    }

    static Multiply(x1: number, y1: number, x2: number, y2: number): Vector2
    static Multiply(x1: number, y1: number, x2: number, y2: number, out: Vector2): Vector2
    static Multiply(vector1: Vector2, vector2: Vector2): Vector2
    static Multiply(vector1: Vector2, vector2: Vector2, out: Vector2): Vector2
    static Multiply(array1: NumberArray, array2: NumberArray): Vector2
    static Multiply(array1: NumberArray, array2: NumberArray, out: Vector2): Vector2
    static Multiply(_0: Vector2 | NumberArray | number, _1: Vector2 | NumberArray | number, _2?: number | Vector2, _3?: Vector2 | number, _4?: Vector2): Vector2
    {
        const out: Vector2 = _4 ?? _2 instanceof Vector2 ? _2 as Vector2 : new Vector2()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) * (_2 as number)
            out[1] = (_1 as number) * (_3 as number)
        }
        else
        {
            out[0] = _0[0] * _1[0]
            out[1] = _0[1] * _1[1]
        }

        return out
    }

    static Divide(x1: number, y1: number, x2: number, y2: number): Vector2
    static Divide(x1: number, y1: number, x2: number, y2: number, out: Vector2): Vector2
    static Divide(vector1: Vector2, vector2: Vector2): Vector2
    static Divide(vector1: Vector2, vector2: Vector2, out: Vector2): Vector2
    static Divide(array1: NumberArray, array2: NumberArray): Vector2
    static Divide(array1: NumberArray, array2: NumberArray, out: Vector2): Vector2
    static Divide(_0: Vector2 | NumberArray | number, _1: Vector2 | NumberArray | number, _2?: number | Vector2, _3?: Vector2 | number, _4?: Vector2): Vector2
    {
        const out: Vector2 = _4 ?? _2 instanceof Vector2 ? _2 as Vector2 : new Vector2()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) / (_2 as number)
            out[1] = (_1 as number) / (_3 as number)
        }
        else
        {
            out[0] = _0[0] / _1[0]
            out[1] = _0[1] / _1[1]
        }

        return out
    }

    static Scale(vector: Vector2, scalar: number): Vector2
    static Scale(vector: Vector2, scalar: number, out: Vector2): Vector2
    static Scale(_0: Vector2, _1: number, _2?: Vector2): Vector2
    {
        const out: Vector2 = _2 ?? new Vector2()

        out[0] = _0[0] * _1
        out[1] = _0[1] * _1
        
        return out
    }

    static Dot(x1: number, y1: number, x2: number, y2: number): number
    static Dot(vector1: Vector2, vector2: Vector2): number
    static Dot(array1: NumberArray, array2: NumberArray): number
    static Dot(_0: Vector2 | NumberArray | number, _1: Vector2 | NumberArray | number, _2?: number | Vector2, _3?: Vector2 | number): number
    {
        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            return (
                (_0 as number) * (_2 as number) +
                (_1 as number) * (_3 as number)
            ) 
        }
        else
        {
            return (
                _0[0] * _1[0] + 
                _0[1] * _1[1]
            )
        }
    }
    
    static Rotate(vector: Vector2, degrees: number): Vector2
    static Rotate(vector: Vector2, degrees: number, out: Vector2): Vector2
    static Rotate(_0: Vector2, _1: number, _2?: Vector2): Vector2
    {
        const out: Vector2 = _2 ?? new Vector2()
        const theta = radian(_1)

        const cosTheta = Math.cos(theta)
        const sinTheta = Math.sin(theta)

        return out.Set(
            (cosTheta * _0[0]) - (sinTheta * _0[1]),
            (sinTheta * _0[0]) + (cosTheta * _0[1])
        )
    }    

    static Distance(vector1: Vector2, vector2: Vector2): number
    static Distance(array1: Vector2Array, array2: Vector2Array): number
    static Distance(x1: number, y1: number, x2: number, y2: number): number
    static Distance(_0: Vector2 | Vector2Array | number, _1: Vector2 | Vector2Array | number, _2?: number, _3?: number): number
    {
        let x: number
        let y: number

        if (typeof _0 === 'number')
        {
            x = (_0 as number) - (_1 as number)
            y = (_2 as number) - (_3 as number)
        }
        else
        {
            _1 = _1 as Vector2

            x = _0[0] - _1[0]
            y = _0[1] - _1[1]
        }
        
        return Math.sqrt(x * x + y * y)
    }

    static Normalize(vector: Vector2): Vector2
    static Normalize(vector: Vector2, out: Vector2): Vector2
    static Normalize(_0: Vector2, _1?: Vector2): Vector2
    {
        const out: Vector2 = _1 ?? new Vector2()
        
        let length = _0.LengthSquared

        if (length !== 0 && length !== 1)
        {
            length = Math.sqrt(length)
            out[0] /= length
            out[1] /= length
        }

        return out
    }
    //#endregion
}
