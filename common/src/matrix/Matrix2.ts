import {  } from '../utils/Math'

export class Matrix2 extends Float32Array
{
    private _dirty: boolean = true
    get Dirty(): boolean
    {
        return this._dirty
    }
    
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
        return (this.M11 * this.M22 - this.M21 * this.M12)
    }

    constructor()
    constructor(matrix: Matrix2)
    constructor(m11: number, m12: number, m21: number, m22: number)
    constructor(array: [number, number, number, number])
    constructor(m11: Matrix2 | number[] | number = 0, m12: number = 0, m21: number = 0, m22: number = 0)
    {
        super(typeof m11 === 'number' ?
        [ 
            m11, m12,
            m21, m22
        ] : m11)
    }
    
    Set(matrix: Matrix2): Matrix2
    Set(m11: number, m12: number, m21: number, m22: number): Matrix2
    Set(array: [number, number, number, number]): Matrix2
    Set(m11: Matrix2 | number[] | number = 0, m12: number = 0, m21: number = 0, m22: number = 0): Matrix2
    {
        m11 = typeof m11 === 'number' ?
        [ 
            m11, m12,
            m21, m22
        ] : m11

        this[0] = m11[0]
        this[1] = m11[1]
        this[2] = m11[2]
        this[3] = m11[3]

        return this
    }
    
    Sum(matrix: Matrix2): Matrix2
    Sum(m11: number, m12: number, m21: number, m22: number): Matrix2
    Sum(array: [number, number, number, number]): Matrix2
    Sum(m11: Matrix2 | number[] | number = 0, m12: number = 0, m21: number = 0, m22: number = 0): Matrix2
    {
        m11 = typeof m11 === 'number' ?
        [ 
            m11, m12,
            m21, m22
        ] : m11

        this[0] += m11[0]
        this[1] += m11[1]
        this[2] += m11[2]
        this[3] += m11[3]

        return this
    }
    
    Mult(matrix: Matrix2): Matrix2
    Mult(m11: number, m12: number, m21: number, m22: number): Matrix2
    Mult(array: [number, number, number, number]): Matrix2
    Mult(m11: Matrix2 | number[] | number = 0, m12: number = 0, m21: number = 0, m22: number = 0): Matrix2
    {
        m11 = typeof m11 === 'number' ?
        [ 
            m11, m12,
            m21, m22
        ] : m11

        return this.Set(
            this[0] * m11[0] + this[1] * m11[2],
            this[0] * m11[1] + this[1] * m11[3],
            this[2] * m11[0] + this[3] * m11[2],
            this[2] * m11[1] + this[3] * m11[3]
        )
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
            this.M11, this.M21, 
            this.M12, this.M22
        )
    }
    
    Inverse(): Matrix2
    {
        const det = this.Determinant

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
