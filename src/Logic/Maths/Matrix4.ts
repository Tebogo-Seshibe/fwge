import Cloneable from '../Interfaces/Cloneable';
import List from '../Utility/List';
import './Math';

export default class Matrix4 extends Float32Array implements Cloneable<Matrix4>
{
    //#region Public Properties
    public get M11(): number
    { 
        return this[0]
    }

    public set M11(m11: number)
    {
        this[0] = Math.clean(m11)
    }

    public get M12(): number
    { 
        return this[1]
    }

    public set M12(m12: number)
    {
        this[1] = Math.clean(m12)
    }

    public get M13(): number
    { 
        return this[2]
    }

    public set M13(m13: number)
    {
        this[2] = Math.clean(m13)
    }

    public get M14(): number
    { 
        return this[3]
    }

    public set M14(m14: number)
    {
        this[3] = Math.clean(m14)
    }

    public get M21(): number
    { 
        return this[4]
    }

    public set M21(m21: number)
    {
        this[4] = Math.clean(m21)
    }

    public get M22(): number
    { 
        return this[5]
    }

    public set M22(m22: number)
    {
        this[5] = Math.clean(m22)
    }

    public get M23(): number
    { 
        return this[6]
    }

    public set M23(m23: number)
    {
        this[6] = Math.clean(m23)
    }

    public get M24(): number
    { 
        return this[7]
    }

    public set M24(m24: number)
    {
        this[7] = Math.clean(m24)
    }

    public get M31(): number
    { 
        return this[8]
    }

    public set M31(m31: number)
    {
        this[8] = Math.clean(m31)
    }

    public get M32(): number
    { 
        return this[9]
    }

    public set M32(m32: number)
    {
        this[9] = Math.clean(m32)
    }

    public get M33(): number
    { 
        return this[10]
    }

    public set M33(m33: number)
    {
        this[10] = Math.clean(m33)
    }

    public get M34(): number
    { 
        return this[11]
    }

    public set M34(m34: number)
    {
        this[11] = Math.clean(m34)
    }

    public get M41(): number
    { 
        return this[12]
    }

    public set M41(m41: number)
    {
        this[12] = Math.clean(m41)
    }    

    public get M42(): number
    { 
        return this[13]
    }

    public set M42(m42: number)
    {
        this[13] = Math.clean(m42)
    }

    public get M43(): number
    { 
        return this[14]
    }
    
    public set M43(m43: number)
    {
        this[14] = Math.clean(m43)
    }

    public get M44(): number
    { 
        return this[15]
    }

    public set M44(m44: number)
    {
        this[15] = Math.clean(m44)
    }

    public get Determinant(): number
    {
        return Math.clean(
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

    //#region Public Methods
    constructor()
    constructor(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number)
    constructor(matrix: Matrix4)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(list: List<number>)
    constructor(m11?: number | Float32Array | number[] | List<number>, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number)
    {
        super(16)

        if (m11 !== undefined)
        {
            if (typeof m11 === 'number')
            {
                this.Set(
                    m11, m12, m13, m14,
                    m21, m22, m23, m24,
                    m31, m32, m33, m34,
                    m41, m42, m43, m44
                )
            }
            else 
            {
                this.Set([ ...m11 ])
            }
        }
    }

    public Set(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    public Set(array: Float32Array): Matrix4
    public Set(array: number[]): Matrix4
    public Set(list: List<number>): Matrix4
    public Set(m11: number | Float32Array | number[] | List<number>, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4
    {
        [ 
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] = Matrix4.Destructure(
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

    public Sum(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    public Sum(array: Float32Array): Matrix4
    public Sum(array: number[]): Matrix4
    public Sum(list: List<number>): Matrix4
    public Sum(m11: number | Float32Array | number[] | List<number>, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4
    {
        [ 
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] = Matrix4.Destructure(
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

    public Mult(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    public Mult(array: Float32Array): Matrix4
    public Mult(array: number[]): Matrix4
    public Mult(list: List<number>): Matrix4
    public Mult(m11: number | Float32Array | number[] | List<number>, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4
    {
        [ 
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] = Matrix4.Destructure(
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
    
    public Scale(scaler: number): Matrix4
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

    public Transpose(): Matrix4
    {
        return this.Set(
            this.M11, this.M21, this.M31, this.M41,
            this.M12, this.M22, this.M32, this.M42,
            this.M13, this.M23, this.M33, this.M43,
            this.M14, this.M24, this.M34, this.M44
        )
    }

    public Inverse(): Matrix4
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

    public Identity(): Matrix4
    {
        return this.Set(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }

    public Clone(): Matrix4
    {
        return new Matrix4(this)
    }
    //#endregion

    //#region Static Properties
    public static get ZERO()
    {
        return new Matrix4(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        )
    }

    public static get IDENTITY()
    {
        return new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }
    //#endregion

    //#region Static Helpers
    private static Destructure(m11: number | Float32Array | number[] | List<number>, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): number[]
    {
        if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List)
        {
            [
                m11, m12, m13, m14,
                m21, m22, m23, m24,
                m31, m32, m33, m34,
                m41, m42, m43, m44
            ] = m11
        }

        return [
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ]
    }
    //#endregion
}
