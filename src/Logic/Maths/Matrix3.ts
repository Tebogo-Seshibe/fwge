import Cloneable from '../Interfaces/Cloneable';
import List from '../Utility/List';
import './Math';

export default class Matrix3 extends Float32Array implements Cloneable<Matrix3>
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

    public get M21(): number
    {
        return this[3]
    }

    public set M21(m21: number)
    {
        this[3] = Math.clean(m21)
    }

    public get M22(): number
    {
        return this[4]
    }

    public set M22(m22: number)
    {
        this[4] = Math.clean(m22)
    }

    public get M23(): number
    {
        return this[5]
    }

    public set M23(m23: number)
    {
        this[5] = Math.clean(m23)
    }

    public get M31(): number
    {
        return this[6]
    }

    public set M31(m31: number)
    {
        this[6] = Math.clean(m31)
    }

    public get M32(): number
    {
        return this[7]
    }

    public set M32(m32: number)
    {
        this[7] = Math.clean(m32)
    }

    public get M33(): number
    {
        return this[8]
    }

    public set M33(m33: number)
    {
        this[8] = Math.clean(m33)
    }

    public get Determinant(): number
    {
        return Math.clean(
            this.M11 * (this.M22 * this.M33 - this.M23 * this.M32) -
            this.M12 * (this.M21 * this.M33 - this.M23 * this.M31) + 
            this.M13 * (this.M21 * this.M32 - this.M22 * this.M31)
        )
    }
    //#endregion

    //#region Public Methods
    constructor()
    constructor(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(list: List<number>)
    constructor(m11?: number | Float32Array | number[] | List<number>, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number)
    {
        super(9)

        if (m11 !== undefined)
        {
            if (typeof m11 === 'number')
            {
                this.Set(
                    m11, m12, m13,
                    m21, m22, m23,
                    m31, m32, m33
                )
            }
            else 
            {
                this.Set([ ...m11 ])
            }
        }
    }

    public Set(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3
    public Set(array: Float32Array): Matrix3
    public Set(array: number[]): Matrix3
    public Set(list: List<number>): Matrix3
    public Set(m11: number | Float32Array | number[] | List<number>, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): Matrix3
    {
        [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ] = Matrix3.Destructure(
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        )

        this.M11 = m11
        this.M12 = m12
        this.M13 = m13

        this.M21 = m21
        this.M22 = m22
        this.M23 = m23

        this.M31 = m31
        this.M32 = m32
        this.M33 = m33

        return this
    }
    
    public Sum(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3
    public Sum(array: Float32Array): Matrix3
    public Sum(array: number[]): Matrix3
    public Sum(list: List<number>): Matrix3
    public Sum(m11: number | Float32Array | number[] | List<number>, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): Matrix3
    {
        [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ] = Matrix3.Destructure(
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        )

        this.M11 += m11
        this.M12 += m12
        this.M13 += m13

        this.M21 += m21
        this.M22 += m22
        this.M23 += m23

        this.M31 += m31
        this.M32 += m32
        this.M33 += m33

        return this
    }

    public Mult(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3
    public Mult(array: Float32Array): Matrix3
    public Mult(array: number[]): Matrix3
    public Mult(list: List<number>): Matrix3
    public Mult(m11: number | Float32Array | number[] | List<number>, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): Matrix3
    {
        [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ] = Matrix3.Destructure(
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        )

        return this.Set(
            this.M11 * m11 + this.M12 * m21 + this.M13 * m31,
            this.M11 * m12 + this.M12 * m22 + this.M13 * m32,
            this.M11 * m13 + this.M12 * m23 + this.M13 * m33,

            this.M21 * m11 + this.M22 * m21 + this.M23 * m31,
            this.M21 * m12 + this.M22 * m22 + this.M23 * m32,
            this.M21 * m13 + this.M22 * m23 + this.M23 * m33,

            this.M31 * m11 + this.M32 * m21 + this.M33 * m31,
            this.M31 * m12 + this.M32 * m22 + this.M33 * m32,
            this.M31 * m13 + this.M32 * m23 + this.M33 * m33
        )
    }

    public Scale(scaler: number): Matrix3
    {
        this.M11 *= scaler
        this.M12 *= scaler
        this.M13 *= scaler

        this.M21 *= scaler
        this.M22 *= scaler
        this.M23 *= scaler

        this.M31 *= scaler
        this.M32 *= scaler
        this.M33 *= scaler

        return this
    }
    
    public Transpose(): Matrix3
    {
        return this.Set(
            this.M11, this.M21, this.M31,
            this.M12, this.M22, this.M32,
            this.M13, this.M23, this.M33
        )
    }

    public Inverse(): Matrix3
    {
        let det = this.Determinant

        if (det !== 0)
        {
            this.Set(
                (this.M22 * this.M33 - this.M32 * this.M23) / det,
                (this.M32 * this.M13 - this.M12 * this.M33) / det,
                (this.M12 * this.M23 - this.M22 * this.M13) / det,

                (this.M31 * this.M23 - this.M21 * this.M33) / det,
                (this.M11 * this.M33 - this.M31 * this.M13) / det,
                (this.M21 * this.M13 - this.M11 * this.M23) / det,

                (this.M21 * this.M32 - this.M31 * this.M22) / det,
                (this.M31 * this.M12 - this.M11 * this.M32) / det,
                (this.M11 * this.M22 - this.M21 * this.M12) / det
            )
        }

        return this
    }

    public Identity(): Matrix3
    {
        return this.Set(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        )
    }

    public Clone(): Matrix3
    {
        return new Matrix3(this)
    }
    //#endregion

    //#region Static Properties
    public static get ZERO(): Matrix3
    {
        return new Matrix3(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        )
    }

    public static get IDENTITY(): Matrix3
    {
        return new Matrix3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        )
    }
    //#endregion

    //#region Static Helpers
    private static Destructure(m11: number | Float32Array | number[] | List<number>, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): number[]
    {
        if (m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List)
        {
            [
                m11, m12, m13,
                m21, m22, m23,
                m31, m32, m33
            ] = m11
        }

        return [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ]
    }
    //#endregion
}
