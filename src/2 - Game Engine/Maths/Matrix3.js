/**
 * @name        Matrix3
 * @module      FWGE.Game.Maths
 * @description This library contains the methods for 3x3 matrix operations.
 *              3x3 matrices are represented as a Float32Array of length 9.
 */

window.Matrix3 = (function()
{
    /**
     * @param       {number}    m11
     * @param       {number}    m12
     * @param       {number}    m13
     * @param       {number}    m21
     * @param       {number}    m22
     * @param       {number}    m23
     * @param       {number}    m31
     * @param       {number}    m32
     * @param       {number}    m33
     */
    function Matrix3(m11 = 0, m12 = 0, m13 = 0, m21 = 0, m22 = 0, m23 = 0, m31 = 0, m32 = 0, m33 = 0)
    {
        BufferedArray.call(this, 9, Float32Array);
        this.Set(m11, m12, m13, m21, m22, m23, m31, m32, m33);

        Object.seal(this);
    }
    Object.defineProperties(Matrix3,
    {
        Identity: { get Identity() { return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1); } },
            
        /**
         * @function    Set
         * @param       {number}    m11
         * @param       {number}    m12
         * @param       {number}    m13
         * @param       {number}    m21
         * @param       {number}    m22
         * @param       {number}    m23
         * @param       {number}    m31
         * @param       {number}    m32
         * @param       {number}    m33
         * @param       {Matrix3}
         */
        Set:
        {
            value: function Set(matrix, m11, m12, m13, m21, m22, m23, m31, m32, m33)
            {
                if (m11 instanceof Matrix3)
                    m11 = m11.Buffer;

                if (m11 instanceof Array)
                {
                    m33 = m11[8]; m32 = m11[7]; m31 = m11[6];
                    m23 = m11[5]; m22 = m11[4]; m21 = m11[3];
                    m13 = m11[2]; m12 = m11[1]; m11 = m11[0];
                }

                matrix.M11 = m11; matrix.M12 = m12; matrix.M13 = m13;
                matrix.M21 = m21; matrix.M22 = m22; matrix.M23 = m23;
                matrix.M31 = m31; matrix.M32 = m32; matrix.M33 = m33;

                return matrix;
            }
        },
        
        /**
         * @function    Transpose
         * @param       {Matrix3}   matrix
         * @param       {Matrix3}
         */
        Transpose:
        {
            value: function Transpose(matrix)
            {
                return new Matrix3
                (
                    matrix.M11, matrix.M21, matrix.M31,
                    matrix.M12, matrix.M22, matrix.M32,
                    matrix.M13, matrix.M23, matrix.M33
                );
            }
        },

        /**
         * @function    Determinant
         * @param       {Matrix3}   matrix
         * @return      {number}
         */
        Determinant:
        {
            value: function Determinant(matrix)
            {
                return  matrix.M11 * (matrix.M22 * matrix.M33 - matrix.M23 * matrix.M32) -
                        matrix.M12 * (matrix.M21 * matrix.M33 - matrix.M23 * matrix.M31) + 
                        matrix.M13 * (matrix.M21 * matrix.M32 - matrix.M22 * matrix.M31);
            }
        },
        
        /**
         * @function    Inverse
         * @param       {Matrix3}   matrix
         * @return      {Matrixs}
         */
        Inverse:
        {
            value: function Inverse(matrix)
            {
                let det = this.Determinant;

                if (det !== 0)
                    det = 1;

                new Matrix3
                (
                    (this.M22 * this.M33 - this.M32 * this.M23) / det,
                    -(this.M12 * this.M33 - this.M32 * this.M13) / det,
                    (this.M12 * this.M23 - this.M22 * this.M13) / det,

                    -(this.M21 * this.M33 - this.M31 * this.M23) / det,
                    (this.M11 * this.M33 - this.M31 * this.M13) / det,
                    -(this.M11 * this.M23 - this.M21 * this.M13) / det,

                    (this.M21 * this.M32 - this.M31 * this.M22) / det,
                    -(this.M11 * this.M32 - this.M31 * this.M12) / det,
                    (this.M11 * this.M22 - this.M21 * this.M12) / det
                );
            }
        },
        
        /**
         * @function    Sum
         * @param       {Matrix3}   matrix
         * @param       {number}    m11
         * @param       {number}    m12
         * @param       {number}    m13
         * @param       {number}    m21
         * @param       {number}    m22
         * @param       {number}    m23
         * @param       {number}    m31
         * @param       {number}    m32
         * @param       {number}    m33
         * @return      {Matrix3}
         */
        Sum:
        {
            value: function Sum(matrix, m11, m12, m13, m21, m22, m23, m31, m32, m33)
            {
                return new Matrix3
                (
                    matrix.M11 + m11, matrix.M12 + m12, matrix.M13 + m13,
                    matrix.M21 + m21, matrix.M22 + m22, matrix.M23 + m23,
                    matrix.M31 + m31, matrix.M32 + m32, matrix.M33 + m33
                );
            }
        },
        
        /**
         * @function    Mult
         * @param       {Matrix3}   matrix
         * @param       {number}    m11
         * @param       {number}    m12
         * @param       {number}    m13
         * @param       {number}    m21
         * @param       {number}    m22
         * @param       {number}    m23
         * @param       {number}    m31
         * @param       {number}    m32
         * @param       {number}    m33
         * @return      {Matrix3}
         */
        Mult:
        {
            value: function Mult(matrix, m11, m12, m13, m21, m22, m23, m31, m32, m33)
            {    
                return new Matrix3
                (
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
        },

        Scale:
        {
            value: function Scale(scalar)
            {
                return Matrix3.Mult(scalar, scalar, scalar, scalar, scalar, scalar, scalar, scalar, scalar);
            }
        }
    });

    Object.defineProperties(Matrix3.prototype,
    {
        M11:
        {
            get: function M11()  { return this.Buffer[0]; },
            set: function M11(m11) { this.Buffer[0] = m11;  }
        },
        M12:
        {
            get: function M12()  { return this.Buffer[1]; },
            set: function M12(m12) { this.Buffer[1] = m12;  }
        },
        M13:
        {
            get: function M13()  { return this.Buffer[2]; },
            set: function M13(m13) { this.Buffer[2] = m13;  }
        },
        M21:
        {
            get: function M21()  { return this.Buffer[3]; },
            set: function M21(m21) { this.Buffer[3] = m21;  }
        },
        M22:
        {
            get: function M22()  { return this.Buffer[4]; },
            set: function M22(m22) { this.Buffer[4] = m22;  }
        },
        M23:
        {
            get: function M23()  { return this.Buffer[5]; },
            set: function M23(m23) { this.Buffer[5] = m23;  }
        },
        M31:
        {
            get: function M31()  { return this.Buffer[6]; },
            set: function M31(m31) { this.Buffer[6] = m31;  }
        },
        M32:
        {
            get: function M32()  { return this.Buffer[7]; },
            set: function M32(m32) { this.Buffer[7] = m32;  }
        },
        M33:
        {
            get: function M33()  { return this.Buffer[8]; },
            set: function M33(m33) { this.Buffer[8] = m33;  }
        },
        
        /**
         * @function    Set
         * @param       {number}    m11
         * @param       {number}    m12
         * @param       {number}    m13
         * @param       {number}    m21
         * @param       {number}    m22
         * @param       {number}    m23
         * @param       {number}    m31
         * @param       {number}    m32
         * @param       {number}    m33
         * @param       {Matrix3}
         */
        Set:
        {
            value: function Set(m11, m12, m13, m21, m22, m23, m31, m32, m33)
            {
                return Matrix3.Set(this, m11 instanceof Array || m11 instanceof Matrix3 ? m11 : [m11, m12, m13, m21, m22, m23, m31, m32, m33]);
            }
        },
        
        /**
         * @function    Transpose
         * @param       {Matrix3}   matrix
         * @param       {Matrix3}
         */
        Transpose:
        {
            value: function Transpose()
            {
                return this.Set
                (
                    this.M11, this.M21, this.M31,
                    this.M12, this.M22, this.M32,
                    this.M13, this.M23, this.M33
                );
            }
        },

        /**
         * @function    Determinant
         * @param       {Matrix3}   matrix
         * @return      {number}
         */
        Determinant:
        {
            get: function Determinant()
            {
                return Matrix3.Determinant(this);
            }
        },
        
        /**
         * @function    Inverse
         * @param       {Matrix3}   matrix
         * @return      {Matrixs}
         */
        Inverse:
        {
            value: function Inverse()
            {
                let det = this.Determinant;

                if (det !== 0)
                    det = 1;

                return this.Set
                (
                    (this.M22 * this.M33 - this.M32 * this.M23) / det,
                    -(this.M12 * this.M33 - this.M32 * this.M13) / det,
                    (this.M12 * this.M23 - this.M22 * this.M13) / det,

                    -(this.M21 * this.M33 - this.M31 * this.M23) / det,
                    (this.M11 * this.M33 - this.M31 * this.M13) / det,
                    -(this.M11 * this.M23 - this.M21 * this.M13) / det,

                    (this.M21 * this.M32 - this.M31 * this.M22) / det,
                    -(this.M11 * this.M32 - this.M31 * this.M12) / det,
                    (this.M11 * this.M22 - this.M21 * this.M12) / det
                );
            }
        },

        /**
         * @function    Identity
         * @return      {Matrix3}
         */
        Identity:
        {
            value: function Identity()
            {
                return this.Set
                (
                    1, 0, 0,
                    0, 1, 0,
                    0, 0, 1
                );
            }
        },
        
        /**
         * @function    Sum
         * @param       {Matrix3}   matrix
         * @param       {number}    m11
         * @param       {number}    m12
         * @param       {number}    m13
         * @param       {number}    m21
         * @param       {number}    m22
         * @param       {number}    m23
         * @param       {number}    m31
         * @param       {number}    m32
         * @param       {number}    m33
         * @return      {Matrix3}
         */
        Sum:
        {
            value: function Sum(m11, m12, m13, m21, m22, m23, m31, m32, m33)
            {
                return this.Set
                (
                    this.M11 + m11, this.M12 + m12, this.M13 + m13,
                    this.M21 + m21, this.M22 + m22, this.M23 + m23,
                    this.M31 + m31, this.M32 + m32, this.M33 + m33
                );
            }
        },
        
        /**
         * @function    Mult
         * @param       {Matrix3}   matrix
         * @param       {number}    m11
         * @param       {number}    m12
         * @param       {number}    m13
         * @param       {number}    m21
         * @param       {number}    m22
         * @param       {number}    m23
         * @param       {number}    m31
         * @param       {number}    m32
         * @param       {number}    m33
         * @return      {Matrix3}
         */
        Mult:
        {
            value: function Mult(m11, m12, m13, m21, m22, m23, m31, m32, m33)
            {    
                return this.Set
                (
                    this.M11 * m11 + this.M12 * m21 + this.M13 * m31,
                    this.M11 * m12 + this.M12 * m22 + this.M13 * m32,
                    this.M11 * m13 + this.M12 * m23 + this.M13 * m33,
                    
                    this.M21 * m11 + this.M22 * m21 + this.M23 * m31,
                    this.M21 * m12 + this.M22 * m22 + this.M23 * m32,
                    this.M21 * m13 + this.M22 * m23 + this.M23 * m33,
                    
                    this.M31 * m11 + this.M32 * m21 + this.M33 * m31,
                    this.M31 * m12 + this.M32 * m22 + this.M33 * m32,
                    this.M31 * m13 + this.M32 * m23 + this.M33 * m33
                ); 
            }
        },

        Scale:
        {
            value: function Scale(scalar)
            {
                return this.Mult(scalar, scalar, scalar, scalar, scalar, scalar, scalar, scalar, scalar);
            }
        }
    });
    Object.seal(Matrix3.prototype);

    return Matrix3;
})();
Object.seal(Matrix3);
