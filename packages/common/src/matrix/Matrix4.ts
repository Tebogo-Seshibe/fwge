import { FixedLengthArray } from "../types"
import { clean, cot, radian } from "../utils"
import { IEquatable } from "../utils/interfaces/IEquatable"
import { Vector2, Vector2Array, Vector3, Vector3Array, Vector4 } from "../vector"
import { Matrix2 } from "./Matrix2"
import { Matrix3 } from "./Matrix3"

export type Matrix4Array = FixedLengthArray<number, 16>

export class Matrix4 extends Float32Array implements IEquatable<Matrix4>
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

    get M13(): number
    { 
        return this[2]
    }

    set M13(m13: number)
    {
        this[2] = m13
    }

    get M14(): number
    { 
        return this[3]
    }

    set M14(m14: number)
    {
        this[3] = m14
    }

    get M21(): number
    { 
        return this[4]
    }

    set M21(m21: number)
    {
        this[4] = m21
    }

    get M22(): number
    { 
        return this[5]
    }

    set M22(m22: number)
    {
        this[5] = m22
    }

    get M23(): number
    { 
        return this[6]
    }

    set M23(m23: number)
    {
        this[6] = m23
    }

    get M24(): number
    { 
        return this[7]
    }

    set M24(m24: number)
    {
        this[7] = m24
    }

    get M31(): number
    { 
        return this[8]
    }

    set M31(m31: number)
    {
        this[8] = m31
    }

    get M32(): number
    { 
        return this[9]
    }

    set M32(m32: number)
    {
        this[9] = m32
    }

    get M33(): number
    { 
        return this[10]
    }

    set M33(m33: number)
    {
        this[10] = m33
    }

    get M34(): number
    { 
        return this[11]
    }

    set M34(m34: number)
    {
        this[11] = m34
    }

    get M41(): number
    { 
        return this[12]
    }

    set M41(m41: number)
    {
        this[12] = m41
    }    

    get M42(): number
    { 
        return this[13]
    }

    set M42(m42: number)
    {
        this[13] = m42
    }

    get M43(): number
    { 
        return this[14]
    }
    
    set M43(m43: number)
    {
        this[14] = m43
    }

    get M44(): number
    { 
        return this[15]
    }

    set M44(m44: number)
    {
        this[15] = m44
    }

    get Determinant(): number
    {
        return (
            this[0] * this[5] * this[10] * this[15] +
            this[0] * this[6] * this[11] * this[13] +
            this[0] * this[7] * this[9]  * this[14] +
            this[1] * this[4] * this[11] * this[14] +
            this[1] * this[6] * this[8]  * this[15] +
            this[1] * this[7] * this[10] * this[12] +
            this[2] * this[4] * this[9]  * this[15] +
            this[2] * this[5] * this[11] * this[12] +
            this[2] * this[7] * this[8]  * this[13] +
            this[3] * this[4] * this[10] * this[13] +
            this[3] * this[5] * this[8]  * this[14] +
            this[3] * this[6] * this[9]  * this[12] -
            this[0] * this[5] * this[11] * this[14] -
            this[0] * this[6] * this[9]  * this[15] -
            this[0] * this[7] * this[10] * this[13] -
            this[1] * this[4] * this[10] * this[15] -
            this[1] * this[6] * this[11] * this[12] -
            this[1] * this[7] * this[8]  * this[14] -
            this[2] * this[4] * this[11] * this[13] -
            this[2] * this[5] * this[8]  * this[15] -
            this[2] * this[7] * this[9]  * this[12] -
            this[3] * this[4] * this[9]  * this[14] -
            this[3] * this[5] * this[10] * this[12] -
            this[3] * this[6] * this[8]  * this[13]
        )
    }

    get Column1(): Vector4
    {
        return new Vector4(this[0], this[4], this[8], this[12])
    }

    get Column2(): Vector4
    {
        return new Vector4(this[1], this[5], this[9], this[13])
    }

    get Column3(): Vector4
    {
        return new Vector4(this[2], this[6], this[10], this[14])
    }

    get Column4(): Vector4
    {
        return new Vector4(this[3], this[7], this[11], this[15])
    }
    
    get Row1(): Vector4
    {
        return new Vector4(this[0], this[1], this[2], this[3])
    }

    get Row2(): Vector4
    {
        return new Vector4(this[4], this[5], this[6], this[7])
    }

    get Row3(): Vector4
    {
        return new Vector4(this[8], this[9], this[10], this[11])
    }

    get Row4(): Vector4
    {
        return new Vector4(this[12], this[13], this[14], this[15])
    }

    get Trace(): number
    {
        return this[0] + this[5] + this[10] + this[15]
    }

    get Matrix2(): Matrix2
    {
        return new Matrix2(
            this[0], this[1],
            this[4], this[5]
        )
    }

    get Matrix3(): Matrix3
    {
        return new Matrix3(
            this[0], this[1], this[2],
            this[4], this[5], this[6],
            this[8], this[9], this[10]
        )
    }
    //#endregion

    constructor()
    constructor(diag: number)
    constructor(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number)
    constructor(matrix: Matrix2)
    constructor(matrix: Matrix3)
    constructor(matrix: Matrix4)
    constructor(array: Matrix4Array)
    constructor(buffer: ArrayBuffer)
    constructor(buffer: ArrayBuffer, byteOffset: number)
    constructor(_0: ArrayBuffer | Matrix4 | Matrix3 | number[] | number = 0, _1?: number, _2?: number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number, _9?: number, _10?: number, _11?: number, _12?: number, _13?: number, _14?: number, _15?: number)
    {
        if (_0 instanceof ArrayBuffer)
        {
            super(_0, _1 ?? 0, Matrix4.SIZE)
        }
        else if (_0 instanceof Matrix3)
        {
            super(
            [
                _0.M11, _0.M12, _0.M13, 0,
                _0.M21, _0.M22, _0.M23, 0,
                _0.M31, _0.M32, _0.M33, 0,
                     0,      0,      0, 1
            ])
        }
        else if (_0 instanceof Matrix2)
        {
            super(
            [
                _0.M11, _0.M12, 0, 0,
                _0.M21, _0.M22, 0, 0,
                     0,      0, 1, 0,
                     0,      0, 0, 1,
            ])
        }
        else if (typeof _0 === 'number')
        {
            super(
            [
                      _0,  _1 ??  0,  _2 ??  0,  _3 ??  0,
                 _4 ?? 0,  _5 ?? _0,  _6 ??  0,  _7 ??  0,
                 _8 ?? 0,  _9 ??  0, _10 ?? _0, _11 ??  0,
                _12 ?? 0, _13 ??  0, _14 ??  0, _15 ?? _0
            ])
        }
        else
        {
            super(_0)
        }
    }

    //#region Local Methods
    Set(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    Set(matrix: Matrix4): Matrix4
    Set(array: Matrix4Array): Matrix4
    Set(_0: Matrix4 | Matrix4Array | number, _1?: number, _2?: number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number, _9?: number, _10?: number, _11?: number, _12?: number, _13?: number, _14?: number, _15?: number): Matrix4
    {
        if (typeof _0 === 'number')
        {
            this[0]  = _0 as number
            this[1]  = _1 as number
            this[2]  = _2 as number
            this[3]  = _3 as number
            this[4]  = _4 as number
            this[5]  = _5 as number
            this[6]  = _6 as number
            this[7]  = _7 as number
            this[8]  = _8 as number
            this[9]  = _9 as number
            this[10] = _10 as number
            this[11] = _11 as number
            this[12] = _12 as number
            this[13] = _13 as number
            this[14] = _14 as number
            this[15] = _15 as number
        }
        else
        {
            this[0]  = _0[0]
            this[1]  = _0[1]
            this[2]  = _0[2]
            this[3]  = _0[3]
            this[4]  = _0[4]
            this[5]  = _0[5]
            this[6]  = _0[6]
            this[7]  = _0[7]
            this[8]  = _0[8]
            this[9]  = _0[9]
            this[10] = _0[10]
            this[11] = _0[11]
            this[12] = _0[12]
            this[13] = _0[13]
            this[14] = _0[14]
            this[15] = _0[15]
        }

        return this
    }

    Add(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    Add(matrix: Matrix4): Matrix4
    Add(array: Matrix4Array): Matrix4
    Add(_0: Matrix4 | Matrix4Array | number, _1?: number, _2?: number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number, _9?: number, _10?: number, _11?: number, _12?: number, _13?: number, _14?: number, _15?: number): Matrix4
    {
        if (typeof _0 === 'number')
        {
            this[0]  += _0 as number
            this[1]  += _1 as number
            this[2]  += _2 as number
            this[3]  += _3 as number
            this[4]  += _4 as number
            this[5]  += _5 as number
            this[6]  += _6 as number
            this[7]  += _7 as number
            this[8]  += _8 as number
            this[9]  += _9 as number
            this[10] += _10 as number
            this[11] += _11 as number
            this[12] += _12 as number
            this[13] += _13 as number
            this[14] += _14 as number
            this[15] += _15 as number
        }
        else
        {
            this[0]  += _0[0]
            this[1]  += _0[1]
            this[2]  += _0[2]
            this[3]  += _0[3]
            this[4]  += _0[4]
            this[5]  += _0[5]
            this[6]  += _0[6]
            this[7]  += _0[7]
            this[8]  += _0[8]
            this[9]  += _0[9]
            this[10] += _0[10]
            this[11] += _0[11]
            this[12] += _0[12]
            this[13] += _0[13]
            this[14] += _0[14]
            this[15] += _0[15]
        }

        return this
    }
    
    Subtract(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    Subtract(matrix: Matrix4): Matrix4
    Subtract(array: Matrix4Array): Matrix4
    Subtract(_0: Matrix4 | Matrix4Array | number, _1?: number, _2?: number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number, _9?: number, _10?: number, _11?: number, _12?: number, _13?: number, _14?: number, _15?: number): Matrix4
    {
        if (typeof _0 === 'number')
        {
            this[0]  -= _0 as number
            this[1]  -= _1 as number
            this[2]  -= _2 as number
            this[3]  -= _3 as number
            this[4]  -= _4 as number
            this[5]  -= _5 as number
            this[6]  -= _6 as number
            this[7]  -= _7 as number
            this[8]  -= _8 as number
            this[9]  -= _9 as number
            this[10] -= _10 as number
            this[11] -= _11 as number
            this[12] -= _12 as number
            this[13] -= _13 as number
            this[14] -= _14 as number
            this[15] -= _15 as number
        }
        else
        {
            this[0]  -= _0[0]
            this[1]  -= _0[1]
            this[2]  -= _0[2]
            this[3]  -= _0[3]
            this[4]  -= _0[4]
            this[5]  -= _0[5]
            this[6]  -= _0[6]
            this[7]  -= _0[7]
            this[8]  -= _0[8]
            this[9]  -= _0[9]
            this[10] -= _0[10]
            this[11] -= _0[11]
            this[12] -= _0[12]
            this[13] -= _0[13]
            this[14] -= _0[14]
            this[15] -= _0[15]
        }

        return this
    }

    Multiply(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    Multiply(matrix: Matrix4): Matrix4
    Multiply(array: Matrix4Array): Matrix4
    Multiply(_0: Matrix4 | Matrix4Array | number, _1?: number, _2?: number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number, _9?: number, _10?: number, _11?: number, _12?: number, _13?: number, _14?: number, _15?: number): Matrix4
    {
        if (typeof _0 === 'number')
        {
            return this.Set(
                this[0]  * (_0 as number) + this[1]  * (_4 as number) + this[2]  * (_8 as number)  + this[3]  * (_12 as number),
                this[0]  * (_1 as number) + this[1]  * (_5 as number) + this[2]  * (_9 as number)  + this[3]  * (_13 as number),
                this[0]  * (_2 as number) + this[1]  * (_6 as number) + this[2]  * (_10 as number) + this[3]  * (_14 as number),
                this[0]  * (_3 as number) + this[1]  * (_7 as number) + this[2]  * (_11 as number) + this[3]  * (_15 as number),
                this[4]  * (_0 as number) + this[5]  * (_4 as number) + this[6]  * (_8 as number)  + this[7]  * (_12 as number),
                this[4]  * (_1 as number) + this[5]  * (_5 as number) + this[6]  * (_9 as number)  + this[7]  * (_13 as number),
                this[4]  * (_2 as number) + this[5]  * (_6 as number) + this[6]  * (_10 as number) + this[7]  * (_14 as number),
                this[4]  * (_3 as number) + this[5]  * (_7 as number) + this[6]  * (_11 as number) + this[7]  * (_15 as number),
                this[8]  * (_0 as number) + this[9]  * (_4 as number) + this[10] * (_8 as number)  + this[11] * (_12 as number),
                this[8]  * (_1 as number) + this[9]  * (_5 as number) + this[10] * (_9 as number)  + this[11] * (_13 as number),
                this[8]  * (_2 as number) + this[9]  * (_6 as number) + this[10] * (_10 as number) + this[11] * (_14 as number),
                this[8]  * (_3 as number) + this[9]  * (_7 as number) + this[10] * (_11 as number) + this[11] * (_15 as number),
                this[12] * (_0 as number) + this[13] * (_4 as number) + this[14] * (_8 as number)  + this[15] * (_12 as number),
                this[12] * (_1 as number) + this[13] * (_5 as number) + this[14] * (_9 as number)  + this[15] * (_13 as number),
                this[12] * (_2 as number) + this[13] * (_6 as number) + this[14] * (_10 as number) + this[15] * (_14 as number),
                this[12] * (_3 as number) + this[13] * (_7 as number) + this[14] * (_11 as number) + this[15] * (_15 as number)
            )
        }
        else
        {
            return this.Set(
                this[0]  * _0[0] + this[1]  * _0[4] + this[2]  * _0[8]  + this[3]  * _0[12],
                this[0]  * _0[1] + this[1]  * _0[5] + this[2]  * _0[9]  + this[3]  * _0[13],
                this[0]  * _0[2] + this[1]  * _0[6] + this[2]  * _0[10] + this[3]  * _0[14],
                this[0]  * _0[3] + this[1]  * _0[7] + this[2]  * _0[11] + this[3]  * _0[15],
                this[4]  * _0[0] + this[5]  * _0[4] + this[6]  * _0[8]  + this[7]  * _0[12],
                this[4]  * _0[1] + this[5]  * _0[5] + this[6]  * _0[9]  + this[7]  * _0[13],
                this[4]  * _0[2] + this[5]  * _0[6] + this[6]  * _0[10] + this[7]  * _0[14],
                this[4]  * _0[3] + this[5]  * _0[7] + this[6]  * _0[11] + this[7]  * _0[15],
                this[8]  * _0[0] + this[9]  * _0[4] + this[10] * _0[8]  + this[11] * _0[12],
                this[8]  * _0[1] + this[9]  * _0[5] + this[10] * _0[9]  + this[11] * _0[13],
                this[8]  * _0[2] + this[9]  * _0[6] + this[10] * _0[10] + this[11] * _0[14],
                this[8]  * _0[3] + this[9]  * _0[7] + this[10] * _0[11] + this[11] * _0[15],
                this[12] * _0[0] + this[13] * _0[4] + this[14] * _0[8]  + this[15] * _0[12],
                this[12] * _0[1] + this[13] * _0[5] + this[14] * _0[9]  + this[15] * _0[13],
                this[12] * _0[2] + this[13] * _0[6] + this[14] * _0[10] + this[15] * _0[14],
                this[12] * _0[3] + this[13] * _0[7] + this[14] * _0[11] + this[15] * _0[15]
            )
        }
    }
    
    Scale(scaler: number): Matrix4
    {
        this[0]  *= scaler
        this[1]  *= scaler
        this[2]  *= scaler
        this[3]  *= scaler
        this[4]  *= scaler
        this[5]  *= scaler
        this[6]  *= scaler
        this[7]  *= scaler
        this[8]  *= scaler
        this[9]  *= scaler
        this[10] *= scaler
        this[11] *= scaler
        this[12] *= scaler
        this[13] *= scaler
        this[14] *= scaler
        this[15] *= scaler

        return this
    }

    Transpose(): Matrix4
    {
        return this.Set(
            this[0], this[4], this[8],  this[12],
            this[1], this[5], this[9],  this[13],
            this[2], this[6], this[10], this[14],
            this[3], this[7], this[11], this[15]
        )
    }

    Inverse(): Matrix4
    {
        const det = this.Determinant

        if (det !== 0)
        {
            this.Set(
                (
                    this[5] * this[10] * this[15] +
                    this[6] * this[11] * this[13] +
                    this[7] * this[9]  * this[14] -
                    this[5] * this[11] * this[14] -
                    this[6] * this[9]  * this[15] -
                    this[7] * this[10] * this[13]
                ) / det,

                (
                    this[1] * this[11] * this[14] +
                    this[2] * this[9]  * this[15] +
                    this[3] * this[10] * this[13] -
                    this[1] * this[10] * this[15] -
                    this[2] * this[11] * this[13] -
                    this[3] * this[9]  * this[14]
                ) / det,

                (
                    this[1] * this[6]  * this[15] +
                    this[2] * this[7]  * this[13] +
                    this[3] * this[5]  * this[14] -
                    this[1] * this[7]  * this[14] -
                    this[2] * this[5]  * this[15] -
                    this[3] * this[6]  * this[13]
                ) / det,

                (
                    this[1] * this[7]  * this[10] +
                    this[2] * this[5]  * this[11] +
                    this[3] * this[6]  * this[9]  -
                    this[1] * this[6]  * this[11] -
                    this[2] * this[7]  * this[9]  -
                    this[3] * this[5]  * this[10]
                ) / det,


                (
                    this[4] * this[11] * this[14] +
                    this[6] * this[8]  * this[15] +
                    this[7] * this[10] * this[12] -
                    this[4] * this[10] * this[15] -
                    this[6] * this[11] * this[12] -
                    this[7] * this[8]  * this[14]
                ) / det,

                (
                    this[0] * this[10] * this[15] +
                    this[2] * this[11] * this[12] +
                    this[3] * this[8]  * this[14] -
                    this[0] * this[11] * this[14] -
                    this[2] * this[8]  * this[15] -
                    this[3] * this[10] * this[12]
                ) / det,

                (
                    this[0] * this[7]  * this[14] +
                    this[2] * this[4]  * this[15] +
                    this[3] * this[6]  * this[12] -
                    this[0] * this[6]  * this[15] -
                    this[2] * this[7]  * this[12] -
                    this[3] * this[4]  * this[14]
                ) / det,

                (
                    this[0] * this[6]  * this[11] +
                    this[2] * this[7]  * this[8]  +
                    this[3] * this[4]  * this[10] -
                    this[0] * this[7]  * this[10] -
                    this[2] * this[4]  * this[11] -
                    this[3] * this[6]  * this[8]
                ) / det,


                (
                    this[4] * this[9]  * this[15] +
                    this[5] * this[11] * this[12] +
                    this[7] * this[8]  * this[13] -
                    this[4] * this[11] * this[13] -
                    this[5] * this[8]  * this[15] -
                    this[7] * this[9]  * this[12]
                ) / det,

                (
                    this[0] * this[11] * this[13] +
                    this[1] * this[8]  * this[15] +
                    this[3] * this[9]  * this[12] -
                    this[0] * this[9]  * this[15] -
                    this[1] * this[11] * this[12] -
                    this[3] * this[8]  * this[13]
                ) / det,

                (
                    this[0] * this[5]  * this[15] +
                    this[1] * this[7]  * this[12] +
                    this[3] * this[4]  * this[13] -
                    this[0] * this[7]  * this[13] -
                    this[1] * this[4]  * this[15] -
                    this[3] * this[5]  * this[12]
                ) / det,

                (
                    this[0] * this[7]  * this[9]  +
                    this[1] * this[4]  * this[11] +
                    this[3] * this[5]  * this[8]  -
                    this[0] * this[5]  * this[11] -
                    this[1] * this[7]  * this[8]  -
                    this[3] * this[4]  * this[9]
                ) / det,


                (
                    this[4] * this[10] * this[13] +
                    this[5] * this[8]  * this[14] +
                    this[6] * this[9]  * this[12] -
                    this[4] * this[9]  * this[14] -
                    this[5] * this[10] * this[12] -
                    this[6] * this[8]  * this[13]
                ) / det,

                (
                    this[0] * this[9]  * this[14] +
                    this[1] * this[10] * this[12] +
                    this[2] * this[8]  * this[13] -
                    this[0] * this[10] * this[13] -
                    this[1] * this[8]  * this[14] -
                    this[2] * this[9]  * this[12]
                ) / det,

                (
                    this[0] * this[6]  * this[13] +
                    this[1] * this[4]  * this[14] +
                    this[2] * this[5]  * this[12] -
                    this[0] * this[5]  * this[14] -
                    this[1] * this[6]  * this[12] -
                    this[2] * this[4]  * this[13]
                ) / det,

                (
                    this[0] * this[5]  * this[10] +
                    this[1] * this[6]  * this[8]  +
                    this[2] * this[4]  * this[9]  -
                    this[0] * this[6]  * this[9]  -
                    this[1] * this[4]  * this[10] -
                    this[2] * this[5]  * this[8]
                ) / det
            )
        }

        return this
    }

    Zero(): Matrix4
    {
        this[0] = 0
        this[1] = 0
        this[2] = 0
        this[3] = 0
        this[4] = 0
        this[5] = 0
        this[6] = 0
        this[7] = 0
        this[8] = 0
        this[9] = 0
        this[10] = 0
        this[11] = 0
        this[12] = 0
        this[13] = 0
        this[14] = 0
        this[15] = 0

        return this
    }
    
    Identity(): Matrix4
    {
        this[0] = 1
        this[1] = 0
        this[2] = 0
        this[3] = 0
        this[4] = 0
        this[5] = 1
        this[6] = 0
        this[7] = 0
        this[8] = 0
        this[9] = 0
        this[10] = 1
        this[11] = 0
        this[12] = 0
        this[13] = 0
        this[14] = 0
        this[15] = 1

        return this
    }

    Clone(): Matrix4
    {
        return new Matrix4(this)
    }

    Equals(other: Matrix4): boolean
    {
        return this[0] === other[0] &&
            this[1] === other[1] &&
            this[2] === other[2] &&
            this[3] === other[3] &&
            this[4] === other[4] &&
            this[5] === other[5] &&
            this[6] === other[6] &&
            this[7] === other[7] &&
            this[8] === other[8] &&
            this[9] === other[9] &&
            this[10] === other[10] &&
            this[11] === other[11] &&
            this[12] === other[12] &&
            this[13] === other[13] &&
            this[14] === other[14] &&
            this[15] === other[15]
    }
    //#endregion

    //#region Static Properties
    static get Zero()
    {
        return new Matrix4(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        )
    }

    static get Identity()
    {
        return new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }

    public static readonly SIZE: number = 16
    //#endregion
    
    //#region Static Methods
    static Add(
        matrix1_m11: number, matrix1_m12: number, matrix1_m13: number, matrix1_m14: number,
        matrix1_m21: number, matrix1_m22: number, matrix1_m23: number, matrix1_m24: number,
        matrix1_m31: number, matrix1_m32: number, matrix1_m33: number, matrix1_m34: number,
        matrix1_m41: number, matrix1_m42: number, matrix1_m43: number, matrix1_m44: number,

        matrix2_m11: number, matrix2_m12: number, matrix2_m13: number, matrix2_m14: number,
        matrix2_m21: number, matrix2_m22: number, matrix2_m23: number, matrix2_m24: number,
        matrix2_m31: number, matrix2_m32: number, matrix2_m33: number, matrix2_m34: number,
        matrix2_m41: number, matrix2_m42: number, matrix2_m43: number, matrix2_m44: number
    ): Matrix4
    static Add(
        matrix1_m11: number, matrix1_m12: number, matrix1_m13: number, matrix1_m14: number,
        matrix1_m21: number, matrix1_m22: number, matrix1_m23: number, matrix1_m24: number,
        matrix1_m31: number, matrix1_m32: number, matrix1_m33: number, matrix1_m34: number,
        matrix1_m41: number, matrix1_m42: number, matrix1_m43: number, matrix1_m44: number,

        matrix2_m11: number, matrix2_m12: number, matrix2_m13: number, matrix2_m14: number,
        matrix2_m21: number, matrix2_m22: number, matrix2_m23: number, matrix2_m24: number,
        matrix2_m31: number, matrix2_m32: number, matrix2_m33: number, matrix2_m34: number,
        matrix2_m41: number, matrix2_m42: number, matrix2_m43: number, matrix2_m44: number,
        
        out: Matrix4
    ): Matrix4
    static Add(matrix1: Matrix4, matrix2: Matrix4): Matrix4
    static Add(matrix1: Matrix4, matrix2: Matrix4, out: Matrix4): Matrix4
    static Add(array1: Matrix4Array, array2: Matrix4Array): Matrix4
    static Add(array1: Matrix4Array, array2: Matrix4Array, out: Matrix4): Matrix4
    static Add(
         _0: Matrix4 | Matrix4Array | number,  _1: Matrix4 | Matrix4Array | number,  _2?: Matrix4 | number,  _3?: number,
         _4?: number,  _5?: number,  _6?: number,  _7?: number,
         _8?: number,  _9?: number, _10?: number, _11?: number,
        _12?: number, _13?: number, _14?: number, _15?: number,

        _16?: number, _17?: number, _18?: number, _19?: number,
        _20?: number, _21?: number, _22?: number, _23?: number,
        _24?: number, _25?: number, _26?: number, _27?: number,
        _28?: number, _29?: number, _30?: number, _31?: number,
        
        _32?: Matrix4
    ): Matrix4
    {
        const out = _32 ?? _2 instanceof Matrix4 ? _2 as Matrix4 : new Matrix4()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0]  = (_0 as number)  + (_16 as number)
            out[1]  = (_1 as number)  + (_17 as number)
            out[2]  = (_2 as number)  + (_18 as number)
            out[3]  = (_3 as number)  + (_19 as number)
            out[4]  = (_4 as number)  + (_20 as number)
            out[5]  = (_5 as number)  + (_21 as number)
            out[6]  = (_6 as number)  + (_22 as number)
            out[7]  = (_7 as number)  + (_23 as number)
            out[8]  = (_8 as number)  + (_24 as number)
            out[9]  = (_9 as number)  + (_25 as number)
            out[10] = (_10 as number) + (_26 as number)
            out[11] = (_11 as number) + (_27 as number)
            out[12] = (_12 as number) + (_28 as number)
            out[13] = (_13 as number) + (_29 as number)
            out[14] = (_14 as number) + (_30 as number)
            out[15] = (_15 as number) + (_31 as number)
        }
        else
        {
            out[0]  = _0[0]  +  _1[0]
            out[1]  = _0[1]  +  _1[1]
            out[2]  = _0[2]  +  _1[2]
            out[3]  = _0[3]  +  _1[3]
            out[4]  = _0[4]  +  _1[4]
            out[5]  = _0[5]  +  _1[5]
            out[6]  = _0[6]  +  _1[6]
            out[7]  = _0[7]  +  _1[7]
            out[8]  = _0[8]  +  _1[8]
            out[9]  = _0[9]  +  _1[9]
            out[10] = _0[10] + _1[10]
            out[11] = _0[11] + _1[11]
            out[12] = _0[12] + _1[12]
            out[13] = _0[13] + _1[13]
            out[14] = _0[14] + _1[14]
            out[15] = _0[15] + _1[15]
        }

        return out
    }
    
    static Subtract(
        matrix1_m11: number, matrix1_m12: number, matrix1_m13: number, matrix1_m14: number,
        matrix1_m21: number, matrix1_m22: number, matrix1_m23: number, matrix1_m24: number,
        matrix1_m31: number, matrix1_m32: number, matrix1_m33: number, matrix1_m34: number,
        matrix1_m41: number, matrix1_m42: number, matrix1_m43: number, matrix1_m44: number,

        matrix2_m11: number, matrix2_m12: number, matrix2_m13: number, matrix2_m14: number,
        matrix2_m21: number, matrix2_m22: number, matrix2_m23: number, matrix2_m24: number,
        matrix2_m31: number, matrix2_m32: number, matrix2_m33: number, matrix2_m34: number,
        matrix2_m41: number, matrix2_m42: number, matrix2_m43: number, matrix2_m44: number
    ): Matrix4
    static Subtract(
        matrix1_m11: number, matrix1_m12: number, matrix1_m13: number, matrix1_m14: number,
        matrix1_m21: number, matrix1_m22: number, matrix1_m23: number, matrix1_m24: number,
        matrix1_m31: number, matrix1_m32: number, matrix1_m33: number, matrix1_m34: number,
        matrix1_m41: number, matrix1_m42: number, matrix1_m43: number, matrix1_m44: number,

        matrix2_m11: number, matrix2_m12: number, matrix2_m13: number, matrix2_m14: number,
        matrix2_m21: number, matrix2_m22: number, matrix2_m23: number, matrix2_m24: number,
        matrix2_m31: number, matrix2_m32: number, matrix2_m33: number, matrix2_m34: number,
        matrix2_m41: number, matrix2_m42: number, matrix2_m43: number, matrix2_m44: number,
        
        out: Matrix4
    ): Matrix4
    static Subtract(matrix1: Matrix4, matrix2: Matrix4): Matrix4
    static Subtract(matrix1: Matrix4, matrix2: Matrix4, out: Matrix4): Matrix4
    static Subtract(array1: Matrix4Array, array2: Matrix4Array): Matrix4
    static Subtract(array1: Matrix4Array, array2: Matrix4Array, out: Matrix4): Matrix4
    static Subtract(
         _0: Matrix4 | Matrix4Array | number,  _1: Matrix4 | Matrix4Array | number,  _2?: Matrix4 | number,  _3?: number,
         _4?: number,  _5?: number,  _6?: number,  _7?: number,
         _8?: number,  _9?: number, _10?: number, _11?: number,
        _12?: number, _13?: number, _14?: number, _15?: number,

        _16?: number, _17?: number, _18?: number, _19?: number,
        _20?: number, _21?: number, _22?: number, _23?: number,
        _24?: number, _25?: number, _26?: number, _27?: number,
        _28?: number, _29?: number, _30?: number, _31?: number,
        
        _32?: Matrix4
    ): Matrix4
    {
        const out = _32 ?? _2 instanceof Matrix4 ? _2 as Matrix4 : new Matrix4()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0]  = (_0 as number)  - (_16 as number)
            out[1]  = (_1 as number)  - (_17 as number)
            out[2]  = (_2 as number)  - (_18 as number)
            out[3]  = (_3 as number)  - (_19 as number)
            out[4]  = (_4 as number)  - (_20 as number)
            out[5]  = (_5 as number)  - (_21 as number)
            out[6]  = (_6 as number)  - (_22 as number)
            out[7]  = (_7 as number)  - (_23 as number)
            out[8]  = (_8 as number)  - (_24 as number)
            out[9]  = (_9 as number)  - (_25 as number)
            out[10] = (_10 as number) - (_26 as number)
            out[11] = (_11 as number) - (_27 as number)
            out[12] = (_12 as number) - (_28 as number)
            out[13] = (_13 as number) - (_29 as number)
            out[14] = (_14 as number) - (_30 as number)
            out[15] = (_15 as number) - (_31 as number)
        }
        else
        {
            out[0]  = _0[0]  -  _1[0]
            out[1]  = _0[1]  -  _1[1]
            out[2]  = _0[2]  -  _1[2]
            out[3]  = _0[3]  -  _1[3]
            out[4]  = _0[4]  -  _1[4]
            out[5]  = _0[5]  -  _1[5]
            out[6]  = _0[6]  -  _1[6]
            out[7]  = _0[7]  -  _1[7]
            out[8]  = _0[8]  -  _1[8]
            out[9]  = _0[9]  -  _1[9]
            out[10] = _0[10] - _1[10]
            out[11] = _0[11] - _1[11]
            out[12] = _0[12] - _1[12]
            out[13] = _0[13] - _1[13]
            out[14] = _0[14] - _1[14]
            out[15] = _0[15] - _1[15]
        }

        return out
    }
    
    static Multiply(
        matrix1_m11: number, matrix1_m12: number, matrix1_m13: number, matrix1_m14: number,
        matrix1_m21: number, matrix1_m22: number, matrix1_m23: number, matrix1_m24: number,
        matrix1_m31: number, matrix1_m32: number, matrix1_m33: number, matrix1_m34: number,
        matrix1_m41: number, matrix1_m42: number, matrix1_m43: number, matrix1_m44: number,

        matrix2_m11: number, matrix2_m12: number, matrix2_m13: number, matrix2_m14: number,
        matrix2_m21: number, matrix2_m22: number, matrix2_m23: number, matrix2_m24: number,
        matrix2_m31: number, matrix2_m32: number, matrix2_m33: number, matrix2_m34: number,
        matrix2_m41: number, matrix2_m42: number, matrix2_m43: number, matrix2_m44: number
    ): Matrix4
    static Multiply(
        matrix1_m11: number, matrix1_m12: number, matrix1_m13: number, matrix1_m14: number,
        matrix1_m21: number, matrix1_m22: number, matrix1_m23: number, matrix1_m24: number,
        matrix1_m31: number, matrix1_m32: number, matrix1_m33: number, matrix1_m34: number,
        matrix1_m41: number, matrix1_m42: number, matrix1_m43: number, matrix1_m44: number,

        matrix2_m11: number, matrix2_m12: number, matrix2_m13: number, matrix2_m14: number,
        matrix2_m21: number, matrix2_m22: number, matrix2_m23: number, matrix2_m24: number,
        matrix2_m31: number, matrix2_m32: number, matrix2_m33: number, matrix2_m34: number,
        matrix2_m41: number, matrix2_m42: number, matrix2_m43: number, matrix2_m44: number,
        
        out: Matrix4
    ): Matrix4
    static Multiply(matrix1: Matrix4, matrix2: Matrix4): Matrix4
    static Multiply(matrix1: Matrix4, matrix2: Matrix4, out: Matrix4): Matrix4
    static Multiply(array1: Matrix4Array, array2: Matrix4Array): Matrix4
    static Multiply(array1: Matrix4Array, array2: Matrix4Array, out: Matrix4): Matrix4
    static Multiply(
         _0: Matrix4 | Matrix4Array | number,  _1: Matrix4 | Matrix4Array | number,  _2?: Matrix4 | number,  _3?: number,
         _4?: number,  _5?: number,  _6?: number,  _7?: number,
         _8?: number,  _9?: number, _10?: number, _11?: number,
        _12?: number, _13?: number, _14?: number, _15?: number,

        _16?: number, _17?: number, _18?: number, _19?: number,
        _20?: number, _21?: number, _22?: number, _23?: number,
        _24?: number, _25?: number, _26?: number, _27?: number,
        _28?: number, _29?: number, _30?: number, _31?: number,
        
        _32?: Matrix4
    ): Matrix4
    {
        const out = _32 ?? _2 instanceof Matrix4 ? _2 as Matrix4 : new Matrix4()

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            return out.Set(
                (_0 as number)  * (_16 as number) + (_1 as number)  * (_20 as number) + (_2 as number)  * (_24 as number) + (_3 as number)  * (_28 as number),
                (_0 as number)  * (_17 as number) + (_1 as number)  * (_21 as number) + (_2 as number)  * (_25 as number) + (_3 as number)  * (_29 as number),
                (_0 as number)  * (_18 as number) + (_1 as number)  * (_22 as number) + (_2 as number)  * (_26 as number) + (_3 as number)  * (_30 as number),
                (_0 as number)  * (_19 as number) + (_1 as number)  * (_23 as number) + (_2 as number)  * (_27 as number) + (_3 as number)  * (_31 as number),
                (_4 as number)  * (_16 as number) + (_5 as number)  * (_20 as number) + (_6 as number)  * (_24 as number) + (_7 as number)  * (_28 as number),
                (_4 as number)  * (_17 as number) + (_5 as number)  * (_21 as number) + (_6 as number)  * (_25 as number) + (_7 as number)  * (_29 as number),
                (_4 as number)  * (_18 as number) + (_5 as number)  * (_22 as number) + (_6 as number)  * (_26 as number) + (_7 as number)  * (_30 as number),
                (_4 as number)  * (_19 as number) + (_5 as number)  * (_23 as number) + (_6 as number)  * (_27 as number) + (_7 as number)  * (_31 as number),
                (_8 as number)  * (_16 as number) + (_9 as number)  * (_20 as number) + (_10 as number) * (_24 as number) + (_11 as number) * (_28 as number),
                (_8 as number)  * (_17 as number) + (_9 as number)  * (_21 as number) + (_10 as number) * (_25 as number) + (_11 as number) * (_29 as number),
                (_8 as number)  * (_18 as number) + (_9 as number)  * (_22 as number) + (_10 as number) * (_26 as number) + (_11 as number) * (_30 as number),
                (_8 as number)  * (_19 as number) + (_9 as number)  * (_23 as number) + (_10 as number) * (_27 as number) + (_11 as number) * (_31 as number),
                (_12 as number) * (_16 as number) + (_13 as number) * (_20 as number) + (_14 as number) * (_24 as number) + (_15 as number) * (_28 as number),
                (_12 as number) * (_17 as number) + (_13 as number) * (_21 as number) + (_14 as number) * (_25 as number) + (_15 as number) * (_29 as number),
                (_12 as number) * (_18 as number) + (_13 as number) * (_22 as number) + (_14 as number) * (_26 as number) + (_15 as number) * (_30 as number),
                (_12 as number) * (_19 as number) + (_13 as number) * (_23 as number) + (_14 as number) * (_27 as number) + (_15 as number) * (_31 as number)
            )
        }
        else
        {
            return out.Set(
                _0[0]  * _1[0] + _0[1]  * _1[4] + _0[2]  * _1[8]  + _0[3]  * _1[12],
                _0[0]  * _1[1] + _0[1]  * _1[5] + _0[2]  * _1[9]  + _0[3]  * _1[13],
                _0[0]  * _1[2] + _0[1]  * _1[6] + _0[2]  * _1[10] + _0[3]  * _1[14],
                _0[0]  * _1[3] + _0[1]  * _1[7] + _0[2]  * _1[11] + _0[3]  * _1[15],
                _0[4]  * _1[0] + _0[5]  * _1[4] + _0[6]  * _1[8]  + _0[7]  * _1[12],
                _0[4]  * _1[1] + _0[5]  * _1[5] + _0[6]  * _1[9]  + _0[7]  * _1[13],
                _0[4]  * _1[2] + _0[5]  * _1[6] + _0[6]  * _1[10] + _0[7]  * _1[14],
                _0[4]  * _1[3] + _0[5]  * _1[7] + _0[6]  * _1[11] + _0[7]  * _1[15],
                _0[8]  * _1[0] + _0[9]  * _1[4] + _0[10] * _1[8]  + _0[11] * _1[12],
                _0[8]  * _1[1] + _0[9]  * _1[5] + _0[10] * _1[9]  + _0[11] * _1[13],
                _0[8]  * _1[2] + _0[9]  * _1[6] + _0[10] * _1[10] + _0[11] * _1[14],
                _0[8]  * _1[3] + _0[9]  * _1[7] + _0[10] * _1[11] + _0[11] * _1[15],
                _0[12] * _1[0] + _0[13] * _1[4] + _0[14] * _1[8]  + _0[15] * _1[12],
                _0[12] * _1[1] + _0[13] * _1[5] + _0[14] * _1[9]  + _0[15] * _1[13],
                _0[12] * _1[2] + _0[13] * _1[6] + _0[14] * _1[10] + _0[15] * _1[14],
                _0[12] * _1[3] + _0[13] * _1[7] + _0[14] * _1[11] + _0[15] * _1[15]
            )
        }
    }
    
    
    static Scale(scaler: number, scalar: number): Matrix4
    static Scale(scaler: number, scalar: number, out: Matrix4): Matrix4
    static Scale(_0: number, _1: number, _2?: Matrix4): Matrix4
    {
        const out = _2 ?? new Matrix4()

        out[0]  *= _1
        out[1]  *= _1
        out[2]  *= _1
        out[3]  *= _1
        out[4]  *= _1
        out[5]  *= _1
        out[6]  *= _1
        out[7]  *= _1
        out[8]  *= _1
        out[9]  *= _1
        out[10] *= _1
        out[11] *= _1
        out[12] *= _1
        out[13] *= _1
        out[14] *= _1
        out[15] *= _1

        return out
    }
    
    static Transpose(matrix: Matrix4): Matrix4
    static Transpose(matrix: Matrix4, out: Matrix4): Matrix4
    static Transpose(_0: Matrix4, _1?: Matrix4): Matrix4
    {
        const out = _1 ?? new Matrix4()

        return out.Set(
            _0[0], _0[4], _0[8],  _0[12],
            _0[1], _0[5], _0[9],  _0[13],
            _0[2], _0[6], _0[10], _0[14],
            _0[3], _0[7], _0[11], _0[15]
        )
    }
    
    static Inverse(matrix: Matrix4): Matrix4
    static Inverse(matrix: Matrix4, out: Matrix4): Matrix4
    static Inverse(_0: Matrix4, _1?: Matrix4): Matrix4
    {
        const out = _1 ?? new Matrix4()
        const det = _0.Determinant

        if (det !== 0)
        {
            out.Set(
                (
                    _0[5] * _0[10] * _0[15] +
                    _0[6] * _0[11] * _0[13] +
                    _0[7] * _0[9]  * _0[14] -
                    _0[5] * _0[11] * _0[14] -
                    _0[6] * _0[9]  * _0[15] -
                    _0[7] * _0[10] * _0[13]
                ) / det,

                (
                    _0[1] * _0[11] * _0[14] +
                    _0[2] * _0[9]  * _0[15] +
                    _0[3] * _0[10] * _0[13] -
                    _0[1] * _0[10] * _0[15] -
                    _0[2] * _0[11] * _0[13] -
                    _0[3] * _0[9]  * _0[14]
                ) / det,

                (
                    _0[1] * _0[6]  * _0[15] +
                    _0[2] * _0[7]  * _0[13] +
                    _0[3] * _0[5]  * _0[14] -
                    _0[1] * _0[7]  * _0[14] -
                    _0[2] * _0[5]  * _0[15] -
                    _0[3] * _0[6]  * _0[13]
                ) / det,

                (
                    _0[1] * _0[7]  * _0[10] +
                    _0[2] * _0[5]  * _0[11] +
                    _0[3] * _0[6]  * _0[9]  -
                    _0[1] * _0[6]  * _0[11] -
                    _0[2] * _0[7]  * _0[9]  -
                    _0[3] * _0[5]  * _0[10]
                ) / det,


                (
                    _0[4] * _0[11] * _0[14] +
                    _0[6] * _0[8]  * _0[15] +
                    _0[7] * _0[10] * _0[12] -
                    _0[4] * _0[10] * _0[15] -
                    _0[6] * _0[11] * _0[12] -
                    _0[7] * _0[8]  * _0[14]
                ) / det,

                (
                    _0[0] * _0[10] * _0[15] +
                    _0[2] * _0[11] * _0[12] +
                    _0[3] * _0[8]  * _0[14] -
                    _0[0] * _0[11] * _0[14] -
                    _0[2] * _0[8]  * _0[15] -
                    _0[3] * _0[10] * _0[12]
                ) / det,

                (
                    _0[0] * _0[7]  * _0[14] +
                    _0[2] * _0[4]  * _0[15] +
                    _0[3] * _0[6]  * _0[12] -
                    _0[0] * _0[6]  * _0[15] -
                    _0[2] * _0[7]  * _0[12] -
                    _0[3] * _0[4]  * _0[14]
                ) / det,

                (
                    _0[0] * _0[6]  * _0[11] +
                    _0[2] * _0[7]  * _0[8]  +
                    _0[3] * _0[4]  * _0[10] -
                    _0[0] * _0[7]  * _0[10] -
                    _0[2] * _0[4]  * _0[11] -
                    _0[3] * _0[6]  * _0[8]
                ) / det,


                (
                    _0[4] * _0[9]  * _0[15] +
                    _0[5] * _0[11] * _0[12] +
                    _0[7] * _0[8]  * _0[13] -
                    _0[4] * _0[11] * _0[13] -
                    _0[5] * _0[8]  * _0[15] -
                    _0[7] * _0[9]  * _0[12]
                ) / det,

                (
                    _0[0] * _0[11] * _0[13] +
                    _0[1] * _0[8]  * _0[15] +
                    _0[3] * _0[9]  * _0[12] -
                    _0[0] * _0[9]  * _0[15] -
                    _0[1] * _0[11] * _0[12] -
                    _0[3] * _0[8]  * _0[13]
                ) / det,

                (
                    _0[0] * _0[5]  * _0[15] +
                    _0[1] * _0[7]  * _0[12] +
                    _0[3] * _0[4]  * _0[13] -
                    _0[0] * _0[7]  * _0[13] -
                    _0[1] * _0[4]  * _0[15] -
                    _0[3] * _0[5]  * _0[12]
                ) / det,

                (
                    _0[0] * _0[7]  * _0[9]  +
                    _0[1] * _0[4]  * _0[11] +
                    _0[3] * _0[5]  * _0[8]  -
                    _0[0] * _0[5]  * _0[11] -
                    _0[1] * _0[7]  * _0[8]  -
                    _0[3] * _0[4]  * _0[9]
                ) / det,


                (
                    _0[4] * _0[10] * _0[13] +
                    _0[5] * _0[8]  * _0[14] +
                    _0[6] * _0[9]  * _0[12] -
                    _0[4] * _0[9]  * _0[14] -
                    _0[5] * _0[10] * _0[12] -
                    _0[6] * _0[8]  * _0[13]
                ) / det,

                (
                    _0[0] * _0[9]  * _0[14] +
                    _0[1] * _0[10] * _0[12] +
                    _0[2] * _0[8]  * _0[13] -
                    _0[0] * _0[10] * _0[13] -
                    _0[1] * _0[8]  * _0[14] -
                    _0[2] * _0[9]  * _0[12]
                ) / det,

                (
                    _0[0] * _0[6]  * _0[13] +
                    _0[1] * _0[4]  * _0[14] +
                    _0[2] * _0[5]  * _0[12] -
                    _0[0] * _0[5]  * _0[14] -
                    _0[1] * _0[6]  * _0[12] -
                    _0[2] * _0[4]  * _0[13]
                ) / det,

                (
                    _0[0] * _0[5]  * _0[10] +
                    _0[1] * _0[6]  * _0[8]  +
                    _0[2] * _0[4]  * _0[9]  -
                    _0[0] * _0[6]  * _0[9]  -
                    _0[1] * _0[4]  * _0[10] -
                    _0[2] * _0[5]  * _0[8]
                ) / det
            )
        }

        return out
    }
    
    static MultiplyVector(matrix: Matrix4, xyzw: number): Vector4
    static MultiplyVector(matrix: Matrix4, xyzw: number, out: Vector4): Vector4
    static MultiplyVector(matrix: Matrix4, x: number, y: number, z: number, w: number): Vector4
    static MultiplyVector(matrix: Matrix4, x: number, y: number, z: number, w: number, out: Vector4): Vector4
    static MultiplyVector(matrix: Matrix4, vector: Vector4): Vector4
    static MultiplyVector(matrix: Matrix4, vector: Vector4, out: Vector4): Vector4
    static MultiplyVector(matrix: Matrix4, array: Matrix4Array): Vector4
    static MultiplyVector(matrix: Matrix4, array: Matrix4Array, out: Vector4): Vector4
    static MultiplyVector(_0: Matrix4, _1: Vector4 | Matrix4Array | number, _2?: Vector4 | number, _3?: number, _4?: number, _5?: Vector4): Vector4
    {
        const out = _5 ?? _2 instanceof Vector4 ? _2 as Vector4 : new Vector4()
        const vec = typeof _1 === 'number'
            ? [_1, _2 as number ?? _1, _3 as number ?? _1, _4 as number ?? _1]
            : _1

        return out.Set(
            (_0[0]  * vec[0]) + (_0[1]  * vec[1]) + (_0[2]  * vec[2]) + (_0[3]  * vec[3]),
            (_0[4]  * vec[0]) + (_0[5]  * vec[1]) + (_0[6]  * vec[2]) + (_0[7]  * vec[3]),
            (_0[8]  * vec[0]) + (_0[9]  * vec[1]) + (_0[10] * vec[2]) + (_0[11] * vec[3]),
            (_0[12] * vec[0]) + (_0[13] * vec[1]) + (_0[14] * vec[2]) + (_0[15] * vec[3])
        )
    }

    static RotationMatrixAroundAxis(xyz: number, angle: number): Matrix4
    static RotationMatrixAroundAxis(xyz: number, angle: number, out: Matrix4): Matrix4
    static RotationMatrixAroundAxis(x: number, y: number, z: number, angle: number): Matrix4
    static RotationMatrixAroundAxis(x: number, y: number, z: number, angle: number, out: Matrix4): Matrix4
    static RotationMatrixAroundAxis(axis: Vector3Array, angle: number): Matrix4
    static RotationMatrixAroundAxis(axis: Vector3Array, angle: number, out: Matrix4): Matrix4
    static RotationMatrixAroundAxis(axis: Vector3, angle: number): Matrix4
    static RotationMatrixAroundAxis(axis: Vector3, angle: number, out: Matrix4): Matrix4
    static RotationMatrixAroundAxis(_0: Vector3 | Vector3Array | number, _1: number, _2?: Matrix4 | number, _3?: number, _4?: Matrix4): Matrix4
    {
        const out = _4 ?? _2 instanceof Matrix4 ? _2 as Matrix4 : new Matrix4()
        const axis = typeof _0 === 'number'
            ? (_3 ? [_0, _1 as number, _2 as number] : [_0, _0, _0])
            : _0
        const rotation = typeof _0 === 'number'
            ? _3 ?? _1
            : _1

        const angle = radian(rotation)
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        const inv_cos = 1 - cos

        return out.Set(
            (cos) + (axis[0] * axis[0] * inv_cos),
            (axis[0] * axis[1] * inv_cos) - (axis[2] * sin),
            (axis[0] * axis[2] * inv_cos) + (axis[1] * sin),
            0,

            (axis[1] * axis[0] * inv_cos) + (axis[2] * sin),
            (cos) + (axis[1] * axis[1] * inv_cos),
            (axis[1] * axis[2] * inv_cos) - (axis[0] * sin),
            0,

            (axis[2] * axis[0] * inv_cos) - (axis[1] * sin),
            (axis[2] * axis[1] * inv_cos) + (axis[0] * sin),
            (cos) + (axis[2] * axis[2] * cos),
            0,

            0,0,0,1
        )
    }
    
    static TranslationMatrix(xyz: number): Matrix4
    static TranslationMatrix(xyz: number, out: Matrix4): Matrix4
    static TranslationMatrix(x: number, y: number, z: number): Matrix4
    static TranslationMatrix(x: number, y: number, z: number, out: Matrix4): Matrix4
    static TranslationMatrix(xyz: Vector3): Matrix4
    static TranslationMatrix(xyz: Vector3, out: Matrix4): Matrix4
    static TranslationMatrix(xyz: Vector3Array): Matrix4
    static TranslationMatrix(xyz: Vector3Array, out: Matrix4): Matrix4
    static TranslationMatrix(_0: Vector3 | Vector3Array | number, _1?: Matrix4 | number, _2?: number, _3?: Matrix4): Matrix4
    {
        const out = _3 ?? _1 instanceof Matrix4 ? _1 as Matrix4 : new Matrix4()
        const translation = typeof _0 === 'number'
            ? [_0, _1 as number ?? _0, _2 as number ?? _0]
            : _0
        
        return out.Set(
            1, 0, 0, translation[0],
            0, 1, 0, translation[1],
            0, 0, 1, translation[2],
            0, 0, 0, 1
        )
    }

    static RotationMatrix(xyz: number): Matrix4
    static RotationMatrix(xyz: number, out: Matrix4): Matrix4
    static RotationMatrix(x: number, y: number, z: number): Matrix4
    static RotationMatrix(x: number, y: number, z: number, out: Matrix4): Matrix4
    static RotationMatrix(xyz: Vector3): Matrix4
    static RotationMatrix(xyz: Vector3, out: Matrix4): Matrix4
    static RotationMatrix(xyz: Vector3Array): Matrix4
    static RotationMatrix(xyz: Vector3Array, out: Matrix4): Matrix4
    static RotationMatrix(_0: Vector3 | Vector3Array | number, _1?: Matrix4 | number, _2?: number, _3?: Matrix4): Matrix4
    {
        const out = _3 ?? _1 instanceof Matrix4 ? _1 as Matrix4 : new Matrix4()
        const rotation = typeof _0 === 'number'
            ? [_0, _1 as number ?? _0, _2 as number ?? _0]
            : _0

        const x = radian(rotation[0])
        const y = radian(rotation[1])
        const z = radian(rotation[2])
    
        const sin_x = Math.sin(x)
        const sin_y = Math.sin(y)
        const sin_z = Math.sin(z)
    
        const cos_x = Math.cos(x)
        const cos_y = Math.cos(y)
        const cos_z = Math.cos(z)
        
        return out.Set(
            cos_y * cos_z,
            cos_y * sin_z,
            -sin_y,
            0,

            sin_x * sin_y * cos_z - cos_x * sin_z,
            sin_x * sin_y * sin_z + cos_x * cos_z,
            sin_x * cos_y,
            0,

            cos_x * sin_y * cos_z + sin_x * sin_z,
            cos_x * sin_y * sin_z - sin_x * cos_z,
            cos_x * cos_y,
            0,

            0,0,0,1
        )
    }

    static ScaleMatrix(xyz: number): Matrix4
    static ScaleMatrix(xyz: number, out: Matrix4): Matrix4
    static ScaleMatrix(x: number, y: number, z: number): Matrix4
    static ScaleMatrix(x: number, y: number, z: number, out: Matrix4): Matrix4
    static ScaleMatrix(xyz: Vector3): Matrix4
    static ScaleMatrix(xyz: Vector3, out: Matrix4): Matrix4
    static ScaleMatrix(xyz: Vector3Array): Matrix4
    static ScaleMatrix(xyz: Vector3Array, out: Matrix4): Matrix4
    static ScaleMatrix(_0: Vector3 | Vector3Array | number, _1?: Matrix4 | number, _2?: number, _3?: Matrix4): Matrix4
    {
        const out = _3 ?? _1 instanceof Matrix4 ? _1 as Matrix4 : new Matrix4()
        const scale = typeof _0 === 'number'
            ? [_0, _1 as number ?? _0, _2 as number ?? _0]
            : _0
        
        return out.Set(
            scale[0],        0,        0, 0,
                   0, scale[1],        0, 0,
                   0,        0, scale[2], 0,
                   0,        0,        0, 1
        )
    }

    static TransformationMatrix(translation: Vector3, rotation: Vector3, scale: Vector3): Matrix4
    static TransformationMatrix(translation: Vector3, rotation: Vector3, scale: Vector3, out: Matrix4): Matrix4
    static TransformationMatrix(translation: Vector3Array, rotation: Vector3Array, scale: Vector3Array): Matrix4
    static TransformationMatrix(translation: Vector3Array, rotation: Vector3Array, scale: Vector3Array, out: Matrix4): Matrix4
    static TransformationMatrix(_0: Vector3 | Vector3Array, _1: Vector3 | Vector3Array, _2: Vector3 | Vector3Array, _3?: Matrix4): Matrix4
    {
        const out = _3 ?? _1 instanceof Matrix4 ? _3 as Matrix4 : new Matrix4()

        Matrix4.ScaleMatrix(_2 as Vector3Array, out)
        Matrix4.Multiply(Matrix4.RotationMatrix(_1 as Vector3Array), out, out)
        Matrix4.Multiply(Matrix4.TranslationMatrix(_0 as Vector3Array), out, out)

        return out
    }

    static OrthographicProjection(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number, tiltX: number, tiltY: number): Matrix4
    static OrthographicProjection(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number, tiltX: number, tiltY: number, out: Matrix4): Matrix4
    static OrthographicProjection(min: Vector3, max: Vector3, tilt: Vector2): Matrix4
    static OrthographicProjection(min: Vector3, max: Vector3, tilt: Vector2, out: Matrix4): Matrix4
    static OrthographicProjection(min: Vector3Array, max: Vector3Array, tilt: Vector2Array): Matrix4
    static OrthographicProjection(min: Vector3Array, max: Vector3Array, tilt: Vector2Array, out: Matrix4): Matrix4
    static OrthographicProjection(_0: Vector3 | Vector3Array | number, _1: Vector3 | Vector3Array | number, _2: Vector2 | Vector2Array | number, _3?: Matrix4 | number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: Matrix4): Matrix4
    {
        const out = _8 ? _8 : _3 instanceof Matrix4 ? _3 as Matrix4 : new Matrix4()
        let theta: number
        let phi: number
        let left: number
        let right: number
        let top: number
        let bottom: number
        let near: number
        let far: number

        if (typeof _0 === 'number' || typeof _1 === 'number' || typeof _2 === 'number')
        {
            theta = cot(radian(_6 ?? 0))
            phi = cot(radian(_7 ?? 0))

            left = _0 as number
            bottom = _1 as number
            near = _2 as number
            right = _3 as number
            top = _4 as number
            far = _5 as number
        }
        else
        {
            theta = cot(radian(_2[0] ?? 0))
            phi = cot(radian(_2[1] ?? 0))

            left = _0[0]
            bottom = _0[1]
            near = _0[2]
            right = _1[0]
            top = _1[1]
            far = _1[2]
        }

        theta = clean(theta)
        phi = clean(phi)

        left -= near * theta
        right -= near * theta
        top -= near * phi
        bottom -= near * phi
        const width = right - left
        const height = top - bottom
        const depth = far - near

        return out.Set
        (
            2 / width,
            0,
            0,
            0,

            0,
            2 / (top - bottom),
            0,
            0,
                        
            theta,
            phi,
            -2 / (far - near),
            0,


            -(left + right) / width,
            -(top + bottom) / height,
            -(far + near) / depth,
            1
        )
    }
    
    static OrthographicProjectionMatrix(xyz: number): Matrix4
    static OrthographicProjectionMatrix(xyz: number, out: Matrix4): Matrix4
    static OrthographicProjectionMatrix(width: number, height: number, depth: number): Matrix4
    static OrthographicProjectionMatrix(width: number, height: number, depth: number, out: Matrix4): Matrix4
    static OrthographicProjectionMatrix(_0: number, _1?: number | Matrix4, _2?: number, _3?: Matrix4): Matrix4
    {
        const out = _3 ? _3 : _1 instanceof Matrix4 ? _1 : new Matrix4()
        let height: number
        let width: number
        let depth: number

        if (typeof _1 === 'number')
        {
            width = _0 as number
            height = _1 as number
            depth = _2 as number
        }
        else
        {
            width = _0
            height = _0
            depth = _0
        }

        return out.Set(
            2 / width,          0,          0, 0,
                    0, 2 / height,          0, 0,
                    0,          0,  2 / depth, 0,
                    0,          0,          0, 1
        )
    }

    static PerspectiveProjectionMatrix(nearClippingPlane: number, farClippingPlane: number, fieldOfView: number, aspectRatio: number): Matrix4
    static PerspectiveProjectionMatrix(nearClippingPlane: number, farClippingPlane: number, fieldOfView: number, aspectRatio: number, out: Matrix4): Matrix4
    static PerspectiveProjectionMatrix(_0: number, _1: number, _2: number, _3: number, _4?: Matrix4): Matrix4
    {
        const out   = _4 ?? new Matrix4()
        const near  = _0
        const far   = _1
        const top   = near * Math.tan(radian(_2) / 2)
        const right = top * _3
        const depth = far - near

        return out.Set
        (
            near / right,          0,                         0,                         0,
                       0, near / top,                         0,                         0,
                       0,          0,     -(far + near) / depth, -(2 * far * near) / depth,
                       0,          0,                        -1,                         0
        )
    }

    static LookAt(forward: Vector3, right: Vector3, up: Vector3): Matrix4
    static LookAt(forward: Vector3, right: Vector3, up: Vector3, out: Matrix4): Matrix4
    static LookAt(forward: Vector3Array, right: Vector3Array, up: Vector3Array): Matrix4
    static LookAt(forward: Vector3Array, right: Vector3Array, up: Vector3Array, out: Matrix4): Matrix4
    static LookAt(forwardX: number, forwardY: number, forwardZ: number, rightX: number, rightY: number, rightZ: number, upX: number, upY: number, upZ: number): Matrix4
    static LookAt(forwardX: number, forwardY: number, forwardZ: number, rightX: number, rightY: number, rightZ: number, upX: number, upY: number, upZ: number, out: Matrix4): Matrix4
    static LookAt(_0: Vector3 | Vector3Array | number, _1: Vector3 | Vector3Array | number, _2: Vector3 | Vector3Array | number, _3?: Matrix4 | number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number, _9?: Matrix4): Matrix4
    {
        const out = _9 ? _9 : _3 instanceof Matrix4 ? _3 as Matrix4 : new Matrix4()

        if (typeof _0 === 'number' || typeof _1 === 'number' || typeof _2 === 'number')
        {
            out[0]  = _3 as number
            out[1]  = _4 as number
            out[2]  = _5 as number

            out[4]  = _6 as number
            out[5]  = _7 as number
            out[6]  = _8 as number
            
            out[8]  = _0 as number
            out[9]  = _1 as number
            out[10] = _2 as number
        }
        else
        {
            out[0]  = _1[0]
            out[1]  = _1[1]
            out[2]  = _1[2]

            out[4]  = _2[0]
            out[5]  = _2[1]
            out[6]  = _2[2]
            
            out[8]  = _0[0]
            out[9]  = _0[1]
            out[10] = _0[2]
        }
        
        return out
    }

    static LookAtMatrix(eye: Vector3, target: Vector3, up: Vector3): Matrix4
    static LookAtMatrix(eye: Vector3, target: Vector3, up: Vector3, out: Matrix4): Matrix4
    static LookAtMatrix(eye: Vector3Array, target: Vector3Array, up: Vector3Array): Matrix4
    static LookAtMatrix(eye: Vector3Array, target: Vector3Array, up: Vector3Array, out: Matrix4): Matrix4
    static LookAtMatrix(eyeX: number, eyeY: number, eyeZ: number, targetX: number, targetY: number, targetZ: number, upX: number, upY: number, upZ: number): Matrix4
    static LookAtMatrix(eyeX: number, eyeY: number, eyeZ: number, targetX: number, targetY: number, targetZ: number, upX: number, upY: number, upZ: number, out: Matrix4): Matrix4
    static LookAtMatrix(_0: Vector3 | Vector3Array | number, _1: Vector3 | Vector3Array | number, _2: Vector3 | Vector3Array | number, _3?: Matrix4 | number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number, _9?: Matrix4): Matrix4
    {
        const out = _9 ? _9 : _3 instanceof Matrix4 ? _3 as Matrix4 : new Matrix4()
        const eye = new Vector3()
        const target = new Vector3()
        const up = new Vector3()

        if (typeof _0 === 'number' || typeof _1 === 'number' || typeof _2 === 'number')
        {
            eye.Set(_0 as number, _1 as number, _2 as number)
            target.Set(_3 as number, _4 as number, _5 as number)
            up.Set(_6 as number, _7 as number, _8 as number)
        }
        else
        {
            eye.Set(_0 as Vector3Array)
            target.Set(_1 as Vector3Array)
            up.Set(_2 as Vector3Array)
        }

        const zAxis = Vector3.Subtract(target, eye).Normalize()
        const xAxis = Vector3.Cross(up, zAxis).Normalize()
        const yAxis = Vector3.Cross(zAxis, xAxis).Normalize()

        return out.Set(
            xAxis[0], xAxis[1], xAxis[2], 0,
            yAxis[0], yAxis[1], yAxis[2], 0,
            zAxis[0], zAxis[1], zAxis[2], 0,
            eye[0], eye[1], eye[2], 1
        ).Transpose()
        // return out.Set(
        //     xAxis[0], xAxis[1], xAxis[2], -xAxis.Dot(eye),
        //     yAxis[0], yAxis[1], yAxis[2], -yAxis.Dot(eye),
        //     zAxis[0], zAxis[1], zAxis[2], -zAxis.Dot(eye),
        //            0,        0,        0,               1
        // )
    }
    //#endregion
}
