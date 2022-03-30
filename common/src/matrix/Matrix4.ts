export class Matrix4 extends Float32Array
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
        this._dirty = true
    }

    get M12(): number
    { 
        return this[1]
    }

    set M12(m12: number)
    {
        this[1] = m12
        this._dirty = true
    }

    get M13(): number
    { 
        return this[2]
    }

    set M13(m13: number)
    {
        this[2] = m13
        this._dirty = true
    }

    get M14(): number
    { 
        return this[3]
    }

    set M14(m14: number)
    {
        this[3] = m14
        this._dirty = true
    }

    get M21(): number
    { 
        return this[4]
    }

    set M21(m21: number)
    {
        this[4] = m21
        this._dirty = true
    }

    get M22(): number
    { 
        return this[5]
    }

    set M22(m22: number)
    {
        this[5] = m22
        this._dirty = true
    }

    get M23(): number
    { 
        return this[6]
    }

    set M23(m23: number)
    {
        this[6] = m23
        this._dirty = true
    }

    get M24(): number
    { 
        return this[7]
    }

    set M24(m24: number)
    {
        this[7] = m24
        this._dirty = true
    }

    get M31(): number
    { 
        return this[8]
    }

    set M31(m31: number)
    {
        this[8] = m31
        this._dirty = true
    }

    get M32(): number
    { 
        return this[9]
    }

    set M32(m32: number)
    {
        this[9] = m32
        this._dirty = true
    }

    get M33(): number
    { 
        return this[10]
    }

    set M33(m33: number)
    {
        this[10] = m33
        this._dirty = true
    }

    get M34(): number
    { 
        return this[11]
    }

    set M34(m34: number)
    {
        this[11] = m34
        this._dirty = true
    }

    get M41(): number
    { 
        return this[12]
    }

    set M41(m41: number)
    {
        this[12] = m41
        this._dirty = true
    }    

    get M42(): number
    { 
        return this[13]
    }

    set M42(m42: number)
    {
        this[13] = m42
        this._dirty = true
    }

    get M43(): number
    { 
        return this[14]
    }
    
    set M43(m43: number)
    {
        this[14] = m43
        this._dirty = true
    }

    get M44(): number
    { 
        return this[15]
    }

    set M44(m44: number)
    {
        this[15] = m44
        this._dirty = true
    }

    private _determinant: number = 0
    get Determinant(): number
    {
        if (this._dirty)
        {
            this._determinant = (
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

        return this._determinant
    }

    constructor()
    constructor(m: number)
    constructor(matrix: Matrix4)
    constructor(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number)
    constructor(array: [number | number | number | number | number | number | number | number | number | number | number | number | number | number | number | number])
    constructor(arrayBuffer: ArrayBuffer)
    constructor(m11: ArrayBuffer | Matrix4 | number[] | number = 0, m12: number = 0, m13: number = 0, m14: number = 0, m21: number = 0, m22: number = 0, m23: number = 0, m24: number = 0, m31: number = 0, m32: number = 0, m33: number = 0, m34: number = 0, m41: number = 0, m42: number = 0, m43: number = 0, m44: number = 0)
    {
        super(typeof m11 === 'number' ?
        [ 
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] : m11)
    }

    Set(matrix: Matrix4): Matrix4
    Set(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    Set(array: [number | number | number | number | number | number | number | number | number | number | number | number | number | number | number | number]): Matrix4
    Set(m11: Matrix4 | number[] | number = 0, m12: number = 0, m13: number = 0, m14: number = 0, m21: number = 0, m22: number = 0, m23: number = 0, m24: number = 0, m31: number = 0, m32: number = 0, m33: number = 0, m34: number = 0, m41: number = 0, m42: number = 0, m43: number = 0, m44: number = 0): Matrix4
    {
        m11 = typeof m11 === 'number' ?
        [ 
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] : m11
        

        this[0]  = m11[0]
        this[1]  = m11[1]
        this[2]  = m11[2]
        this[3]  = m11[3]
        this[4]  = m11[4]
        this[5]  = m11[5]
        this[6]  = m11[6]
        this[7]  = m11[7]
        this[8]  = m11[8]
        this[9]  = m11[9]
        this[10] = m11[10]
        this[11] = m11[11]
        this[12] = m11[12]
        this[13] = m11[13]
        this[14] = m11[14]
        this[15] = m11[15]
        this._dirty = true

        return this
    }

    Sum(matrix: Matrix4): Matrix4
    Sum(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    Sum(array: [number | number | number | number | number | number | number | number | number | number | number | number | number | number | number | number]): Matrix4
    Sum(m11: Matrix4 | number[] | number = 0, m12: number = 0, m13: number = 0, m14: number = 0, m21: number = 0, m22: number = 0, m23: number = 0, m24: number = 0, m31: number = 0, m32: number = 0, m33: number = 0, m34: number = 0, m41: number = 0, m42: number = 0, m43: number = 0, m44: number = 0): Matrix4
    {
        m11 = typeof m11 === 'number' ?
        [ 
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] : m11

        this[0]  += m11[0]
        this[1]  += m11[1]
        this[2]  += m11[2]
        this[3]  += m11[3]
        this[4]  += m11[4]
        this[5]  += m11[5]
        this[6]  += m11[6]
        this[7]  += m11[7]
        this[8]  += m11[8]
        this[9]  += m11[9]
        this[10] += m11[10]
        this[11] += m11[11]
        this[12] += m11[12]
        this[13] += m11[13]
        this[14] += m11[14]
        this[15] += m11[15]
        this._dirty = true

        return this
    }

    Mult(matrix: Matrix4): Matrix4
    Mult(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    Mult(array: [number | number | number | number | number | number | number | number | number | number | number | number | number | number | number | number]): Matrix4
    Mult(m11: Matrix4 | number[] | number = 0, m12: number = 0, m13: number = 0, m14: number = 0, m21: number = 0, m22: number = 0, m23: number = 0, m24: number = 0, m31: number = 0, m32: number = 0, m33: number = 0, m34: number = 0, m41: number = 0, m42: number = 0, m43: number = 0, m44: number = 0): Matrix4
    {
        m11 = typeof m11 === 'number' ?
        [ 
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] : m11

        m11 = [
            this[0]  * m11[0] + this[1]  * m11[4] + this[2]  * m11[8]  + this[3]  * m11[12],
            this[0]  * m11[1] + this[1]  * m11[5] + this[2]  * m11[9]  + this[3]  * m11[13],
            this[0]  * m11[2] + this[1]  * m11[6] + this[2]  * m11[10] + this[3]  * m11[14],
            this[0]  * m11[3] + this[1]  * m11[7] + this[2]  * m11[11] + this[3]  * m11[15],
            this[4]  * m11[0] + this[5]  * m11[4] + this[6]  * m11[8]  + this[7]  * m11[12],
            this[4]  * m11[1] + this[5]  * m11[5] + this[6]  * m11[9]  + this[7]  * m11[13],
            this[4]  * m11[2] + this[5]  * m11[6] + this[6]  * m11[10] + this[7]  * m11[14],
            this[4]  * m11[3] + this[5]  * m11[7] + this[6]  * m11[11] + this[7]  * m11[15],
            this[8]  * m11[0] + this[9]  * m11[4] + this[10] * m11[8]  + this[11] * m11[12],
            this[8]  * m11[1] + this[9]  * m11[5] + this[10] * m11[9]  + this[11] * m11[13],
            this[8]  * m11[2] + this[9]  * m11[6] + this[10] * m11[10] + this[11] * m11[14],
            this[8]  * m11[3] + this[9]  * m11[7] + this[10] * m11[11] + this[11] * m11[15],
            this[12] * m11[0] + this[13] * m11[4] + this[14] * m11[8]  + this[15] * m11[12],
            this[12] * m11[1] + this[13] * m11[5] + this[14] * m11[9]  + this[15] * m11[13],
            this[12] * m11[2] + this[13] * m11[6] + this[14] * m11[10] + this[15] * m11[14],
            this[12] * m11[3] + this[13] * m11[7] + this[14] * m11[11] + this[15] * m11[15],
        ]

        this[0] = m11[0]
        this[1] = m11[1]
        this[2] = m11[2]
        this[3] = m11[3]
        this[4] = m11[4]
        this[5] = m11[5]
        this[6] = m11[6]
        this[7] = m11[7]
        this[8] = m11[8]
        this[9] = m11[9]
        this[10] = m11[10]
        this[11] = m11[11]
        this[12] = m11[12]
        this[13] = m11[13]
        this[14] = m11[14]
        this[15] = m11[15]
        this._dirty = true

        return this
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
        this._dirty = true

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

    public static readonly SIZE: number = 16

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
}
