import { clean } from '../utils/Math'

export class Matrix2 extends Float32Array
{
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
    
    get M21(): number
    {
        return this[2]
    }

    set M21(m21: number)
    {
        this[2] = clean(m21)
    }
    
    get M22(): number
    {
        return this[3]
    }

    set M22(m22: number)
    {
        this[3] = clean(m22)
    }
    
    get Determinant(): number
    {
        return clean(this.M11 * this.M22 - this.M21 * this.M12)
    }

    constructor()
    constructor(m11: number, m12: number, m21: number, m22: number)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(m11?: number | Float32Array | number[], m12?: number, m21?: number, m22?: number)
    {
        super(4)

        if (m11 !== undefined)
        {
            if (typeof m11 === 'number')
            {
                this.Set(
                    m11, m12!,
                    m21!, m22!
                )
            }
            else 
            {
                this.Set([ ...m11 ])
            }
        }
    }
    
    Set(m11: number, m12: number, m21: number, m22: number): Matrix2
    Set(array: Float32Array): Matrix2
    Set(array: number[]): Matrix2
    Set(m11: number | Float32Array | number[], m12?: number, m21?: number, m22?: number): Matrix2
    {
        [
            m11, m12, 
            m21, m22
        ] = Destructure(
            m11, m12,
            m21, m22
        )

        this.M11 = m11
        this.M12 = m12

        this.M21 = m21
        this.M22 = m22

        return this
    }

    Sum(m11: number, m12: number, m21: number, m22: number): Matrix2
    Sum(array: Float32Array): Matrix2
    Sum(array: number[]): Matrix2
    Sum(m11: number | Float32Array | number[], m12?: number, m21?: number, m22?: number): Matrix2
    {
        [
            m11, m12, 
            m21, m22
        ] = Destructure(
            m11, m12,
            m21, m22
        )

        this.M11 += m11
        this.M12 += m12

        this.M21 += m21
        this.M22 += m22

        return this
    }
    
    Mult(m11: number, m12: number, m21: number, m22: number): Matrix2
    Mult(array: Float32Array): Matrix2
    Mult(array: number[]): Matrix2
    Mult(m11: number | Float32Array | number[], m12?: number, m21?: number, m22?: number): Matrix2
    {
        [
            m11, m12, 
            m21, m22
        ] = Destructure(
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
    
    Scale(scaler: number): Matrix2
    {
        this.M11 *= scaler
        this.M12 *= scaler

        this.M21 *= scaler
        this.M22 *= scaler

        return this
    }

    Transpose(): Matrix2
    {
        return this.Set(
            this.M11, this.M21, 
            this.M12, this.M22
        )
    }
    
    Inverse(): Matrix2
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
    
    Identity(): Matrix2
    {
        return this.Set(
            1, 0,
            0, 1
        )
    }

    Clone(): Matrix2
    {
        return new Matrix2(this)
    }

    static get ZERO(): Matrix2
    {
        return new Matrix2(
            0, 0,
            0, 0
        )
    }

    static get IDENTITY(): Matrix2
    {
        return new Matrix2(
            1, 0,
            0, 1
        )
    }
}

function Destructure(m11: number | Float32Array | number[], m12?: number, m21?: number, m22?: number): number[]
{
    if (m11 instanceof Float32Array || m11 instanceof Array)
    {
        [
            m11, m12,
            m21, m22 
        ] = m11
    }

    return [
        m11, m12!,
        m21!, m22!
    ]
}
