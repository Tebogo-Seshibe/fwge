import { root_3 } from "../constants"
import { FixedLengthArray } from "../types"
import { IEquatable } from "../utils/interfaces/IEquatable"
import { Vector2 } from "./Vector2"

export type Vector3Array = FixedLengthArray<number, 3>

export class Vector3 extends Float32Array implements IEquatable<Vector3>
{
    //#region Instance Properties
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

    get XY(): Vector2
    {
        return new Vector2(this[0], this[1])
    }
    
    get Length(): number
    {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2])
    }

    get LengthSquared(): number
    {
        return this[0] * this[0] + this[1] * this[1] + this[2] * this[2]
    }
    //#endregion

    constructor()
    constructor(xyz: number)
    constructor(x: number, y: number, z: number)
    constructor(vector: Vector3)
    constructor(array: Vector3Array)
    constructor(buffer: ArrayBuffer)
    constructor(buffer: ArrayBuffer, byteOffset: number)
    constructor(_0: ArrayBuffer | Vector3 | Vector3Array | number = 0, _1?: number, _2?: number)
    {
        if (_0 instanceof ArrayBuffer)
        {
            super(_0, _1 ?? 0, Vector3.SIZE)
        }
        else if (typeof _0 === 'number')
        {
            super([_0, _1 ?? _0, _2 ?? _0])
        }
        else
        {
            super(_0)
        }
    }

    //#region Instance Methods
    Set(xyz: number): Vector3
    Set(x: number, y: number, z: number): Vector3
    Set(vector: Vector3): Vector3
    Set(array: Vector3Array): Vector3
    Set(_0: Vector3 | Vector3Array | number, _1?: number, _2?: number): Vector3
    {
        if (typeof _0 === 'number')
        {
            this[0] = _0
            this[1] = _1 ?? _0
            this[2] = _2 ?? _0
        }
        else
        {            
            this[0] = _0[0]
            this[1] = _0[1]
            this[2] = _0[2]
        }
        
        return this
    }

    Negate(): Vector3
    {
        this[0] = -this[0]
        this[1] = -this[1]
        this[2] = -this[2]

        return this
    }

    Add(xyz: number): Vector3
    Add(x: number, y: number, z: number): Vector3
    Add(vector: Vector3): Vector3
    Add(array: Vector3Array): Vector3
    Add(_0: Vector3 | Vector3Array | number, _1?: number, _2?: number): Vector3
    {
        if (typeof _0 === 'number')
        {
            this[0] += _0
            this[1] += _1 ?? _0
            this[2] += _2 ?? _0
        }
        else
        {
            this[0] += _0[0]
            this[1] += _0[1]
            this[2] += _0[2]
        }
        
        return this
    }

    Subtract(xyz: number): Vector3
    Subtract(x: number, y: number, z: number): Vector3
    Subtract(vector: Vector3): Vector3
    Subtract(array: Vector3Array): Vector3
    Subtract(_0: Vector3 | Vector3Array | number, _1?: number, _2?: number): Vector3
    {
        if (typeof _0 === 'number')
        {
            this[0] -= _0
            this[1] -= _1 ?? _0
            this[2] -= _2 ?? _0
        }
        else
        {
            this[0] -= _0[0]
            this[1] -= _0[1]
            this[2] -= _0[2]
        }
        
        return this
    }
    
    Multiply(xyz: number): Vector3
    Multiply(x: number, y: number, z: number): Vector3
    Multiply(vector: Vector3): Vector3
    Multiply(array: Vector3Array): Vector3
    Multiply(_0: Vector3 | Vector3Array | number, _1?: number, _2?: number): Vector3
    {
        if (typeof _0 === 'number')
        {
            this[0] *= _0
            this[1] *= _1 ?? _0
            this[2] *= _2 ?? _0
        }
        else
        {
            this[0] *= _0[0]
            this[1] *= _0[1]
            this[2] *= _0[2]
        }
        
        return this
    }
    
    Divide(xyz: number): Vector3
    Divide(x: number, y: number, z: number): Vector3
    Divide(vector: Vector3): Vector3
    Divide(array: Vector3Array): Vector3
    Divide(_0: Vector3 | Vector3Array | number, _1?: number, _2?: number): Vector3
    {
        if (typeof _0 === 'number')
        {
            this[0] /= _0
            this[1] /= _1 ?? _0
            this[2] /= _2 ?? _0
        }
        else
        {
            this[0] /= _0[0]
            this[1] /= _0[1]
            this[2] /= _0[2]
        }
        
        return this
    }

    Scale(scalar: number): Vector3
    {
        this[0] *= scalar
        this[1] *= scalar
        this[2] *= scalar

        return this
    }

    Dot(xyz: number): number
    Dot(x: number, y: number, z: number): number
    Dot(vector: Vector3): number
    Dot(array: Vector3Array): number
    Dot(_0: Vector3 | Vector3Array | number, _1?: number, _2?: number): number
    {
        if (typeof _0 === 'number')
        {
            return this[0] * _0 + this[1] * (_1 ?? _0) + this[2] * (_2 ?? _0)
        }
        else
        {
            return this[0] * _0[0] + this[1] * _0[1] + this[2] * _0[2]
        }
    }

    Cross(xyz: number): Vector3
    Cross(x: number, y: number, z: number): Vector3
    Cross(vector: Vector3): Vector3
    Cross(array: Vector3Array): Vector3
    Cross(_0: Vector3 | Vector3Array | number, _1?: number, _2?: number): Vector3
    {
        if (typeof _0 === 'number')
        {
            return this.Set(
                this[1] * (_2 as number) - this[2] * (_1 as number),
                this[2] * (_0 as number) - this[0] * (_2 as number),
                this[0] * (_1 as number) - this[1] * (_0 as number)
            )
        }
        else
        {
            return this.Set(
                this[1] * _0[2] - this[2] * _0[1],
                this[2] * _0[0] - this[0] * _0[2],
                this[0] * _0[1] - this[1] * _0[0]
            )
        }
    }
    
    //TODO: Rotate
    
    Distance(xyz: number): number
    Distance(x: number, y: number, z: number): number
    Distance(vector: Vector3): number
    Distance(array: Vector3Array): number
    Distance(_0: Vector3 | Vector3Array | number, _1?: number, _2?: number): number
    {
        let x: number
        let y: number
        let z: number

        if (typeof _0 === 'number')
        {
            x = this[0] - _0,
            y = this[1] - (_1 ?? _0)
            z = this[2] - (_2 ?? _0)
        }
        else
        {
            x = this[0] - _0[0]
            y = this[1] - _0[1]
            z = this[2] - _0[2]
        }

        return Math.sqrt(x * x + y * y + z * z)
    }

    Normalize(): Vector3
    {        
        let length = this.LengthSquared

        if (length !== 0 && length !== 1)
        {
            length = Math.sqrt(length)
            this[0] /= length
            this[1] /= length
            this[2] /= length
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
    //#endregion

    //#region Static Properties
    static get Zero(): Vector3
    {
        return new Vector3(0)
    }

    static get One(): Vector3
    {
        return new Vector3(1)
    }

    static get Unit(): Vector3
    {
        return new Vector3(root_3)
    }

    static get UnitX(): Vector3
    {
        return new Vector3(1, 0, 0)
    }

    static get UnitY(): Vector3
    {
        return new Vector3(0, 1, 0)
    }

    static get UnitZ(): Vector3
    {
        return new Vector3(0, 0, 1)
    }

    public static readonly SIZE: number = 3
    //#endregion
    
    //#region Static Methods
    static Negate(vector: Vector3): Vector3
    static Negate(vector: Vector3, outVector: Vector3): Vector3
    static Negate(_0: Vector3, _1?: Vector3): Vector3
    {
        const out = _1 ?? new Vector3()

        out[0] = -_0[0]
        out[1] = -_0[1]
        out[2] = -_0[2]

        return out
    }

    static Add(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): Vector3
    static Add(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, out: Vector3): Vector3
    static Add(vector1: Vector3, vector2: Vector3): Vector3
    static Add(vector1: Vector3, vector2: Vector3, out: Vector3): Vector3
    static Add(array1: Vector3Array, array2: Vector3Array): Vector3
    static Add(array1: Vector3Array, array2: Vector3Array, out: Vector3): Vector3
    static Add(_0: Vector3 | Vector3Array | number, _1: Vector3 | Vector3Array | number, _2?: Vector3 | number, _3?: number, _4?: number, _5?: number, _6?: Vector3): Vector3
    {
        const out: Vector3 = _6 ?? _2 instanceof Vector3 ? _2 as Vector3 : new Vector3()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) + (_3 as number)
            out[1] = (_1 as number) + (_4 as number)
            out[2] = (_2 as number) + (_5 as number)
        }
        else
        {
            out[0] = _0[0] + _1[0]
            out[1] = _0[1] + _1[1]
            out[2] = _0[2] + _1[2]
        }

        return out
    }

    static Subtract(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): Vector3
    static Subtract(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, out: Vector3): Vector3
    static Subtract(vector1: Vector3, vector2: Vector3): Vector3
    static Subtract(vector1: Vector3, vector2: Vector3, out: Vector3): Vector3
    static Subtract(array1: Vector3Array, array2: Vector3Array): Vector3
    static Subtract(array1: Vector3Array, array2: Vector3Array, out: Vector3): Vector3
    static Subtract(_0: Vector3 | Vector3Array | number, _1: Vector3 | Vector3Array | number, _2?: Vector3 | number, _3?: number, _4?: number, _5?: number, _6?: Vector3): Vector3
    {
        const out: Vector3 = _6 ?? _2 instanceof Vector3 ? _2 as Vector3 : new Vector3()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) - (_3 as number)
            out[1] = (_1 as number) - (_4 as number)
            out[2] = (_2 as number) - (_5 as number)
        }
        else
        {
            out[0] = _0[0] - _1[0]
            out[1] = _0[1] - _1[1]
            out[2] = _0[2] - _1[2]
        }

        return out
    }

    static Multiply(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): Vector3
    static Multiply(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, out: Vector3): Vector3
    static Multiply(vector1: Vector3, vector2: Vector3): Vector3
    static Multiply(vector1: Vector3, vector2: Vector3, out: Vector3): Vector3
    static Multiply(array1: Vector3Array, array2: Vector3Array): Vector3
    static Multiply(array1: Vector3Array, array2: Vector3Array, out: Vector3): Vector3
    static Multiply(_0: Vector3 | Vector3Array | number, _1: Vector3 | Vector3Array | number, _2?: Vector3 | number, _3?: number, _4?: number, _5?: number, _6?: Vector3): Vector3
    {
        const out: Vector3 = _6 ?? _2 instanceof Vector3 ? _2 as Vector3 : new Vector3()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) * (_3 as number)
            out[1] = (_1 as number) * (_4 as number)
            out[2] = (_2 as number) * (_5 as number)
        }
        else
        {
            out[0] = _0[0] * _1[0]
            out[1] = _0[1] * _1[1]
            out[2] = _0[2] * _1[2]
        }

        return out
    }

    static Divide(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): Vector3
    static Divide(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, out: Vector3): Vector3
    static Divide(vector1: Vector3, vector2: Vector3): Vector3
    static Divide(vector1: Vector3, vector2: Vector3, out: Vector3): Vector3
    static Divide(array1: Vector3Array, array2: Vector3Array): Vector3
    static Divide(array1: Vector3Array, array2: Vector3Array, out: Vector3): Vector3
    static Divide(_0: Vector3 | Vector3Array | number, _1: Vector3 | Vector3Array | number, _2?: Vector3 | number, _3?: number, _4?: number, _5?: number, _6?: Vector3): Vector3
    {
        const out: Vector3 = _6 ?? _2 instanceof Vector3 ? _2 as Vector3 : new Vector3()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) / (_3 as number)
            out[1] = (_1 as number) / (_4 as number)
            out[2] = (_2 as number) / (_5 as number)
        }
        else
        {
            out[0] = _0[0] / _1[0]
            out[1] = _0[1] / _1[1]
            out[2] = _0[2] / _1[2]
        }

        return out
    }

    static Scale(vector: Vector3, scalar: number): Vector3
    static Scale(vector: Vector3, scalar: number, out: Vector3): Vector3
    static Scale(_0: Vector3, _1: number, _2?: Vector3): Vector3
    {
        const out: Vector3 = _2 ?? new Vector3()

        out[0] = _0[0] * _1
        out[1] = _0[1] * _1
        out[2] = _0[2] * _1
        
        return out
    }

    static Dot(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number
    static Dot(vector1: Vector3, vector2: Vector3): number
    static Dot(array1: Vector3Array, array2: Vector3Array): number
    static Dot(_0: Vector3 | Vector3Array | number, _1: Vector3 | Vector3Array | number, _2?: number, _3?: number, _4?: number, _5?: number): number
    {
        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            return (
                (_0 as number) * (_3 as number) +
                (_1 as number) * (_4 as number) + 
                (_2 as number) * (_5 as number)
            ) 
        }
        else
        {
            return (
                _0[0] * _1[0] + 
                _0[1] * _1[1] + 
                _0[2] * _1[2]
            )
        }
    }
    
    static Cross(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): Vector3
    static Cross(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, out: Vector3): Vector3
    static Cross(vector1: Vector3, vector2: Vector3): Vector3
    static Cross(vector1: Vector3, vector2: Vector3, out: Vector3): Vector3
    static Cross(array1: Vector3Array, array2: Vector3Array): Vector3
    static Cross(array1: Vector3Array, array2: Vector3Array, out: Vector3): Vector3
    static Cross(_0: Vector3 | Vector3Array | number, _1: Vector3 | Vector3Array | number, _2?: Vector3 | number, _3?: number, _4?: number, _5?: number, _6?: Vector3): Vector3
    {
        const out: Vector3 = _6 ?? _2 instanceof Vector3 ? _2 as Vector3 : new Vector3()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            return out.Set(
                (_1 as number) * (_5 as number) - (_2 as number) * (_4 as number),
                (_2 as number) * (_3 as number) - (_0 as number) * (_5 as number),
                (_0 as number) * (_4 as number) - (_1 as number) * (_3 as number)
            )
        }
        else
        {
            return out.Set(
                _0[1] * _1[2] - _0[2] * _1[1],
                _0[2] * _1[0] - _0[0] * _1[2],
                _0[0] * _1[1] - _0[1] * _1[0]
            )
        }
    }

    //TODO: Rotates       

    static Distance(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number
    static Distance(vector1: Vector3, vector2: Vector3): number
    static Distance(array1: Vector3Array, array2: Vector3Array): number
    static Distance(_0: Vector3 | Vector3Array | number, _1: Vector3 | Vector3Array | number, _2?: number, _3?: number, _4?: number, _5?: number): number
    {
        let x: number
        let y: number
        let z: number

        if (typeof _0 === 'number')
        {
            x = (_0 as number) - (_3 as number)
            y = (_1 as number) - (_4 as number)
            z = (_2 as number) - (_5 as number)
        }
        else
        {
            _1 = _1 as Vector3

            x = _0[0] - _1[0]
            y = _0[1] - _1[1]
            z = _0[2] - _1[2]
        }
        
        return Math.sqrt(x * x + y * y + z * z)
    }

    static Normalize(vector: Vector3): Vector3
    static Normalize(vector: Vector3, out: Vector3): Vector3
    static Normalize(vector: Vector3Array): Vector3
    static Normalize(vector: Vector3Array, out: Vector3): Vector3
    static Normalize(x: number, y: number, z: number): Vector3
    static Normalize(x: number, y: number, z: number, out: Vector3): Vector3
    static Normalize(_0: Vector3 | Vector3Array | number, _1?: Vector3 | number, _2?: number, _3?: Vector3): Vector3
    {
        let out: Vector3
        if (typeof _0 === 'number' || typeof _1 === 'number' || typeof _2 === 'number')
        {
            out = _3 ?? new Vector3(_0 as number, _1 as number, _2 as number)
        }
        else
        {
            out = _1 ?? new Vector3(_0[0], _0[1], _0[2])
        }

        let length = out.LengthSquared
        if (length !== 0 && length !== 1)
        {
            length = Math.sqrt(length)
            out[0] /= length
            out[1] /= length
            out[2] /= length
        }

        return out
    }
    
    static Length(vector: Vector3): number
    static Length(vector: Vector3Array): number
    static Length(x: number, y: number, z: number): number
    static Length(_0: Vector3 | Vector3Array | number, _1?: number, _2?: number): number
    {
        if (typeof _0 === 'number')
        {
            return Math.sqrt(_0 * _0 + (_1 as number) * (_1 as number) + (_2 as number) * (_2 as number))
        }
        else
        {
            return Math.sqrt(_0[0] * _0[0] + _0[1] * _0[1] + _0[2] * _0[2])
        }
    }

    static LengthSquared(vector: Vector3): number
    static LengthSquared(vector: Vector3Array): number
    static LengthSquared(x: number, y: number, z: number): number
    static LengthSquared(_0: Vector3 | Vector3Array | number, _1?: number, _2?: number): number
    {
        if (typeof _0 === 'number')
        {
            return _0 * _0 + (_1 as number) * (_1 as number) + (_2 as number) * (_2 as number)
        }
        else
        {
            return _0[0] * _0[0] + _0[1] * _0[1] + _0[2] * _0[2]
        }
    }
    //#endregion
}
