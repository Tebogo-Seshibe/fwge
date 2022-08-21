import { FixedLengthArray, NumberArray } from '../types'
import { radian } from '../utils'
import { Vector2 } from '../vector'
import { Matrix3 } from './Matrix3'
import { Matrix4 } from './Matrix4'

export type Matrix2Array = FixedLengthArray<number, 4>

export class Matrix2 extends Float32Array
{
    //#region Local Properties
    get M11(): number
    {
        return this[0]
    }
    
    set M11(m11: number)
    {
        this[0] = m11
    }
    
    get M12(): number
    {
        return this[1]
    }

    set M12(m12: number)
    {
        this[1] = m12
    }
    
    get M21(): number
    {
        return this[2]
    }

    set M21(m21: number)
    {
        this[2] = m21
    }
    
    get M22(): number
    {
        return this[3]
    }

    set M22(m22: number)
    {
        this[3] = m22
    }
    
    get Determinant(): number
    {
        return this.M11 * this.M22 - this.M21 * this.M12
    }

    get Column1(): Vector2
    {
        return new Vector2(this[0], this[2])
    }

    get Column2(): Vector2
    {
        return new Vector2(this[1], this[3])
    }

    get Row1(): Vector2
    {
        return new Vector2(this[0], this[1])
    }

    get Row2(): Vector2
    {
        return new Vector2(this[2], this[3])
    }
    
    get Diagonal(): Vector2
    {
        return new Vector2(this[0], this[3])
    }
    
    get Trace(): number
    {
        return this[0] + this[3]
    }
    //#endregion

    constructor()
    constructor(diag: number)
    constructor(m11: number, m12: number, m21: number, m22: number)
    constructor(matrix: Matrix2)
    constructor(matrix: Matrix3)
    constructor(matrix: Matrix4)
    constructor(array: NumberArray)
    constructor(_0: Matrix4 | Matrix3 | Matrix2 | NumberArray | number = 0, _1?: number, _2?: number, _3?: number)
    {
        super(typeof _0 === 'number' ?
        [ 
                 _0, _1 ??  0,
            _2 ?? 0, _3 ?? _0
        ] : _0 instanceof Matrix4 || _0 instanceof Matrix3 || _0 instanceof Matrix2 ?
        [
            _0.M11, _0.M12,
            _0.M21, _0.M22
        ]: _0)
    }

    //#region Local Methods
    Set(m11: number, m12: number, m21: number, m22: number): Matrix2
    Set(matrix: Matrix2): Matrix2
    Set(array: NumberArray): Matrix2
    Set(_0: Matrix2 | NumberArray | number, _1?: number, _2?: number, _3?: number): Matrix2
    {
        if (typeof _0 === 'number')
        {
            this[0] = _0 as number
            this[1] = _1 as number
            this[2] = _2 as number
            this[3] = _3 as number
        }
        else
        {
            this[0] = _0[0]
            this[1] = _0[1]
            this[2] = _0[2]
            this[3] = _0[3]
        }

        return this
    }

    Add(m11: number, m12: number, m21: number, m22: number): Matrix2
    Add(matrix: Matrix2): Matrix2
    Add(array: NumberArray): Matrix2
    Add(_0: Matrix2 | NumberArray | number, _1?: number, _2?: number, _3?: number): Matrix2
    {
        if (typeof _0 === 'number')
        {
            this[0] += _0 as number
            this[1] += _1 as number
            this[2] += _2 as number
            this[3] += _3 as number
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
    
    Multiply(matrix: Matrix2): Matrix2
    Multiply(m11: number, m12: number, m21: number, m22: number): Matrix2
    Multiply(array: [number, number, number, number]): Matrix2
    Multiply(_0: Matrix2 | number[] | number, _1?: number, _2?: number, _3?: number): Matrix2
    {
        if (typeof _0 === 'number')
        {
            return this.Set(
                this[0] * (_0 as number) + this[1] * (_2 as number),
                this[0] * (_1 as number) + this[1] * (_3 as number),
                this[2] * (_0 as number) + this[3] * (_2 as number),
                this[2] * (_1 as number) + this[3] * (_3 as number)
            )
        }
        else
        {
            return this.Set(
                this[0] * _0[0] + this[1] * _0[2],
                this[0] * _0[1] + this[1] * _0[3],
                this[2] * _0[0] + this[3] * _0[2],
                this[2] * _0[1] + this[3] * _0[3]
            )
        }        
    }

    Scale(scaler: number): Matrix2
    {
        this[0] *= scaler
        this[1] *= scaler
        this[2] *= scaler
        this[3] *= scaler

        return this
    }

    Transpose(): Matrix2
    {
        return this.Set(
            this[0], this[2], 
            this[1], this[3]
        )
    }

    Inverse(): Matrix2
    {
        const det = this.Determinant

        if (det !== 0)
        {
            this.Set(
                 this[3] / det, -this[1] / det,
                -this[2] / det,  this[0] / det
            )
        }

        return this
    }
    
    Zero(): Matrix2
    {
        this[0] = 0
        this[1] = 0
        this[2] = 0
        this[3] = 0

        return this
    
    }
    Identity(): Matrix2
    {
        this[0] = 1
        this[1] = 0
        this[2] = 0
        this[3] = 1

        return this
    }

    Clone(): Matrix2
    {
        return new Matrix2(this)
    }

    Equals(other: Matrix2): boolean
    {
        return this[0] === other[0] &&
            this[1] === other[1] &&
            this[2] === other[2] &&
            this[3] === other[3]
    }
    //#endregion

    //#region Static Properties
    static get Zero(): Matrix2
    {
        return new Matrix2(0)
    }

    static get Identity(): Matrix2
    {
        return new Matrix2(1)
    }

    static readonly SIZE: number = 4
    //#endregion
    
    //#region Static Methods
    static Add(m1_11: number, m1_12: number, m1_21: number, m1_22: number, m2_11: number, m2_12: number, m2_21: number, m2_22: number): Matrix2
    static Add(m1_11: number, m1_12: number, m1_21: number, m1_22: number, m2_11: number, m2_12: number, m2_21: number, m2_22: number, out: Matrix2): Matrix2
    static Add(matrix1: Matrix2, matrix2: Matrix2): Matrix2
    static Add(matrix1: Matrix2, matrix2: Matrix2, out: Matrix2): Matrix2
    static Add(array1: NumberArray, array2: NumberArray): Matrix2
    static Add(array1: NumberArray, array2: NumberArray, out: Matrix2): Matrix2
    static Add(_0: Matrix2 | NumberArray | number, _1:  Matrix2 | NumberArray | number, _2?: Matrix2 | number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: Matrix2): Matrix2
    {
        const out = _8 ?? _2 instanceof Matrix2 ? _2 as Matrix2: new Matrix2()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) + (_4 as number)
            out[1] = (_1 as number) + (_5 as number)
            out[2] = (_2 as number) + (_6 as number)
            out[2] = (_3 as number) + (_7 as number)
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
    
    static Multiply(m1_11: number, m1_12: number, m1_21: number, m1_22: number, m2_11: number, m2_12: number, m2_21: number, m2_22: number): Matrix2
    static Multiply(m1_11: number, m1_12: number, m1_21: number, m1_22: number, m2_11: number, m2_12: number, m2_21: number, m2_22: number, out: Matrix2): Matrix2
    static Multiply(matrix1: Matrix2, matrix2: Matrix2): Matrix2
    static Multiply(matrix1: Matrix2, matrix2: Matrix2, out: Matrix2): Matrix2
    static Multiply(array1: NumberArray, array2: NumberArray): Matrix2
    static Multiply(array1: NumberArray, array2: NumberArray, out: Matrix2): Matrix2
    static Multiply(_0: Matrix2 | NumberArray | number, _1:  Matrix2 | NumberArray | number, _2?: Matrix2 | number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: Matrix2): Matrix2
    {
        const out = _8 ?? _2 instanceof Matrix2 ? _2 as Matrix2: new Matrix2()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            return out.Set(
                (_0 as number) * (_4 as number) + (_1 as number) * (_6 as number),
                (_0 as number) * (_5 as number) + (_1 as number) * (_7 as number),
                (_2 as number) * (_4 as number) + (_3 as number) * (_6 as number),
                (_2 as number) * (_5 as number) + (_3 as number) * (_7 as number)
            )
        }
        else
        {
            return out.Set(
                _0[0] * _1[0] + _0[1] * _1[2],
                _0[0] * _1[1] + _0[1] * _1[3],
                _0[2] * _1[0] + _0[3] * _1[2],
                _0[2] * _1[1] + _0[3] * _1[3]
            )
        }
    }

    static Scale(matrix: Matrix2, scalar: number): Matrix2
    static Scale(matrix: Matrix2, scalar: number, out: Matrix2): Matrix2
    static Scale(_0: Matrix2, _1: number, _2?: Matrix2): Matrix2
    {
        const out = _2 ?? new Matrix2()

        out[0] *= _1
        out[1] *= _1
        out[2] *= _1
        out[3] *= _1

        return out
    }

    static Transpose(matrix: Matrix2): Matrix2
    static Transpose(matrix: Matrix2, out: Matrix2): Matrix2
    static Transpose(_0: Matrix2, _1?: Matrix2): Matrix2
    {
        const out = _1 ?? new Matrix2()

        return out.Set(
            _0[0], _0[2], 
            _0[1], _0[3]
        )
    }
    
    static Inverse(matrix: Matrix2): Matrix2
    static Inverse(matrix: Matrix2, out: Matrix2): Matrix2
    static Inverse(_0: Matrix2, _1?: Matrix2): Matrix2
    {
        const out = _1 ?? new Matrix2()
        const det = _0.Determinant

        if (det !== 0)
        {
            out.Set(
                 _0[3] / det, -_0[1] / det,
                -_0[2] / det,  _0[0] / det
            )
        }

        return out
    }
    
    static MultiplyVector(matrix: Matrix2, vector: Vector2): Vector2
    static MultiplyVector(matrix: Matrix2, vector: Vector2, out: Vector2): Vector2
    static MultiplyVector(_0: Matrix2, _1: Vector2, _2?: Vector2): Vector2
    {
        const out = _2 ?? new Vector2()

        return out.Set(
            _0[0] * _1[0] + _0[1] * _1[1],
            _0[2] * _1[0] + _0[3] * _1[1]
        )
    }

    static RotationMatrix(degrees: number): Matrix2
    static RotationMatrix(degrees: number, out: Matrix2): Matrix2
    static RotationMatrix(_0: number, _1?: Matrix2): Matrix2
    {
        const out = _1 ?? new Matrix2()

        const theta = radian(_0)
        const cosTheta = Math.cos(theta)
        const sinTheta = Math.sin(theta)
        
        return out.Set(
             cosTheta, sinTheta,
            -sinTheta, cosTheta
        )
    }

    static ScaleMatrix(scalar: number): Matrix2
    static ScaleMatrix(scalar: number, out: Matrix2): Matrix2
    static ScaleMatrix(_0: number, _1?: Matrix2): Matrix2
    {
        const out = _1 ?? new Matrix2()
        
        return out.Set(
             _0,  0,
              0, _0
        )
    }
    //#endregion
}
