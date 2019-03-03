import Cloneable from '../Interfaces/Cloneable'

export default class Matrix2 extends Float32Array implements Cloneable<Matrix2>
{
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
    
    static get ZERO(): Matrix2
    {
        return new Matrix2
        (
            0, 0,
            0, 0
        )
    }

    static get IDENTITY(): Matrix2
    {
        return new Matrix2
        (
            1, 0,
            0, 1
        )
    }


    constructor()
    constructor(matrix: Matrix2)
    constructor(array: Float32Array)
    constructor(array: Array<number>)
    constructor(m11: number, m12: number, m21: number, m22: number)
    constructor(m11?: Matrix2 | Float32Array | Array<number> | number, m12?: number, m21?: number, m22?: number)
    {
        super(4)

        if (m11)
        {
            Matrix2.Set(this, m11, m12, m21, m22)
        }
    }
    
    Set(matrix: Matrix2): Matrix2
    Set(array: Float32Array): Matrix2
    Set(array: Array<number>): Matrix2
    Set(m11: number, m12: number, m21: number, m22: number): Matrix2
    Set(m11: Matrix2 | Float32Array | Array<number> | number, m12?: number, m21?: number, m22?: number): Matrix2
    {
        return Matrix2.Set(this, m11, m12, m21, m22)
    }

    static Set(matrix: Matrix2, m11: Matrix2 | Float32Array | Array<number> | number, m12?: number, m21?: number, m22?: number): Matrix2
    {
        if (m11 instanceof Matrix2 || m11 instanceof Float32Array || m11 instanceof Array)
        {
            [
                m11, m12,
                m21, m22 
            ] = m11
        }

        matrix.M11 = m11
        matrix.M12 = m12
        matrix.M21 = m21
        matrix.M22 = m22

        return matrix;
    }
    
    Transpose(): Matrix2
    {
        return Matrix2.Transpose(this)
    }

    static Transpose(matrix: Matrix2): Matrix2
    {
        return Matrix2.Set(matrix, matrix.M11, matrix.M21, matrix.M12, matrix.M22)
    }
    
    get Determinant(): number
    {
        return Matrix2.Determinant(this)
    }

    static Determinant(m11: Matrix2 | Float32Array | Array<number> | number, m12?: number, m21?: number, m22?: number): number
    {
        if (m11 instanceof Matrix2 || m11 instanceof Float32Array || m11 instanceof Array)
        {
            [
                m11, m12,
                m21, m22 
            ] = m11
        }

        return m11 * m22 - m21 * m12;
    }
    
    Inverse(): Matrix2
    {
        return Matrix2.Inverse(this)
    }

    static Inverse(matrix: Matrix2): Matrix2
    {
        let det = matrix.Determinant

        if (det !== 0)
        {
            Matrix2.Set(matrix, matrix.M22 / det, -matrix.M12 / det, -matrix.M21 / det,  matrix.M11 / det)
        }

        return matrix
    }
    
    Sum(matrix: Matrix2): Matrix2
    Sum(array: Float32Array): Matrix2
    Sum(array: Array<number>): Matrix2
    Sum(m11: number, m12: number, m21: number, m22: number): Matrix2
    Sum(m11: Matrix2 | Float32Array | Array<number> | number, m12?: number, m21?: number, m22?: number): Matrix2
    {
        return Matrix2.Sum(this, m11, m12, m21, m22)
    }

    static Sum(matrix: Matrix2, m11?: Matrix2 | Float32Array | Array<number> | number, m12?: number, m21?: number, m22?: number): Matrix2
    {
        if (m11 instanceof Matrix2 || m11 instanceof Float32Array || m11 instanceof Array)
        {
            [
                m11, m12,
                m21, m22 
            ] = m11
        }

        return Matrix2.Set(matrix, matrix.M11 + m11, matrix.M12 + m12, matrix.M21 + m21, matrix.M22 + m22)
    }
    
    Mult(m11: Matrix2): Matrix2
    Mult(array: Float32Array): Matrix2
    Mult(array: Array<number>): Matrix2
    Mult(m11: number, m12: number, m21: number, m22: number): Matrix2
    Mult(m11: Matrix2 | Float32Array | Array<number> | number, m12?: number, m21?: number, m22?: number): Matrix2
    {
        return Matrix2.Mult(this, m11, m12, m21, m22)
    }

    static Mult(matrix: Matrix2, m11?: Matrix2 | Float32Array | Array<number> | number, m12?: number, m21?: number, m22?: number): Matrix2
    {
        if (m11 instanceof Matrix2 || m11 instanceof Float32Array || m11 instanceof Array)
        {
            [
                m11, m12,
                m21, m22 
            ] = m11
        }

        return Matrix2.Set
        (
            matrix,
            matrix.M11 * m11 + matrix.M12 * m21,
            matrix.M11 * m12 + matrix.M12 * m22,                
            matrix.M21 * m11 + matrix.M22 * m21,
            matrix.M21 * m12 + matrix.M22 * m22
        );
    }
    
    Scale(scaler: number): Matrix2
    {
        return Matrix2.Scale(this, scaler)
    }

    static Scale(matrix: Matrix2, scaler: number): Matrix2
    {
        return Matrix2.Set
        (
            matrix,
            matrix.M11 * scaler,
            matrix.M12 * scaler,
            matrix.M21 * scaler,
            matrix.M22 * scaler
        )
    }
    
    Identity(): Matrix2
    {
        return Matrix2.Identity(this)
    }

    static Identity(matrix: Matrix2): Matrix2
    {
        return Matrix2.Set
        (
            matrix,
            1, 0,
            0, 1
        )
    }

    Clone(): Matrix2
    {
        return new Matrix2(this)
    }
}