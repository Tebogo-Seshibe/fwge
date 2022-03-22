export class Matrix3 extends Float32Array
{
    private _dirty: boolean = true
    get Dirty(): boolean
    {
        return this._dirty
    }
    
    set Dirty(dirty: boolean)
    {
        this._dirty = dirty
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
    
    get M13(): number
    {
        return this[2]
    }

    set M13(m13: number)
    {
        this[2] = m13
    }

    get M21(): number
    {
        return this[3]
    }

    set M21(m21: number)
    {
        this[3] = m21
    }

    get M22(): number
    {
        return this[4]
    }

    set M22(m22: number)
    {
        this[4] = m22
    }

    get M23(): number
    {
        return this[5]
    }

    set M23(m23: number)
    {
        this[5] = m23
    }

    get M31(): number
    {
        return this[6]
    }

    set M31(m31: number)
    {
        this[6] = m31
    }

    get M32(): number
    {
        return this[7]
    }

    set M32(m32: number)
    {
        this[7] = m32
    }

    get M33(): number
    {
        return this[8]
    }

    set M33(m33: number)
    {
        this[8] = m33
    }

    get Determinant(): number
    {
        return (
            this[0] * (this[4] * this[8] - this[5] * this[7]) -
            this[1] * (this[3] * this[8] - this[5] * this[6]) + 
            this[2] * (this[3] * this[7] - this[4] * this[6])
        )
    }

    constructor()
    constructor(matrix: Matrix3)
    constructor(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number)
    constructor(array: [number | number | number | number | number | number | number | number | number])
    constructor(m11: Matrix3 | number[] | number = 0, m12: number = 0, m13: number = 0, m21: number = 0, m22: number = 0, m23: number = 0, m31: number = 0, m32: number = 0, m33: number = 0)
    {
        super(typeof m11 === 'number' ?
        [ 
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ] : m11)
    }

    Set(matrix: Matrix3): Matrix3
    Set(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3
    Set(array: [number | number | number | number | number | number | number | number | number]): Matrix3
    Set(m11: Matrix3 | number[] | number = 0, m12: number = 0, m13: number = 0, m21: number = 0, m22: number = 0, m23: number = 0, m31: number = 0, m32: number = 0, m33: number = 0): Matrix3
    {
        m11 = typeof m11 === 'number' ?
        [ 
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ] : m11

        this[0] = m11[0]
        this[1] = m11[1]
        this[2] = m11[2]
        this[3] = m11[3]
        this[4] = m11[4]
        this[5] = m11[5]
        this[6] = m11[6]
        this[7] = m11[7]
        this[8] = m11[8]

        return this
    }
    
    Sum(matrix: Matrix3): Matrix3
    Sum(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3
    Sum(array: [number | number | number | number | number | number | number | number | number]): Matrix3
    Sum(m11: Matrix3 | number[] | number = 0, m12: number = 0, m13: number = 0, m21: number = 0, m22: number = 0, m23: number = 0, m31: number = 0, m32: number = 0, m33: number = 0): Matrix3
    {
        m11 = typeof m11 === 'number' ?
        [ 
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ] : m11

        this[0] += m11[0]
        this[1] += m11[1]
        this[2] += m11[2]
        this[3] += m11[3]
        this[4] += m11[4]
        this[5] += m11[5]
        this[6] += m11[6]
        this[7] += m11[7]
        this[8] += m11[8]

        return this
    }

    Mult(matrix: Matrix3): Matrix3
    Mult(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3
    Mult(array: [number | number | number | number | number | number | number | number | number]): Matrix3
    Mult(m11: Matrix3 | number[] | number = 0, m12: number = 0, m13: number = 0, m21: number = 0, m22: number = 0, m23: number = 0, m31: number = 0, m32: number = 0, m33: number = 0): Matrix3
    {
        m11 = typeof m11 === 'number' ?
        [ 
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ] : m11

        return this.Set(
            this[0] * m11[0] + this[1] * m11[3] + this[2] * m11[6],
            this[0] * m11[1] + this[1] * m11[4] + this[2] * m11[7],
            this[0] * m11[2] + this[1] * m11[5] + this[2] * m11[8],

            this[3] * m11[0] + this[4] * m11[3] + this[5] * m11[6],
            this[3] * m11[1] + this[4] * m11[4] + this[5] * m11[7],
            this[3] * m11[2] + this[4] * m11[5] + this[5] * m11[8],

            this[6] * m11[0] + this[7] * m11[3] + this[8] * m11[6],
            this[6] * m11[1] + this[7] * m11[4] + this[8] * m11[7],
            this[6] * m11[2] + this[7] * m11[5] + this[8] * m11[8]
        )
    }

    Scale(scaler: number): Matrix3
    {
        this[0] *= scaler
        this[1] *= scaler
        this[2] *= scaler
        this[3] *= scaler
        this[4] *= scaler
        this[5] *= scaler
        this[6] *= scaler
        this[7] *= scaler
        this[8] *= scaler

        return this
    }
    
    Transpose(): Matrix3
    {
        return this.Set(
            this[0], this[3], this[6],
            this[1], this[4], this[7],
            this[2], this[5], this[8]
        )
    }

    Inverse(): Matrix3
    {
        const det = this.Determinant

        if (det !== 0)
        {
            this.Set(
                (this[4] * this[8] - this[7] * this[5]) / det,
                (this[7] * this[2] - this[1] * this[8]) / det,
                (this[1] * this[5] - this[4] * this[2]) / det,

                (this[6] * this[5] - this[3] * this[8]) / det,
                (this[0] * this[8] - this[6] * this[2]) / det,
                (this[3] * this[2] - this[0] * this[5]) / det,

                (this[3] * this[7] - this[6] * this[4]) / det,
                (this[6] * this[1] - this[0] * this[7]) / det,
                (this[0] * this[4] - this[3] * this[1]) / det
            )
        }

        return this
    }

    Identity(): Matrix3
    {
        return this.Set(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        )
    }

    Clone(): Matrix3
    {
        return new Matrix3(this)
    }

    static get ZERO(): Matrix3
    {
        return new Matrix3(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        )
    }

    static get IDENTITY(): Matrix3
    {
        return new Matrix3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        )
    }
}
