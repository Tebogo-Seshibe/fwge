import { FixedLengthArray, NumberArray } from "../types"
import { IEquatable } from "../utils/interfaces/IEquatable"
import { Vector3 } from "./Vector3"

export type Vector4Array = FixedLengthArray<number, 4>

export class Vector4 extends Float32Array implements IEquatable<Vector4>
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

    get Z(): number
    {
        return this[2]
    }

    set Z(z: number)
    {
        this[2] = z
    }

    get W(): number
    {
        return this[3]
    }

    set W(w: number)
    {
        this[3] = w
    }

    get Length(): number
    {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3])
    }

    get LengthSquared(): number
    {
        return this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3]
    }

    public get XYZ(): Vector3
    {
        return new Vector3(this[0], this[1], this[2])
    }
    //#endregion

    constructor()
    constructor(xyzw: number)
    constructor(x: number, y: number, z: number, w: number)
    constructor(vector: Vector4)
    constructor(xyz: Vector3, w: number)
    constructor(array: NumberArray)
    constructor(_0: Vector4 | Vector4 | NumberArray | number = 0, _1?: number, _2?: number, _3?: number)
    {
        super(typeof _0 === 'number' ?
        [
            _0,
            _1 ?? _0,
            _2 ?? _0,
            _3 ?? _0
        ] : [_0[0], _0[1], _0[2], _0[0] ?? _1])
    }

    //#region Local Methods
    Set(xyzw: number): Vector4
    Set(x: number, y: number, z: number, w: number): Vector4
    Set(vector: Vector4): Vector4
    Set(xyz: Vector3, w: number): Vector4
    Set(array: NumberArray): Vector4
    Set(_0: Vector4 | Vector4 | NumberArray | number, _1?: number, _2?: number, _3?: number): Vector4
    {
        if (typeof _0 === 'number')
        {
            this[0] = _0
            this[1] = _1 ?? _0
            this[2] = _2 ?? _0
            this[3] = _3 ?? _0
        }
        else
        {            
            this[0] = _0[0]
            this[1] = _0[1]
            this[2] = _0[2]
            this[3] = _0[3] ?? _1
        }
        
        return this
    }

    Negate(): Vector4
    {
        this[0] = -this[0]
        this[1] = -this[1]
        this[2] = -this[2]
        this[3] = -this[3]
        
        return this
    }

    Add(xyzw: number): Vector4
    Add(x: number, y: number, z: number, w: number): Vector4
    Add(vector: Vector4): Vector4
    Add(array: NumberArray): Vector4
    Add(_0: Vector4 | NumberArray | number, _1?: number, _2?: number, _3?: number): Vector4
    {
        if (typeof _0 === 'number')
        {
            this[0] += _0
            this[1] += _1 ?? _0
            this[2] += _2 ?? _0
            this[3] += _3 ?? _0
        }
        else
        {            
            this[0] += _0[0]
            this[1] += _0[1]
            this[2] += _0[2]
            this[3] += _0[3]
        }
        
        return this
    }
    
    Subtract(xyzw: number): Vector4
    Subtract(x: number, y: number, z: number, w: number): Vector4
    Subtract(vector: Vector4): Vector4
    Subtract(array: NumberArray): Vector4
    Subtract(_0: Vector4 | NumberArray | number, _1?: number, _2?: number, _3?: number): Vector4
    {
        if (typeof _0 === 'number')
        {
            this[0] -= _0
            this[1] -= _1 ?? _0
            this[2] -= _2 ?? _0
            this[3] -= _3 ?? _0
        }
        else
        {            
            this[0] -= _0[0]
            this[1] -= _0[1]
            this[2] -= _0[2]
            this[3] -= _0[3]
        }
        
        return this
    }
    
    
    Multiply(xyzw: number): Vector4
    Multiply(x: number, y: number, z: number, w: number): Vector4
    Multiply(vector: Vector4): Vector4
    Multiply(array: NumberArray): Vector4
    Multiply(_0: Vector4 | NumberArray | number, _1?: number, _2?: number, _3?: number): Vector4
    {
        if (typeof _0 === 'number')
        {
            this[0] *= _0
            this[1] *= _1 ?? _0
            this[2] *= _2 ?? _0
            this[3] *= _3 ?? _0
        }
        else
        {            
            this[0] *= _0[0]
            this[1] *= _0[1]
            this[2] *= _0[2]
            this[3] *= _0[3]
        }
        
        return this
    }
    
    Divide(xyzw: number): Vector4
    Divide(x: number, y: number, z: number, w: number): Vector4
    Divide(vector: Vector4): Vector4
    Divide(array: NumberArray): Vector4
    Divide(_0: Vector4 | NumberArray | number, _1?: number, _2?: number, _3?: number): Vector4
    {
        if (typeof _0 === 'number')
        {
            this[0] *= _0
            this[1] *= _1 ?? _0
            this[2] *= _2 ?? _0
            this[3] *= _3 ?? _0
        }
        else
        {            
            this[0] *= _0[0]
            this[1] *= _0[1]
            this[2] *= _0[2]
            this[3] *= _0[3]
        }
        
        return this
    }

    Scale(scalar: number): Vector4
    {
        this[0] *= scalar
        this[1] *= scalar
        this[2] *= scalar
        this[3] *= scalar
        
        return this
    }
    
    Dot(xyzw: number): number
    Dot(x: number, y: number, z: number, w: number): number
    Dot(vector: Vector4): number
    Dot(array: NumberArray): number
    Dot(_0: Vector4 | NumberArray | number, _1?: number, _2?: number, _3?: number): number
    {
        if (typeof _0 === 'number')
        {
            return this[0] * _0 + this[1] * (_1 ?? _0) + this[2] * (_2 ?? _0) + this[3] * (_3 ?? _0)
        }
        else
        {
            return this[0] * _0[0] + this[1] * _0[1] + this[2] * _0[2] + this[3] * _0[3]
        }
    }
    
    //TODO: Rotate

    //TODO: Cross
    
    Normalize(): Vector4
    {        
        let length = this.LengthSquared

        if (length !== 0 && length !== 1)
        {
            length = Math.sqrt(length)
            this[0] /= length
            this[1] /= length
            this[2] /= length
            this[3] /= length
        }

        return this
    }
    
    Clone(): Vector4
    {
        return new Vector4(this)
    }

    Equals(other: Vector4): boolean
    {
        return this[0] === other[0] &&
            this[1] === other[1] &&
            this[2] === other[2] &&
            this[3] === other[3]
    }
    //#endregion

    //#region Static Properties
    static get Zero(): Vector4
    {
        return new Vector4(0)
    }
    
    static get One(): Vector4
    {
        return new Vector4(1)
    }
    
    static get Unit(): Vector4
    {
        return new Vector4(0.5)
    }

    static get UnitX(): Vector4
    {
        return new Vector4(1, 0, 0, 0)
    }

    static get UnitY(): Vector4
    {
        return new Vector4(0, 1, 0, 0)
    }

    static get UnitZ(): Vector4
    {
        return new Vector4(0, 0, 1, 0)
    }

    static get UnitW(): Vector4
    {
        return new Vector4(0, 0, 0, 1)
    }

    public static readonly SIZE: number = 4
    //#endregion
    
    //#region Static Methods
    static Negate(vector: Vector4): Vector4
    static Negate(vector: Vector4, outVector: Vector4): Vector4
    static Negate(_0: Vector4, _1?: Vector4): Vector4
    {
        const out = _1 ?? new Vector4()

        out[0] = -_0[0]
        out[1] = -_0[1]
        out[2] = -_0[2]
        out[3] = -_0[3]

        return out
    }

    static Add(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): Vector4
    static Add(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number, out: Vector4): Vector4
    static Add(vector1: Vector4, vector2: Vector4): Vector4
    static Add(vector1: Vector4, vector2: Vector4, out: Vector4): Vector4
    static Add(array1: NumberArray, array2: NumberArray): Vector4
    static Add(array1: NumberArray, array2: NumberArray, out: Vector4): Vector4
    static Add(_0: Vector4 | NumberArray | number, _1: Vector4 | NumberArray | number, _2?: Vector4 | number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: Vector4): Vector4
    {
        const out: Vector4 = _8 ?? _2 instanceof Vector4 ? _2 as Vector4 : new Vector4()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) + (_4 as number)
            out[1] = (_1 as number) + (_5 as number)
            out[2] = (_2 as number) + (_6 as number)
            out[3] = (_3 as number) + (_7 as number)
        }
        else
        {
            out[0] = _0[0] + _1[0]
            out[1] = _0[1] + _1[1]
            out[2] = _0[2] + _1[2]
            out[3] = _0[3] + _1[3]
        }

        return out
    }

    static Subtract(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): Vector4
    static Subtract(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number, out: Vector4): Vector4
    static Subtract(vector1: Vector4, vector2: Vector4): Vector4
    static Subtract(vector1: Vector4, vector2: Vector4, out: Vector4): Vector4
    static Subtract(array1: NumberArray, array2: NumberArray): Vector4
    static Subtract(array1: NumberArray, array2: NumberArray, out: Vector4): Vector4
    static Subtract(_0: Vector4 | NumberArray | number, _1: Vector4 | NumberArray | number, _2?: Vector4 | number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: Vector4): Vector4
    {
        const out: Vector4 = _8 ?? _2 instanceof Vector4 ? _2 as Vector4 : new Vector4()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) - (_4 as number)
            out[1] = (_1 as number) - (_5 as number)
            out[2] = (_2 as number) - (_6 as number)
            out[3] = (_3 as number) - (_7 as number)
        }
        else
        {
            out[0] = _0[0] - _1[0]
            out[1] = _0[1] - _1[1]
            out[2] = _0[2] - _1[2]
            out[3] = _0[3] - _1[3]
        }

        return out
    }

    static Multiply(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): Vector4
    static Multiply(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number, out: Vector4): Vector4
    static Multiply(vector1: Vector4, vector2: Vector4): Vector4
    static Multiply(vector1: Vector4, vector2: Vector4, out: Vector4): Vector4
    static Multiply(array1: NumberArray, array2: NumberArray): Vector4
    static Multiply(array1: NumberArray, array2: NumberArray, out: Vector4): Vector4
    static Multiply(_0: Vector4 | NumberArray | number, _1: Vector4 | NumberArray | number, _2?: Vector4 | number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: Vector4): Vector4
    {
        const out: Vector4 = _8 ?? _2 instanceof Vector4 ? _2 as Vector4 : new Vector4()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) * (_4 as number)
            out[1] = (_1 as number) * (_5 as number)
            out[2] = (_2 as number) * (_6 as number)
            out[3] = (_3 as number) * (_7 as number)
        }
        else
        {
            out[0] = _0[0] * _1[0]
            out[1] = _0[1] * _1[1]
            out[2] = _0[2] * _1[2]
            out[3] = _0[3] * _1[3]
        }

        return out
    }

    static Divide(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): Vector4
    static Divide(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number, out: Vector4): Vector4
    static Divide(vector1: Vector4, vector2: Vector4): Vector4
    static Divide(vector1: Vector4, vector2: Vector4, out: Vector4): Vector4
    static Divide(array1: NumberArray, array2: NumberArray): Vector4
    static Divide(array1: NumberArray, array2: NumberArray, out: Vector4): Vector4
    static Divide(_0: Vector4 | NumberArray | number, _1: Vector4 | NumberArray | number, _2?: Vector4 | number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: Vector4): Vector4
    {
        const out: Vector4 = _8 ?? _2 instanceof Vector4 ? _2 as Vector4 : new Vector4()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) / (_4 as number)
            out[1] = (_1 as number) / (_5 as number)
            out[2] = (_2 as number) / (_6 as number)
            out[3] = (_3 as number) / (_7 as number)
        }
        else
        {
            out[0] = _0[0] / _1[0]
            out[1] = _0[1] / _1[1]
            out[2] = _0[2] / _1[2]
            out[3] = _0[3] / _1[3]
        }

        return out
    }

    static Scale(vector: Vector4, scalar: number): Vector4
    static Scale(vector: Vector4, scalar: number, out: Vector4): Vector4
    static Scale(_0: Vector4, _1: number, _2?: Vector4): Vector4
    {
        const out: Vector4 = _2 ?? new Vector4()

        out[0] = _0[0] * _1
        out[1] = _0[1] * _1
        out[2] = _0[2] * _1
        out[3] = _0[3] * _1
        
        return out
    }

    static Dot(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): number
    static Dot(vector1: Vector4, vector2: Vector4): number
    static Dot(array1: NumberArray, array2: NumberArray): number
    static Dot(_0: Vector4 | NumberArray | number, _1: Vector4 | NumberArray | number, _2?: Vector4 | number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number): number
    {
        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            return (
                (_0 as number) * (_4 as number) +
                (_1 as number) * (_5 as number) + 
                (_2 as number) * (_6 as number) +
                (_3 as number) * (_7 as number)
            ) 
        }
        else
        {
            return (
                _0[0] * _1[0] + 
                _0[1] * _1[1] + 
                _0[2] * _1[2] +
                _0[3] * _1[3]
            )
        }
    }
    
    //TODO: Cross

    //TODO: Rotate

    static Distance(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): number
    static Distance(vector1: Vector4, vector2: Vector4): number
    static Distance(array1: NumberArray, array2: NumberArray): number
    static Distance(_0: Vector4 | NumberArray | number, _1: Vector4 | NumberArray | number, _2?: number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number): number
    {
        let x: number
        let y: number
        let z: number
        let w: number

        if (typeof _0 === 'number')
        {
            x = (_0 as number) - (_4 as number)
            y = (_1 as number) - (_5 as number)
            z = (_2 as number) - (_6 as number)
            w = (_3 as number) - (_7 as number)
        }
        else
        {
            _1 = _1 as Vector4

            x = _0[0] - _1[0]
            y = _0[1] - _1[1]
            z = _0[2] - _1[2]
            w = _0[3] - _1[3]
        }
        
        return Math.sqrt(x * x + y * y + w * w)
    }

    static Normalize(vector: Vector4): Vector4
    static Normalize(vector: Vector4, out: Vector4): Vector4
    static Normalize(_0: Vector4, _1?: Vector4): Vector4
    {
        const out: Vector4 = _1 ?? new Vector4()
        
        let length = _0.LengthSquared

        if (length !== 0 && length !== 1)
        {
            length = Math.sqrt(length)
            out[0] /= length
            out[1] /= length
            out[2] /= length
            out[3] /= length
        }

        return out
    }
    //#endregion
}
