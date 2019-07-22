import Cloneable from '../Interfaces/Cloneable'
import List from '../Utility/List'
import Matrix2 from './Matrix2'
import Matrix3 from './Matrix3'

export default class Matrix4 extends Float32Array implements Cloneable<Matrix4>
{
    constructor()
    constructor(matrix: Matrix2)
    constructor(matrix: Matrix3)
    constructor(matrix: Matrix4)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(list: List<number>)
    constructor(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number)
    constructor(m11?: Matrix4 | Float32Array | number[] | List<number> | number, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number)
    {
        super(16)

        if (m11)
        {
            Matrix4.Set(this, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
        }
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

	get M14(): number
	{ 
		return this[3]
    }

    set M14(m14: number)
    {
        this[3] = m14
    }

	get M21(): number
	{ 
		return this[4]
    }

    set M21(m21: number)
    {
        this[4] = m21
    }

	get M22(): number
	{ 
		return this[5]
	}

    set M22(m22: number)
    {
        this[5] = m22
    }

	get M23(): number
	{ 
		return this[6]
    }

    set M23(m23: number)
    {
        this[6] = m23
    }

	get M24(): number
	{ 
		return this[7]
    }

    set M24(m24: number)
	{
        this[7] = m24
    }

	get M31(): number
	{ 
		return this[8]
    }

    set M31(m31: number)
	{
        this[8] = m31
    }

	get M32(): number
	{ 
		return this[9]
    }

	set M32(m32: number)
	{
		this[9] = m32
	}

	get M33(): number
	{ 
		return this[10]
    }

	set M33(m33: number)
	{
		this[10] = m33
	}

	get M34(): number
	{ 
		return this[11]
    }

	set M34(m34: number)
	{
		this[11] = m34
	}

	get M41(): number
	{ 
		return this[12]
    }

	set M41(m41: number)
	{
		this[12] = m41
	}    

	get M42(): number
	{ 
		return this[13]
    }

	set M42(m42: number)
	{
		this[13] = m42
	}

	get M43(): number
	{ 
		return this[14]
	}
	set M43(m43: number)
	{
		this[14] = m43
	}

	get M44(): number
	{ 
		return this[15]
    }

	set M44(m44: number)
	{
		this[15] = m44
	}

    static get ZERO()
    {
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    }

    static get IDENTITY()
    {
        return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }


    Set(matrix: Matrix2): Matrix4
    Set(matrix: Matrix3): Matrix4
    Set(matrix: Matrix4): Matrix4
    Set(array: Float32Array): Matrix4
    Set(array: number[]): Matrix4
    Set(list: List<number>): Matrix4
    Set(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    Set(m11?: Matrix4 | Float32Array | number[] | List<number> | number, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4
    {
        return Matrix4.Set(this, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
    }

    static Set(matrix: Matrix4, m11: Matrix4 | Matrix3 | Matrix2 | Float32Array | number[] | List<number> | number, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4
    {
        if (m11 instanceof Matrix2)
        {
            [
                m11, m12, m13, m14,
                m21, m22, m23, m24,
                m31, m32, m33, m34,
                m41, m42, m43, m44
            ] = [
                m11.M11, m11.M12, 0, 0,
                m11.M21, m11.M22, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ]
        }

        else if (m11 instanceof Matrix3)
        {
            [
                m11, m12, m13, m14,
                m21, m22, m23, m24,
                m31, m32, m33, m34,
                m41, m42, m43, m44
            ] = [
                m11.M11, m11.M12, m11.M13, 0,
                m11.M21, m11.M22, m11.M23, 0,
                m11.M31, m11.M32, m11.M33, 0,
                0, 0, 0, 0
            ]
        }
        
        else if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List)
        {
            [
                m11, m12, m13, m14,
                m21, m22, m23, m24,
                m31, m32, m33, m34,
                m41, m42, m43, m44
            ] = m11
        }

        matrix.M11 = m11
        matrix.M12 = m12
        matrix.M13 = m13
        matrix.M14 = m14

        matrix.M21 = m21
        matrix.M22 = m22
        matrix.M23 = m23
        matrix.M24 = m24

        matrix.M31 = m31
        matrix.M32 = m32
        matrix.M33 = m33
        matrix.M34 = m34

        matrix.M41 = m41
        matrix.M42 = m42
        matrix.M43 = m43
        matrix.M44 = m44

        return matrix
    }

    Transpose(): Matrix4
    {
        return Matrix4.Transpose(this)
    }

    static Transpose(matrix: Matrix4): Matrix4
    {
        return Matrix4.Set
        (
            matrix,
            matrix.M11, matrix.M21, matrix.M31, matrix.M41,
            matrix.M12, matrix.M22, matrix.M32, matrix.M42,
            matrix.M13, matrix.M23, matrix.M33, matrix.M43,
            matrix.M14, matrix.M24, matrix.M34, matrix.M44
        )
    }

    get Determinant(): number
    {
        return Matrix4.Determinant(this)
    }

    static Determinant(m11: Matrix4 | Float32Array | number[] | List<number> | number, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): number
    {
        if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List)
        {
            [
                m11, m12, m13, m14,
                m21, m22, m23, m24,
                m31, m32, m33, m34,
                m41, m42, m43, m44
            ] = m11
        }

        return  m11 * m22 * m33 * m44 +
                m11 * m23 * m34 * m42 +
                m11 * m24 * m32 * m43 +
                m12 * m21 * m34 * m43 +
                m12 * m23 * m31 * m44 +
                m12 * m24 * m33 * m41 +
                m13 * m21 * m32 * m44 +
                m13 * m22 * m34 * m41 +
                m13 * m24 * m31 * m42 +
                m14 * m21 * m33 * m42 +
                m14 * m22 * m31 * m43 +
                m14 * m23 * m32 * m41 -
                m11 * m22 * m34 * m43 -
                m11 * m23 * m32 * m44 -
                m11 * m24 * m33 * m42 -
                m12 * m21 * m33 * m44 -
                m12 * m23 * m34 * m41 -
                m12 * m24 * m31 * m43 -
                m13 * m21 * m34 * m42 -
                m13 * m22 * m31 * m44 -
                m13 * m24 * m32 * m41 -
                m14 * m21 * m32 * m43 -
                m14 * m22 * m33 * m41 -
                m14 * m23 * m31 * m42        
    }

    Inverse(): Matrix4
    {
        return Matrix4.Inverse(this)
    }

    static Inverse(matrix: Matrix4): Matrix4
    {
        var det = matrix.Determinant

        if (det !== 0)
        {
            Matrix4.Set
            (
                matrix,

                (matrix.M22 * matrix.M33 * matrix.M44 +
                matrix.M23 * matrix.M34 * matrix.M42 +
                matrix.M24 * matrix.M32 * matrix.M43 -
                matrix.M22 * matrix.M34 * matrix.M43 -
                matrix.M23 * matrix.M32 * matrix.M44 -
                matrix.M24 * matrix.M33 * matrix.M42) / det,

                (matrix.M12 * matrix.M34 * matrix.M43 +
                matrix.M13 * matrix.M32 * matrix.M44 +
                matrix.M14 * matrix.M33 * matrix.M42 -
                matrix.M12 * matrix.M33 * matrix.M44 -
                matrix.M13 * matrix.M34 * matrix.M42 -
                matrix.M14 * matrix.M32 * matrix.M43) / det,

                (matrix.M12 * matrix.M23 * matrix.M44 +
                matrix.M13 * matrix.M24 * matrix.M42 +
                matrix.M14 * matrix.M22 * matrix.M43 -
                matrix.M12 * matrix.M24 * matrix.M43 -
                matrix.M13 * matrix.M22 * matrix.M44 -
                matrix.M14 * matrix.M23 * matrix.M42) / det,

                (matrix.M12 * matrix.M24 * matrix.M33 +
                matrix.M13 * matrix.M22 * matrix.M34 +
                matrix.M14 * matrix.M23 * matrix.M32 -
                matrix.M12 * matrix.M23 * matrix.M34 -
                matrix.M13 * matrix.M24 * matrix.M32 -
                matrix.M14 * matrix.M22 * matrix.M33) / det,


                (matrix.M21 * matrix.M34 * matrix.M43 +
                matrix.M23 * matrix.M31 * matrix.M44 +
                matrix.M24 * matrix.M33 * matrix.M41 -
                matrix.M21 * matrix.M33 * matrix.M44 -
                matrix.M23 * matrix.M34 * matrix.M41 -
                matrix.M24 * matrix.M31 * matrix.M43) / det,

                (matrix.M11 * matrix.M33 * matrix.M44 +
                matrix.M13 * matrix.M34 * matrix.M41 +
                matrix.M14 * matrix.M31 * matrix.M43 -
                matrix.M11 * matrix.M34 * matrix.M43 -
                matrix.M13 * matrix.M31 * matrix.M44 -
                matrix.M14 * matrix.M33 * matrix.M41) / det,

                (matrix.M11 * matrix.M24 * matrix.M43 +
                matrix.M13 * matrix.M21 * matrix.M44 +
                matrix.M14 * matrix.M23 * matrix.M41 -
                matrix.M11 * matrix.M23 * matrix.M44 -
                matrix.M13 * matrix.M24 * matrix.M41 -
                matrix.M14 * matrix.M21 * matrix.M43) / det,

                (matrix.M11 * matrix.M23 * matrix.M34 +
                matrix.M13 * matrix.M24 * matrix.M31 +
                matrix.M14 * matrix.M21 * matrix.M33 -
                matrix.M11 * matrix.M24 * matrix.M33 -
                matrix.M13 * matrix.M21 * matrix.M34 -
                matrix.M14 * matrix.M23 * matrix.M31) / det,


                (matrix.M21 *  matrix.M32 * matrix.M44 +
                matrix.M22 * matrix.M34 * matrix.M41 +
                matrix.M24 * matrix.M31 * matrix.M42 -
                matrix.M21 * matrix.M34 * matrix.M42 -
                matrix.M22 * matrix.M31 * matrix.M44 -
                matrix.M24 * matrix.M32 * matrix.M41) / det,

                (matrix.M11 * matrix.M34 * matrix.M42 +
                matrix.M12 * matrix.M31 * matrix.M44 +
                matrix.M14 * matrix.M32 * matrix.M41 -
                matrix.M11 * matrix.M32 * matrix.M44 -
                matrix.M12 * matrix.M34 * matrix.M41 -
                matrix.M14 * matrix.M31 * matrix.M42) / det,

                (matrix.M11 * matrix.M22 * matrix.M44 +
                matrix.M12 * matrix.M24 * matrix.M41 +
                matrix.M14 * matrix.M21 * matrix.M42 -
                matrix.M11 * matrix.M24 * matrix.M42 -
                matrix.M12 * matrix.M21 * matrix.M44 -
                matrix.M14 * matrix.M22 * matrix.M41) / det,

                (matrix.M11 * matrix.M24 * matrix.M32 +
                matrix.M12 * matrix.M21 * matrix.M34 +
                matrix.M14 * matrix.M22 * matrix.M31 -
                matrix.M11 * matrix.M22 * matrix.M34 -
                matrix.M12 * matrix.M24 * matrix.M31 -
                matrix.M14 * matrix.M21 * matrix.M32) / det,


                (matrix.M21 * matrix.M33 * matrix.M42 +
                matrix.M22 * matrix.M31 * matrix.M43 +
                matrix.M23 * matrix.M32 * matrix.M41 -
                matrix.M21 * matrix.M32 * matrix.M43 -
                matrix.M22 * matrix.M33 * matrix.M41 -
                matrix.M23 * matrix.M31 * matrix.M42) / det,

                (matrix.M11 * matrix.M32 * matrix.M43 +
                matrix.M12 * matrix.M33 * matrix.M41 +
                matrix.M13 * matrix.M31 * matrix.M42 -
                matrix.M11 * matrix.M33 * matrix.M42 -
                matrix.M12 * matrix.M31 * matrix.M43 -
                matrix.M13 * matrix.M32 * matrix.M41) / det,

                (matrix.M11 * matrix.M23 * matrix.M42 +
                matrix.M12 * matrix.M21 * matrix.M43 +
                matrix.M13 * matrix.M22 * matrix.M41 -
                matrix.M11 * matrix.M22 * matrix.M43 -
                matrix.M12 * matrix.M23 * matrix.M41 -
                matrix.M13 * matrix.M21 * matrix.M42) / det,

                (matrix.M11 * matrix.M22 * matrix.M33 +
                matrix.M12 * matrix.M23 * matrix.M31 +
                matrix.M13 * matrix.M21 * matrix.M32 -
                matrix.M11 * matrix.M23 * matrix.M32 -
                matrix.M12 * matrix.M21 * matrix.M33 -
                matrix.M13 * matrix.M22 * matrix.M31) / det
            )
        }

        return matrix
    }

    Sum(matrix: Matrix4): Matrix4
    Sum(array: Float32Array): Matrix4
    Sum(array: number[]): Matrix4
    Sum(list: List<number>): Matrix4
    Sum(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    Sum(m11?: Matrix4 | Float32Array | number[] | List<number> | number, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4
    {
        return Matrix4.Set(this, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
    }
    static Sum(matrix: Matrix4, m11: Matrix4 | Float32Array | number[] | List<number> | number, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4
    {
        if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List)
        {
            [
                m11, m12, m13, m14,
                m21, m22, m23, m24,
                m31, m32, m33, m34,
                m41, m42, m43, m44
            ] = m11
        }

        return Matrix4.Set
        (
            matrix,
            matrix.M11 + m11, matrix.M12 + m12, matrix.M13 + m13, matrix.M14 + m14,
            matrix.M21 + m21, matrix.M22 + m22, matrix.M23 + m23, matrix.M24 + m24,
            matrix.M31 + m31, matrix.M32 + m32, matrix.M33 + m33, matrix.M34 + m34,
            matrix.M41 + m41, matrix.M42 + m42, matrix.M43 + m43, matrix.M44 + m44
        );
    }

    Mult(matrix: Matrix4): Matrix4
    Mult(array: Float32Array): Matrix4
    Mult(array: number[]): Matrix4
    Mult(list: List<number>): Matrix4
    Mult(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4
    Mult(m11?: Matrix4 | Float32Array | number[] | List<number> | number, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4
    {
        return Matrix4.Mult(this, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
    }
    static Mult(matrix: Matrix4, m11: Matrix4 | Float32Array | number[] | List<number> | number, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4
    {
        if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List)
        {
            [
                m11, m12, m13, m14,
                m21, m22, m23, m24,
                m31, m32, m33, m34,
                m41, m42, m43, m44
            ] = m11
        }

        return Matrix4.Set
        (
            matrix,

            matrix.M11 * m11 + matrix.M12 * m21 + matrix.M13 * m31 + matrix.M14 * m41,
            matrix.M11 * m12 + matrix.M12 * m22 + matrix.M13 * m32 + matrix.M14 * m42,
            matrix.M11 * m13 + matrix.M12 * m23 + matrix.M13 * m33 + matrix.M14 * m43,
            matrix.M11 * m14 + matrix.M12 * m24 + matrix.M13 * m34 + matrix.M14 * m44,

            matrix.M21 * m11 + matrix.M22 * m21 + matrix.M23 * m31 + matrix.M24 * m41,
            matrix.M21 * m12 + matrix.M22 * m22 + matrix.M23 * m32 + matrix.M24 * m42,
            matrix.M21 * m13 + matrix.M22 * m23 + matrix.M23 * m33 + matrix.M24 * m43,
            matrix.M21 * m14 + matrix.M22 * m24 + matrix.M23 * m34 + matrix.M24 * m44,

            matrix.M31 * m11 + matrix.M32 * m21 + matrix.M33 * m31 + matrix.M34 * m41,
            matrix.M31 * m12 + matrix.M32 * m22 + matrix.M33 * m32 + matrix.M34 * m42,
            matrix.M31 * m13 + matrix.M32 * m23 + matrix.M33 * m33 + matrix.M34 * m43,
            matrix.M31 * m14 + matrix.M32 * m24 + matrix.M33 * m34 + matrix.M34 * m44,
        
            matrix.M41 * m11 + matrix.M42 * m21 + matrix.M43 * m31 + matrix.M44 * m41,
            matrix.M41 * m12 + matrix.M42 * m22 + matrix.M43 * m32 + matrix.M44 * m42,
            matrix.M41 * m13 + matrix.M42 * m23 + matrix.M43 * m33 + matrix.M44 * m43,
            matrix.M41 * m14 + matrix.M42 * m24 + matrix.M43 * m34 + matrix.M44 * m44
        )
    }
    
    Scale(scaler: number): Matrix4
    {
        return Matrix4.Scale(this, scaler)
    }

    static Scale(matrix: Matrix4, scaler: number): Matrix4
    {
        return Matrix4.Set
        (
            matrix,

            matrix.M11 * scaler,
            matrix.M12 * scaler,
            matrix.M13 * scaler,
            matrix.M14 * scaler,

            matrix.M21 * scaler,
            matrix.M22 * scaler,
            matrix.M23 * scaler,
            matrix.M24 * scaler,

            matrix.M31 * scaler,
            matrix.M32 * scaler,
            matrix.M33 * scaler,
            matrix.M34 * scaler,

            matrix.M41 * scaler,
            matrix.M42 * scaler,
            matrix.M43 * scaler,
            matrix.M44 * scaler
        )
    }

    Identity(): Matrix4
    {
        return Matrix4.Identity(this)
    }

    static Identity(matrix: Matrix4): Matrix4
    {
        return Matrix4.Set
        (
            matrix,
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    Clone(): Matrix4
    {
        return new Matrix4(this)
    }
}