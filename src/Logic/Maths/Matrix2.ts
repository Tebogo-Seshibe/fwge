import Cloneable from '../Interfaces/Cloneable';
import List from '../Utility/List';
import './Maths';
import Matrix3 from './Matrix3';
import Matrix4 from './Matrix4';

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
        return Matrix2.Determinant(this)
    }
    //#endregion

    //#region Public Methods
    constructor()
    constructor(m11: number, m12: number, m21: number, m22: number)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(list: List<number>)
    constructor(matrix: Matrix2)
    constructor(matrix: Matrix3)
    constructor(matrix: Matrix4)
    constructor(m11?: Float32Array | number[] | List<number> | Matrix2 | Matrix3 | Matrix4 | number, m12?: number, m21?: number, m22?: number)
    {
        super(4)

        if (m11 !== undefined)
        {
            Matrix2.Set
            (
                this,
                m11, m12,
                m21, m22
            )
        }
    }
    
    public Set(m11: number, m12: number, m21: number, m22: number): Matrix2
    public Set(array: Float32Array): Matrix2
    public Set(array: number[]): Matrix2
    public Set(list: List<number>): Matrix2
    public Set(matrix: Matrix2): Matrix2
    public Set(matrix: Matrix3): Matrix2
    public Set(matrix: Matrix4): Matrix2
    public Set(m11: Float32Array | number[] | List<number> | Matrix2 | Matrix3 | Matrix4 | number, m12?: number, m21?: number, m22?: number): Matrix2
    {
        return Matrix2.Set
        (
            this,
            m11, m12,
            m21, m22
        )
    }

    public Sum(m11: number, m12: number, m21: number, m22: number): Matrix2
    public Sum(array: Float32Array): Matrix2
    public Sum(array: number[]): Matrix2
    public Sum(list: List<number>): Matrix2
    public Sum(matrix: Matrix2): Matrix2
    public Sum(matrix: Matrix3): Matrix2
    public Sum(matrix: Matrix4): Matrix2
    public Sum(m11: Float32Array | number[] | List<number> | Matrix2 | Matrix3 | Matrix4 | number, m12?: number, m21?: number, m22?: number): Matrix2
    {
        return Matrix2.Sum
        (
            this,
            m11, m12,
            m21, m22
        )
    }
    
    public Mult(m11: number, m12: number, m21: number, m22: number): Matrix2
    public Mult(array: Float32Array): Matrix2
    public Mult(array: number[]): Matrix2
    public Mult(list: List<number>): Matrix2
    public Mult(matrix: Matrix2): Matrix2
    public Mult(matrix: Matrix3): Matrix2
    public Mult(matrix: Matrix4): Matrix2
    public Mult(m11: Float32Array | number[] | List<number> | Matrix2 | Matrix3 | Matrix4 | number, m12?: number, m21?: number, m22?: number): Matrix2
    {
        return Matrix2.Mult
        (
            this,
            m11, m12, 
            m21, m22
        )
    }
    
    public Scale(scaler: number): Matrix2
    {
        return Matrix2.Scale(this, scaler)
    }

    public Transpose(): Matrix2
    {
        return Matrix2.Transpose(this)
    }
    
    public Inverse(): Matrix2
    {
        return Matrix2.Inverse(this)
    }
    
    public Identity(): Matrix2
    {
        return Matrix2.Identity(this)
    }

    public Clone(): Matrix2
    {
        return new Matrix2(this)
    }
    //#endregion
    
    //#region Static Properties
    public static get ZERO(): Matrix2
    {
        return new Matrix2
        (
            0, 0,
            0, 0
        )
    }

    public static get IDENTITY(): Matrix2
    {
        return new Matrix2
        (
            1, 0,
            0, 1
        )
    }
    //#endregion

    //#region Static Methods
    public static Set(matrix: Matrix2, m11: Matrix2 | Matrix3 | Matrix4 | Float32Array | number[] | List<number> | number, m12?: number, m21?: number, m22?: number): Matrix2
    {
        [ 
            m11, m12, 
            m21, m22
        ] = Matrix2.Destructure(
            m11, m12,
            m21, m22
        )

        matrix.M11 = m11
        matrix.M12 = m12

        matrix.M21 = m21
        matrix.M22 = m22

        return matrix;
    }

    public static Transpose(matrix: Matrix2): Matrix2
    {
        return Matrix2.Set
        (
            matrix, 
            matrix.M11, matrix.M21,
            matrix.M12, matrix.M22
        )
    }

    public static Determinant(m11: Matrix2 | Matrix3 | Matrix4 | Float32Array | number[] | List<number> | number, m12?: number, m21?: number, m22?: number): number
    {
        [ 
            m11, m12,
            m21, m22 
        ] = Matrix2.Destructure(
            m11, m12,
            m21, m22
        )

        return Math.clean(m11 * m22 - m21 * m12)
    }

    public static Inverse(matrix: Matrix2): Matrix2
    {
        let det = matrix.Determinant

        if (det !== 0)
        {
            Matrix2.Set
            (
                matrix,
                matrix.M22 / det, -matrix.M12 / det,
                -matrix.M21 / det, matrix.M11 / det
            )
        }

        return matrix
    }

    public static Sum(matrix: Matrix2, m11: Matrix2 | Matrix3 | Matrix4 | Float32Array | number[] | List<number> | number, m12?: number, m21?: number, m22?: number): Matrix2
    {
        [ 
            m11, m12,
            m21, m22
        ] = Matrix2.Destructure(
            m11, m12,
            m21, m22
        )

        return Matrix2.Set(matrix, matrix.M11 + m11, matrix.M12 + m12, matrix.M21 + m21, matrix.M22 + m22)
    }

    public static Mult(matrix: Matrix2, m11: Matrix2 |  Matrix3 | Matrix4 | Float32Array | number[] | List<number> | number, m12?: number, m21?: number, m22?: number): Matrix2
    {
        [
            m11, m12,
            m21, m22
        ] = Matrix2.Destructure(
            m11, m12,
            m21, m22
        )

        return Matrix2.Set
        (
            matrix,

            matrix.M11 * m11 + matrix.M12 * m21,
            matrix.M11 * m12 + matrix.M12 * m22,

            matrix.M21 * m11 + matrix.M22 * m21,
            matrix.M21 * m12 + matrix.M22 * m22
        );
    }

    public static Scale(matrix: Matrix2, scaler: number): Matrix2
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

    public static Identity(matrix: Matrix2): Matrix2
    {
        return Matrix2.Set
        (
            matrix,
            1, 0,
            0, 1
        )
    }
    //#endregion

    //#region Helper Methods
    private static Destructure(m11: Matrix2 | Matrix3 | Matrix4 | Float32Array | number[] | List<number> | number, m12?: number, m21?: number, m22?: number): number[]
    {
        if (m11 instanceof Matrix2 || m11 instanceof Matrix3 || m11 instanceof Matrix4)
        {
            [
                m11, m12,
                m21, m22 
            ] = [
                m11.M11, m11.M12,
                m11.M21, m11.M22
            ]
        }
        else if (m11 instanceof Float32Array || m11 instanceof List || m11 instanceof Array)
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