import Cloneable from '../Interfaces/Cloneable';
import List from '../Utility/List';
import './Maths';
import Matrix2 from './Matrix2';
import Matrix4 from './Matrix4';

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
        return Matrix3.Determinant(this)
    }
    //#endregion

    //#region Public Methods
    constructor()
    constructor(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(list: List<number>)
    constructor(matrix: Matrix2)
    constructor(matrix: Matrix3)
    constructor(matrix: Matrix4)
    constructor(m11?: Float32Array | number[] | List<number> | Matrix2 | Matrix3 | Matrix4 | number, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number)
    {
        super(9)

        if (m11)
        {
            Matrix3.Set
            (
                this,
                m11, m12, m13,
                m21, m22, m23,
                m31, m32, m33
            )
        }
    }

    public Set(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3
    public Set(array: Float32Array): Matrix3
    public Set(array: number[]): Matrix3
    public Set(list: List<number>): Matrix3
    public Set(matrix: Matrix2): Matrix3
    public Set(matrix: Matrix3): Matrix3
    public Set(matrix: Matrix4): Matrix3
    public Set(m11: Float32Array | number[] | List<number> | Matrix2 | Matrix3 | Matrix4 | number, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): Matrix3
    {
        return Matrix3.Set
        (
            this,
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        )
    }
    
    public Sum(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3
    public Sum(array: Float32Array): Matrix3
    public Sum(array: number[]): Matrix3
    public Sum(list: List<number>): Matrix3
    public Sum(matrix: Matrix2): Matrix3
    public Sum(matrix: Matrix3): Matrix3
    public Sum(matrix: Matrix4): Matrix3
    public Sum(m11: Float32Array | number[] | List<number> | Matrix2 | Matrix3 | Matrix4 | number, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): Matrix3
    {
        return Matrix3.Sum
        (
            this,
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        )
    }

    public Mult(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3
    public Mult(array: Float32Array): Matrix3
    public Mult(array: number[]): Matrix3
    public Mult(list: List<number>): Matrix3
    public Mult(matrix: Matrix2): Matrix3
    public Mult(matrix: Matrix3): Matrix3
    public Mult(matrix: Matrix4): Matrix3
    public Mult(m11: Float32Array | number[] | List<number> | Matrix2 | Matrix3 | Matrix4 | number, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): Matrix3
    {
        return Matrix3.Mult
        (
            this,
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        )
    }

    public Scale(scaler: number): Matrix3
    {
        return Matrix3.Scale(this, scaler)
    }
    
    public Transpose(): Matrix3
    {
        return Matrix3.Transpose(this)
    }

    public Inverse(): Matrix3
    {
        return Matrix3.Inverse(this)
    }

    public Identity(): Matrix3
    {
        return Matrix3.Identity(this)
    }

    public Clone(): Matrix3
    {
        return new Matrix3(this)
    }
    //#endregion

    //#region Static Properties
    public static get ZERO(): Matrix3
    {
        return new Matrix3
        (
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        )
    }

    public static get IDENTITY(): Matrix3
    {
        return new Matrix3
        (
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        )
    }
    //#endregion

    //#region Static Methods
    public static Set(matrix: Matrix3, m11: Float32Array | number[] | List<number> | Matrix2 | Matrix3 | Matrix4 | number, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): Matrix3
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

        matrix.M11 = m11
        matrix.M12 = m12
        matrix.M13 = m13

        matrix.M21 = m21
        matrix.M22 = m22
        matrix.M23 = m23

        matrix.M31 = m31
        matrix.M32 = m32
        matrix.M33 = m33

        return matrix
    }

    public static Transpose(matrix: Matrix3): Matrix3
    {
        return Matrix3.Set
        (
            matrix,
            matrix.M11, matrix.M21, matrix.M31,
            matrix.M12, matrix.M22, matrix.M32,
            matrix.M13, matrix.M23, matrix.M33
        )
    }

    public static Determinant(m11: Float32Array | number[] | List<number> | Matrix2 | Matrix3 | Matrix4 | number, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): number
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

        return Math.clean( m11 * (m22 * m33 - m23 * m32) -
                        m12 * (m21 * m33 - m23 * m31) + 
                        m13 * (m21 * m32 - m22 * m31))
    }

    public static Inverse(matrix: Matrix3): Matrix3
    {
        let det = matrix.Determinant

        if (det !== 0)
        {
            Matrix3.Set
            (
                matrix,

                (matrix.M22 * matrix.M33 - matrix.M32 * matrix.M23) / det,
                (matrix.M32 * matrix.M13 - matrix.M12 * matrix.M33) / det,
                (matrix.M12 * matrix.M23 - matrix.M22 * matrix.M13) / det,

                (matrix.M31 * matrix.M23 - matrix.M21 * matrix.M33) / det,
                (matrix.M11 * matrix.M33 - matrix.M31 * matrix.M13) / det,
                (matrix.M21 * matrix.M13 - matrix.M11 * matrix.M23) / det,

                (matrix.M21 * matrix.M32 - matrix.M31 * matrix.M22) / det,
                (matrix.M31 * matrix.M12 - matrix.M11 * matrix.M32) / det,
                (matrix.M11 * matrix.M22 - matrix.M21 * matrix.M12) / det
            )
        }

        return matrix
    }

    public static Sum(matrix: Matrix3, m11: Float32Array | number[] | List<number> | Matrix2 | Matrix3 | Matrix4 | number, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): Matrix3
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

        return Matrix3.Set
        (
            matrix,

            matrix.M11 + m11,
            matrix.M12 + m12,
            matrix.M13 + m13,
            
            matrix.M21 + m21,
            matrix.M22 + m22,
            matrix.M23 + m23,
            
            matrix.M31 + m31,
            matrix.M32 + m32,
            matrix.M33 + m33
        )
    }

    public static Mult(matrix: Matrix3, m11: Float32Array | number[] | List<number> | Matrix2 | Matrix3 | Matrix4 | number, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): Matrix3
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

        return Matrix3.Set
        (
            matrix,

            matrix.M11 * m11 + matrix.M12 * m21 + matrix.M13 * m31,
            matrix.M11 * m12 + matrix.M12 * m22 + matrix.M13 * m32,
            matrix.M11 * m13 + matrix.M12 * m23 + matrix.M13 * m33,

            matrix.M21 * m11 + matrix.M22 * m21 + matrix.M23 * m31,
            matrix.M21 * m12 + matrix.M22 * m22 + matrix.M23 * m32,
            matrix.M21 * m13 + matrix.M22 * m23 + matrix.M23 * m33,

            matrix.M31 * m11 + matrix.M32 * m21 + matrix.M33 * m31,
            matrix.M31 * m12 + matrix.M32 * m22 + matrix.M33 * m32,
            matrix.M31 * m13 + matrix.M32 * m23 + matrix.M33 * m33
        );
    }

    public static Scale(matrix: Matrix3, scaler: number): Matrix3
    {
        return Matrix3.Set
        (
            matrix,

            matrix.M11 * scaler,
            matrix.M12 * scaler,
            matrix.M13 * scaler,
            
            matrix.M21 * scaler,
            matrix.M22 * scaler,
            matrix.M23 * scaler,
    
            matrix.M31 * scaler,
            matrix.M32 * scaler,
            matrix.M33 * scaler
        )
    }

    public static Identity(matrix: Matrix3): Matrix3
    {
        return Matrix3.Set
        (
            matrix,
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        );
    }
    //#endregion

    //#region Static Helpers
    private static Destructure(m11: Float32Array | number[] | List<number> | Matrix2 | Matrix3 | Matrix4 | number, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): number[]
    {
        if (m11 instanceof Matrix2)
        {
            [ 
                m11, m12, m13,
                m21, m22, m23,
                m31, m32, m33
            ] = [
                m11.M11, m11.M12, 0,
                m11.M21, m11.M22, 0,
                0, 0, 0
            ]
        }
        else if (m11 instanceof Matrix3 || m11 instanceof Matrix4)
        {
            [ 
                m11, m12, m13,
                m21, m22, m23,
                m31, m32, m33
            ] = [
                m11.M11, m11.M12, m11.M13,
                m11.M21, m11.M22, m11.M23,
                m11.M31, m11.M32, m11.M33
            ]
        }        
        else if (m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List)
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