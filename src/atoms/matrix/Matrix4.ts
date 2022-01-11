import { clean } from '../helpers/Math'

export class Matrix4 extends Float32Array
{
    //#region Properties
    get M11(): number
    { 
        return this[0]
    }

    set M11(m11: number)
    {
        this[0] = clean(m11)
    }

    get M12(): number
    { 
        return this[1]
    }

    set M12(m12: number)
    {
        this[1] = clean(m12)
    }

    get M13(): number
    { 
        return this[2]
    }

    set M13(m13: number)
    {
        this[2] = clean(m13)
    }

    get M14(): number
    { 
        return this[3]
    }

    set M14(m14: number)
    {
        this[3] = clean(m14)
    }

    get M21(): number
    { 
        return this[4]
    }

    set M21(m21: number)
    {
        this[4] = clean(m21)
    }

    get M22(): number
    { 
        return this[5]
    }

    set M22(m22: number)
    {
        this[5] = clean(m22)
    }

    get M23(): number
    { 
        return this[6]
    }

    set M23(m23: number)
    {
        this[6] = clean(m23)
    }

    get M24(): number
    { 
        return this[7]
    }

    set M24(m24: number)
    {
        this[7] = clean(m24)
    }

    get M31(): number
    { 
        return this[8]
    }

    set M31(m31: number)
    {
        this[8] = clean(m31)
    }

    get M32(): number
    { 
        return this[9]
    }

    set M32(m32: number)
    {
        this[9] = clean(m32)
    }

    get M33(): number
    { 
        return this[10]
    }

    set M33(m33: number)
    {
        this[10] = clean(m33)
    }

    get M34(): number
    { 
        return this[11]
    }

    set M34(m34: number)
    {
        this[11] = clean(m34)
    }

    get M41(): number
    { 
        return this[12]
    }

    set M41(m41: number)
    {
        this[12] = clean(m41)
    }    

    get M42(): number
    { 
        return this[13]
    }

    set M42(m42: number)
    {
        this[13] = clean(m42)
    }

    get M43(): number
    { 
        return this[14]
    }
    
    set M43(m43: number)
    {
        this[14] = clean(m43)
    }

    get M44(): number
    { 
        return this[15]
    }

    set M44(m44: number)
    {
        this[15] = clean(m44)
    }

    get Determinant(): number
    {
        return clean(
            this.M11 * this.M22 * this.M33 * this.M44 +
            this.M11 * this.M23 * this.M34 * this.M42 +
            this.M11 * this.M24 * this.M32 * this.M43 +
            this.M12 * this.M21 * this.M34 * this.M43 +
            this.M12 * this.M23 * this.M31 * this.M44 +
            this.M12 * this.M24 * this.M33 * this.M41 +
            this.M13 * this.M21 * this.M32 * this.M44 +
            this.M13 * this.M22 * this.M34 * this.M41 +
            this.M13 * this.M24 * this.M31 * this.M42 +
            this.M14 * this.M21 * this.M33 * this.M42 +
            this.M14 * this.M22 * this.M31 * this.M43 +
            this.M14 * this.M23 * this.M32 * this.M41 -
            this.M11 * this.M22 * this.M34 * this.M43 -
            this.M11 * this.M23 * this.M32 * this.M44 -
            this.M11 * this.M24 * this.M33 * this.M42 -
            this.M12 * this.M21 * this.M33 * this.M44 -
            this.M12 * this.M23 * this.M34 * this.M41 -
            this.M12 * this.M24 * this.M31 * this.M43 -
            this.M13 * this.M21 * this.M34 * this.M42 -
            this.M13 * this.M22 * this.M31 * this.M44 -
            this.M13 * this.M24 * this.M32 * this.M41 -
            this.M14 * this.M21 * this.M32 * this.M43 -
            this.M14 * this.M22 * this.M33 * this.M41 -
            this.M14 * this.M23 * this.M31 * this.M42
        )  
    }
    //#endregion

    //#region Methods
    constructor()
    constructor(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number)
    constructor(thisrix: Matrix4)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(...m: number[])
    constructor(m11?: number | Float32Array | number[] , m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number)
    {
        super(16)

        if (m11 !== undefined)
        {
            if (typeof m11 === 'number')
            {
                this.Set(
                    m11, m12!, m13!, m14!,
                    m21!, m22!, m23!, m24!,
                    m31!, m32!, m33!, m34!,
                    m41!, m42!, m43!, m44!
                )
            }
            else 
            {
                this.Set([ ...m11 ])
            }
        }
    }

    Set(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    Set(array: Float32Array): Matrix4
    Set(array: number[]): Matrix4
    Set(m11: number | Float32Array | number[], m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4
    {
        [ 
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] = Destructure(
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        )

        this.M11 = m11
        this.M12 = m12
        this.M13 = m13
        this.M14 = m14

        this.M21 = m21
        this.M22 = m22
        this.M23 = m23
        this.M24 = m24

        this.M31 = m31
        this.M32 = m32
        this.M33 = m33
        this.M34 = m34

        this.M41 = m41
        this.M42 = m42
        this.M43 = m43
        this.M44 = m44

        return this
    }

    Sum(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    Sum(array: Float32Array): Matrix4
    Sum(array: number[]): Matrix4
    Sum(m11: number | Float32Array | number[], m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4
    {
        [ 
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] = Destructure(
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        )

        this.M11 += m11
        this.M12 += m12
        this.M13 += m13
        this.M14 += m14

        this.M21 += m21
        this.M22 += m22
        this.M23 += m23
        this.M24 += m24

        this.M31 += m31
        this.M32 += m32
        this.M33 += m33
        this.M34 += m34

        this.M41 += m41
        this.M42 += m42
        this.M43 += m43
        this.M44 += m44

        return this
    }

    Mult(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    Mult(array: Float32Array): Matrix4
    Mult(array: number[]): Matrix4
    Mult(m11: number | Float32Array | number[], m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4
    {
        [ 
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] = Destructure(
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        )

        return this.Set(
            this.M11 * m11 + this.M12 * m21 + this.M13 * m31 + this.M14 * m41,
            this.M11 * m12 + this.M12 * m22 + this.M13 * m32 + this.M14 * m42,
            this.M11 * m13 + this.M12 * m23 + this.M13 * m33 + this.M14 * m43,
            this.M11 * m14 + this.M12 * m24 + this.M13 * m34 + this.M14 * m44,

            this.M21 * m11 + this.M22 * m21 + this.M23 * m31 + this.M24 * m41,
            this.M21 * m12 + this.M22 * m22 + this.M23 * m32 + this.M24 * m42,
            this.M21 * m13 + this.M22 * m23 + this.M23 * m33 + this.M24 * m43,
            this.M21 * m14 + this.M22 * m24 + this.M23 * m34 + this.M24 * m44,

            this.M31 * m11 + this.M32 * m21 + this.M33 * m31 + this.M34 * m41,
            this.M31 * m12 + this.M32 * m22 + this.M33 * m32 + this.M34 * m42,
            this.M31 * m13 + this.M32 * m23 + this.M33 * m33 + this.M34 * m43,
            this.M31 * m14 + this.M32 * m24 + this.M33 * m34 + this.M34 * m44,
        
            this.M41 * m11 + this.M42 * m21 + this.M43 * m31 + this.M44 * m41,
            this.M41 * m12 + this.M42 * m22 + this.M43 * m32 + this.M44 * m42,
            this.M41 * m13 + this.M42 * m23 + this.M43 * m33 + this.M44 * m43,
            this.M41 * m14 + this.M42 * m24 + this.M43 * m34 + this.M44 * m44
        )
    }
    
    Scale(scaler: number): Matrix4
    {
        this.M11 *= scaler
        this.M12 *= scaler
        this.M13 *= scaler
        this.M14 *= scaler

        this.M21 *= scaler
        this.M22 *= scaler
        this.M23 *= scaler
        this.M24 *= scaler

        this.M31 *= scaler
        this.M32 *= scaler
        this.M33 *= scaler
        this.M34 *= scaler

        this.M41 *= scaler
        this.M42 *= scaler
        this.M43 *= scaler
        this.M44 *= scaler

        return this
    }

    Transpose(): Matrix4
    {
        return this.Set(
            this.M11, this.M21, this.M31, this.M41,
            this.M12, this.M22, this.M32, this.M42,
            this.M13, this.M23, this.M33, this.M43,
            this.M14, this.M24, this.M34, this.M44
        )
    }

    Inverse(): Matrix4
    {
        var det = this.Determinant

        if (det !== 0)
        {
            this.Set(
                (this.M22 * this.M33 * this.M44 +
                this.M23 * this.M34 * this.M42 +
                this.M24 * this.M32 * this.M43 -
                this.M22 * this.M34 * this.M43 -
                this.M23 * this.M32 * this.M44 -
                this.M24 * this.M33 * this.M42) / det,

                (this.M12 * this.M34 * this.M43 +
                this.M13 * this.M32 * this.M44 +
                this.M14 * this.M33 * this.M42 -
                this.M12 * this.M33 * this.M44 -
                this.M13 * this.M34 * this.M42 -
                this.M14 * this.M32 * this.M43) / det,

                (this.M12 * this.M23 * this.M44 +
                this.M13 * this.M24 * this.M42 +
                this.M14 * this.M22 * this.M43 -
                this.M12 * this.M24 * this.M43 -
                this.M13 * this.M22 * this.M44 -
                this.M14 * this.M23 * this.M42) / det,

                (this.M12 * this.M24 * this.M33 +
                this.M13 * this.M22 * this.M34 +
                this.M14 * this.M23 * this.M32 -
                this.M12 * this.M23 * this.M34 -
                this.M13 * this.M24 * this.M32 -
                this.M14 * this.M22 * this.M33) / det,


                (this.M21 * this.M34 * this.M43 +
                this.M23 * this.M31 * this.M44 +
                this.M24 * this.M33 * this.M41 -
                this.M21 * this.M33 * this.M44 -
                this.M23 * this.M34 * this.M41 -
                this.M24 * this.M31 * this.M43) / det,

                (this.M11 * this.M33 * this.M44 +
                this.M13 * this.M34 * this.M41 +
                this.M14 * this.M31 * this.M43 -
                this.M11 * this.M34 * this.M43 -
                this.M13 * this.M31 * this.M44 -
                this.M14 * this.M33 * this.M41) / det,

                (this.M11 * this.M24 * this.M43 +
                this.M13 * this.M21 * this.M44 +
                this.M14 * this.M23 * this.M41 -
                this.M11 * this.M23 * this.M44 -
                this.M13 * this.M24 * this.M41 -
                this.M14 * this.M21 * this.M43) / det,

                (this.M11 * this.M23 * this.M34 +
                this.M13 * this.M24 * this.M31 +
                this.M14 * this.M21 * this.M33 -
                this.M11 * this.M24 * this.M33 -
                this.M13 * this.M21 * this.M34 -
                this.M14 * this.M23 * this.M31) / det,


                (this.M21 *  this.M32 * this.M44 +
                this.M22 * this.M34 * this.M41 +
                this.M24 * this.M31 * this.M42 -
                this.M21 * this.M34 * this.M42 -
                this.M22 * this.M31 * this.M44 -
                this.M24 * this.M32 * this.M41) / det,

                (this.M11 * this.M34 * this.M42 +
                this.M12 * this.M31 * this.M44 +
                this.M14 * this.M32 * this.M41 -
                this.M11 * this.M32 * this.M44 -
                this.M12 * this.M34 * this.M41 -
                this.M14 * this.M31 * this.M42) / det,

                (this.M11 * this.M22 * this.M44 +
                this.M12 * this.M24 * this.M41 +
                this.M14 * this.M21 * this.M42 -
                this.M11 * this.M24 * this.M42 -
                this.M12 * this.M21 * this.M44 -
                this.M14 * this.M22 * this.M41) / det,

                (this.M11 * this.M24 * this.M32 +
                this.M12 * this.M21 * this.M34 +
                this.M14 * this.M22 * this.M31 -
                this.M11 * this.M22 * this.M34 -
                this.M12 * this.M24 * this.M31 -
                this.M14 * this.M21 * this.M32) / det,


                (this.M21 * this.M33 * this.M42 +
                this.M22 * this.M31 * this.M43 +
                this.M23 * this.M32 * this.M41 -
                this.M21 * this.M32 * this.M43 -
                this.M22 * this.M33 * this.M41 -
                this.M23 * this.M31 * this.M42) / det,

                (this.M11 * this.M32 * this.M43 +
                this.M12 * this.M33 * this.M41 +
                this.M13 * this.M31 * this.M42 -
                this.M11 * this.M33 * this.M42 -
                this.M12 * this.M31 * this.M43 -
                this.M13 * this.M32 * this.M41) / det,

                (this.M11 * this.M23 * this.M42 +
                this.M12 * this.M21 * this.M43 +
                this.M13 * this.M22 * this.M41 -
                this.M11 * this.M22 * this.M43 -
                this.M12 * this.M23 * this.M41 -
                this.M13 * this.M21 * this.M42) / det,

                (this.M11 * this.M22 * this.M33 +
                this.M12 * this.M23 * this.M31 +
                this.M13 * this.M21 * this.M32 -
                this.M11 * this.M23 * this.M32 -
                this.M12 * this.M21 * this.M33 -
                this.M13 * this.M22 * this.M31) / det
            )
        }

        return this
    }

    Identity(): Matrix4
    {
        return this.Set(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }

    Clone(): Matrix4
    {
        return new Matrix4(this)
    }

    override toString(): string
    {
        return `[ ${(this.M11 < 0 ? '' : ' ') + this.M11.toFixed(3)}  ][ ${(this.M12 < 0 ? '' : ' ') + this.M12.toFixed(3)}  ][ ${(this.M13 < 0 ? '' : ' ') + this.M13.toFixed(3)}  ][ ${(this.M14 < 0 ? '' : ' ') + this.M14.toFixed(3)}  ]\n[ ${(this.M21 < 0 ? '' : ' ') + this.M21.toFixed(3)}  ][ ${(this.M22 < 0 ? '' : ' ') + this.M22.toFixed(3)}  ][ ${(this.M23 < 0 ? '' : ' ') + this.M23.toFixed(3)}  ][ ${(this.M24 < 0 ? '' : ' ') + this.M24.toFixed(3)}  ]\n[ ${(this.M31 < 0 ? '' : ' ') + this.M31.toFixed(3)}  ][ ${(this.M32 < 0 ? '' : ' ') + this.M32.toFixed(3)}  ][ ${(this.M33 < 0 ? '' : ' ') + this.M33.toFixed(3)}  ][ ${(this.M34 < 0 ? '' : ' ') + this.M34.toFixed(3)}  ]\n[ ${(this.M41 < 0 ? '' : ' ') + this.M41.toFixed(3)}  ][ ${(this.M42 < 0 ? '' : ' ') + this.M42.toFixed(3)}  ][ ${(this.M43 < 0 ? '' : ' ') + this.M43.toFixed(3)}  ][ ${(this.M44 < 0 ? '' : ' ') + this.M44.toFixed(3)}  ]`
    }
    //#endregion

    //#region Static Properties
    static get ZERO()
    {
        return new Matrix4(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        )
    }

    static get IDENTITY()
    {
        return new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }
    //#endregion
}

function Destructure(m11: number | Float32Array | number[], m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): number[]
{
    if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array)
    {
        [
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] = m11
    }

    return [
        m11,  m12!, m13!, m14!,
        m21!, m22!, m23!, m24!,
        m31!, m32!, m33!, m34!,
        m41!, m42!, m43!, m44!
    ]
}
