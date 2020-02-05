import Cloneable from '../Interfaces/Cloneable';
import List from '../Utility/List';
import './Math';

export default class Matrix2 extends Float32Array implements Cloneable<Matrix2>
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
    
    public get M21(): number
    {
        return this[2]
    }

    public set M21(m21: number)
    {
        this[2] = Math.clean(m21)
    }
    
    public get M22(): number
    {
        return this[3]
    }

    public set M22(m22: number)
    {
        this[3] = Math.clean(m22)
    }
    
    public get Determinant(): number
    {
        return Math.clean(this.M11 * this.M22 - this.M21 * this.M12)
    }
    //#endregion

    //#region Public Methods
    constructor()
    constructor(m11: number, m12: number, m21: number, m22: number)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(list: List<number>)
    constructor(m11?: number | Float32Array | number[] | List<number>, m12?: number, m21?: number, m22?: number)
    {
        super(4)

        if (m11 !== undefined)
        {
            if (typeof m11 === 'number')
            {
                this.Set(
                    m11, m12,
                    m21, m22
                )
            }
            else 
            {
                this.Set([ ...m11 ])
            }
        }
    }
    
    public Set(m11: number, m12: number, m21: number, m22: number): Matrix2
    public Set(array: Float32Array): Matrix2
    public Set(array: number[]): Matrix2
    public Set(list: List<number>): Matrix2
    public Set(m11: number | Float32Array | number[] | List<number>, m12?: number, m21?: number, m22?: number): Matrix2
    {
        [
            m11, m12, 
            m21, m22
        ] = Matrix2.Destructure(
            m11, m12,
            m21, m22
        )

        this.M11 = m11
        this.M12 = m12

        this.M21 = m21
        this.M22 = m22

        return this
    }

    public Sum(m11: number, m12: number, m21: number, m22: number): Matrix2
    public Sum(array: Float32Array): Matrix2
    public Sum(array: number[]): Matrix2
    public Sum(list: List<number>): Matrix2
    public Sum(m11: number | Float32Array | number[] | List<number>, m12?: number, m21?: number, m22?: number): Matrix2
    {
        [
            m11, m12, 
            m21, m22
        ] = Matrix2.Destructure(
            m11, m12,
            m21, m22
        )

        this.M11 += m11
        this.M12 += m12

        this.M21 += m21
        this.M22 += m22

        return this
    }
    
    public Mult(m11: number, m12: number, m21: number, m22: number): Matrix2
    public Mult(array: Float32Array): Matrix2
    public Mult(array: number[]): Matrix2
    public Mult(list: List<number>): Matrix2
    public Mult(m11: number | Float32Array | number[] | List<number>, m12?: number, m21?: number, m22?: number): Matrix2
    {
        [
            m11, m12, 
            m21, m22
        ] = Matrix2.Destructure(
            m11, m12,
            m21, m22
        )

        return this.Set(
            this.M11 * m11 + this.M12 * m21,
            this.M11 * m12 + this.M12 * m22,
            this.M21 * m11 + this.M22 * m21,
            this.M21 * m12 + this.M22 * m22
        )
    }
    
    public Scale(scaler: number): Matrix2
    {
        this.M11 *= scaler
        this.M12 *= scaler

        this.M21 *= scaler
        this.M22 *= scaler

        return this
    }

    public Transpose(): Matrix2
    {
        return this.Set(
            this.M11, this.M21, 
            this.M12, this.M22
        )
    }
    
    public Inverse(): Matrix2
    {
        let det = this.Determinant

        if (det !== 0)
        {
            this.Set(
                    this.M22 / det, -this.M12 / det,
                -this.M21 / det,  this.M11 / det
            )
        }

        return this
    }
    
    public Identity(): Matrix2
    {
        return this.Set(
            1, 0,
            0, 1
        )
    }

    public Clone(): Matrix2
    {
        return new Matrix2(this)
    }
    //#endregion
    
    //#region Static Properties
    public static get ZERO(): Matrix2
    {
        return new Matrix2(
            0, 0,
            0, 0
        )
    }

    public static get IDENTITY(): Matrix2
    {
        return new Matrix2(
            1, 0,
            0, 1
        )
    }
    //#endregion

    //#region Helper Methods
    private static Destructure(m11: number | Float32Array | number[] | List<number>, m12?: number, m21?: number, m22?: number): number[]
    {
        if (m11 instanceof Float32Array || m11 instanceof List || m11 instanceof Array)
        {
            [
                m11, m12,
                m21, m22 
            ] = m11
        }

        return [
            m11, m12,
            m21, m22
        ]
    }
    //#endregion
}
