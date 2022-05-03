import {  } from '../utils/Math'

export class Matrix2 extends Float32Array
{
    private _dirty: boolean = true
    public get Dirty(): boolean
    {
        return this._dirty
    }
    
    public set Dirty(dirty: boolean)
    {
        this._dirty = dirty
    }
    
    public get M11(): number
    {
        return this[0]
    }
    
    public set M11(m11: number)
    {
        this[0] = m11
    }
    
    public get M12(): number
    {
        return this[1]
    }

    public set M12(m12: number)
    {
        this[1] = m12
    }
    
    public get M21(): number
    {
        return this[2]
    }

    public set M21(m21: number)
    {
        this[2] = m21
    }
    
    public get M22(): number
    {
        return this[3]
    }

    public set M22(m22: number)
    {
        this[3] = m22
    }
    
    public get Determinant(): number
    {
        return (this.M11 * this.M22 - this.M21 * this.M12)
    }

    constructor()
    constructor(matrix: Matrix2)
    constructor(m11: number, m12: number, m21: number, m22: number)
    constructor(array: [number, number, number, number])
    constructor(arrayBuffer: ArrayBuffer)
    constructor(m11: ArrayBuffer | Matrix2 | number[] | number = 0, m12: number = 0, m21: number = 0, m22: number = 0)
    {
        super(typeof m11 === 'number' ?
        [ 
            m11, m12,
            m21, m22
        ] : m11)
    }
    
    public Set(matrix: Matrix2): Matrix2
    public Set(m11: number, m12: number, m21: number, m22: number): Matrix2
    public Set(array: [number, number, number, number]): Matrix2
    public Set(m11: Matrix2 | number[] | number = 0, m12: number = 0, m21: number = 0, m22: number = 0): Matrix2
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
    
    public Sum(matrix: Matrix2): Matrix2
    public Sum(m11: number, m12: number, m21: number, m22: number): Matrix2
    public Sum(array: [number, number, number, number]): Matrix2
    public Sum(m11: Matrix2 | number[] | number = 0, m12: number = 0, m21: number = 0, m22: number = 0): Matrix2
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
    
    public Mult(matrix: Matrix2): Matrix2
    public Mult(m11: number, m12: number, m21: number, m22: number): Matrix2
    public Mult(array: [number, number, number, number]): Matrix2
    public Mult(m11: Matrix2 | number[] | number = 0, m12: number = 0, m21: number = 0, m22: number = 0): Matrix2
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
    
    public Scale(scaler: number): Matrix2
    {
        this[0] *= scaler
        this[1] *= scaler
        this[2] *= scaler
        this[3] *= scaler

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

    public static readonly SIZE: number = 4

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
}
