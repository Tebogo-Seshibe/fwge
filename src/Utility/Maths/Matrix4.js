/**
 * @name        Matrix4
 * @module      FWGE.Game.Maths
 * @description This library contains the methods for 2x2 matrix operations.
 *              4x4 matrices are represented as a Float32Array of length 16.
 */

window.Matrix4 = (function()
{
    /**
     * @param   {number}    m11
     * @param   {number}    m12
     * @param   {number}    m13
     * @param   {number}    m14
     * @param   {number}    m21
     * @param   {number}    m22
     * @param   {number}    m23
     * @param   {number}    m24
     * @param   {number}    m31
     * @param   {number}    m32
     * @param   {number}    m33
     * @param   {number}    m34
     * @param   {number}    m41
     * @param   {number}    m42
     * @param   {number}    m43
     * @param   {number}    m44
     */
    function Matrix4(m11 = 0, m12 = 0, m13 = 0, m14 = 0, m21 = 0, m22 = 0, m23 = 0, m24 = 0, m31 = 0, m32 = 0, m33 = 0, m34 = 0, m41 = 0, m42 = 0, m43 = 0, m44 = 0)
    {
        BufferedArray.call(this, 16, Float32Array);
        this.Set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);

        Object.seal(this);
    }

    Object.defineProperties(Matrix4,
    {
        Identity: { get: function Identity() { return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); } },
        
        /**
         * @function    Set
         * @param       {Matrix4}   matrix
         * @param       {number}    m11
         * @param       {number}    m12
         * @param       {number}    m13
         * @param       {number}    m14
         * @param       {number}    m21
         * @param       {number}    m22
         * @param       {number}    m23
         * @param       {number}    m24
         * @param       {number}    m31
         * @param       {number}    m32
         * @param       {number}    m33
         * @param       {number}    m34
         * @param       {number}    m41
         * @param       {number}    m42
         * @param       {number}    m43
         * @param       {number}    m44
         * @return      {Matrix4}
         */
        Set:
        {
            value: function Set(matrix, m11 = 0, m12 = 0, m13 = 0, m14 = 0, m21 = 0, m22 = 0, m23 = 0, m24 = 0, m31 = 0, m32 = 0, m33 = 0, m34 = 0, m41 = 0, m42 = 0, m43 = 0, m44 = 0)
            {
                if (m11 instanceof Matrix4)
                    m11 = m11.Buffer;

                if (m11 instanceof Float32Array || m11 instanceof Array)
                {
                    m44 = m11[15]; m43 = m11[14]; m42 = m11[13]; m41 = m11[12];
                    m34 = m11[11]; m33 = m11[10]; m32 = m11[9];  m31 = m11[8];
                    m24 = m11[7];  m23 = m11[6];  m22 = m11[5];  m21 = m11[4];
                    m14 = m11[3];  m13 = m11[2];  m12 = m11[1];  m11 = m11[0];
                }

                matrix.M11 = m11; matrix.M12 = m12; matrix.M13 = m13; matrix.M14 = m14;
                matrix.M21 = m21; matrix.M22 = m22; matrix.M23 = m23; matrix.M24 = m24;
                matrix.M31 = m31; matrix.M32 = m32; matrix.M33 = m33; matrix.M34 = m34;
                matrix.M41 = m41; matrix.M42 = m42; matrix.M43 = m43; matrix.M44 = m44;

                return matrix;
            }
        },    
        /**
         * @function    Transpose
         * @return      {Matrix4}
         */
        Transpose:
        {
            value: function Transpose(matrix)
            {
                return new Matrix4
                (
                    matrix.M11, matrix.M21, matrix.M31, matrix.M41,
                    matrix.M12, matrix.M22, matrix.M32, matrix.M42,
                    matrix.M13, matrix.M23, matrix.M33, matrix.M43,
                    matrix.M14, matrix.M24, matrix.M34, matrix.M44
                );
            }
        },
        
        /**
         * @function    Determinant
         * @param       {Matrix4} matrix
         * @return      {Matrix4}
         */
        Determinant:
        {
            value: function Determinant(matrix)
            {
                return  matrix.M11 * matrix.M22 * matrix.M33 * matrix.M44 +
                        matrix.M11 * matrix.M23 * matrix.M34 * matrix.M42 +
                        matrix.M11 * matrix.M24 * matrix.M32 * matrix.M43 +
                        matrix.M12 * matrix.M21 * matrix.M34 * matrix.M43 +
                        matrix.M12 * matrix.M23 * matrix.M31 * matrix.M44 +
                        matrix.M12 * matrix.M24 * matrix.M33 * matrix.M41 +
                        matrix.M13 * matrix.M21 * matrix.M32 * matrix.M44 +
                        matrix.M13 * matrix.M22 * matrix.M34 * matrix.M41 +
                        matrix.M13 * matrix.M24 * matrix.M31 * matrix.M42 +
                        matrix.M14 * matrix.M21 * matrix.M33 * matrix.M42 +
                        matrix.M14 * matrix.M22 * matrix.M31 * matrix.M43 +
                        matrix.M14 * matrix.M23 * matrix.M32 * matrix.M41 -
                        matrix.M11 * matrix.M22 * matrix.M34 * matrix.M43 -
                        matrix.M11 * matrix.M23 * matrix.M32 * matrix.M44 -
                        matrix.M11 * matrix.M24 * matrix.M33 * matrix.M42 -
                        matrix.M12 * matrix.M21 * matrix.M33 * matrix.M44 -
                        matrix.M12 * matrix.M23 * matrix.M34 * matrix.M41 -
                        matrix.M12 * matrix.M24 * matrix.M31 * matrix.M43 -
                        matrix.M13 * matrix.M21 * matrix.M34 * matrix.M42 -
                        matrix.M13 * matrix.M22 * matrix.M31 * matrix.M44 -
                        matrix.M13 * matrix.M24 * matrix.M32 * matrix.M41 -
                        matrix.M14 * matrix.M21 * matrix.M32 * matrix.M43 -
                        matrix.M14 * matrix.M22 * matrix.M33 * matrix.M41 -
                        matrix.M14 * matrix.M23 * matrix.M31 * matrix.M42;
            }
        },
        
        /**
         * @function    Inverse
         * @param       {Matrix4}   matrix
         * @return      {Matrix4}
         */
        Inverse:
        {
            value: function Inverse(matrix)
            {
                var det = matrix.Determinant;

                if (det !== 0)
                    det = 1;

                return new Matrix4
                (
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
                );
            }
        },

        /**
         * @function    Sum
         * @param       {Matrix4}   matrix    
         * @param       {number}    m11
         * @param       {number}    m12
         * @param       {number}    m13
         * @param       {number}    m14
         * @param       {number}    m21
         * @param       {number}    m22
         * @param       {number}    m23
         * @param       {number}    m24
         * @param       {number}    m31
         * @param       {number}    m32
         * @param       {number}    m33
         * @param       {number}    m34
         * @param       {number}    m41
         * @param       {number}    m42
         * @param       {number}    m43
         * @param       {number}    m44
         * @return      {Matrix4}
         */
        Sum:
        {   
            value: function Sum(matrix, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
            {
                if (m11 instanceof Matrix4)
                    m11 = m11.Buffer;

                if (m11 instanceof Float32Array || m11 instanceof Array)
                {
                    m44 = m11[15]; m43 = m11[14]; m42 = m11[13]; m41 = m11[12];
                    m34 = m11[11]; m33 = m11[10]; m32 = m11[9];  m31 = m11[8];
                    m24 = m11[7];  m23 = m11[6];  m22 = m11[5];  m21 = m11[4];
                    m14 = m11[3];  m13 = m11[2];  m12 = m11[1];  m11 = m11[0];
                }

                return new Matrix4
                (
                    matrix.M11 + m11, matrix.M12 + m12, matrix.M13 + m13, matrix.M14 + m14,
                    matrix.M21 + m21, matrix.M22 + m22, matrix.M23 + m23, matrix.M24 + m24,
                    matrix.M31 + m31, matrix.M32 + m32, matrix.M33 + m33, matrix.M34 + m34,
                    matrix.M41 + m41, matrix.M42 + m42, matrix.M43 + m43, matrix.M44 + m44
                );
            }
        },
        
        /**
         * @function    Mult
         * @param       {number}    m11
         * @param       {number}    m12
         * @param       {number}    m13
         * @param       {number}    m14
         * @param       {number}    m21
         * @param       {number}    m22
         * @param       {number}    m23
         * @param       {number}    m24
         * @param       {number}    m31
         * @param       {number}    m32
         * @param       {number}    m33
         * @param       {number}    m34
         * @param       {number}    m41
         * @param       {number}    m42
         * @param       {number}    m43
         * @param       {number}    m44
         * @return      {Matrix4}
         */
        Mult:
        {
            value: function Mult(matrix, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
            {
                if (m11 instanceof Matrix4)
                    m11 = m11.Buffer;

                if (m11 instanceof Float32Array || m11 instanceof Array)
                {
                    m44 = m11[15]; m43 = m11[14]; m42 = m11[13]; m41 = m11[12];
                    m34 = m11[11]; m33 = m11[10]; m32 = m11[9];  m31 = m11[8];
                    m24 = m11[7];  m23 = m11[6];  m22 = m11[5];  m21 = m11[4];
                    m14 = m11[3];  m13 = m11[2];  m12 = m11[1];  m11 = m11[0];
                }
                return new Matrix4
                (
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
                ); 
            }
        },

        Scale:
        {
            value: function Scale(matrix, scaler)
            {
                return Matrix4.Mult
                (
                    matrix,
                    scaler, scaler, scaler, scaler,
                    scaler, scaler, scaler, scaler,
                    scaler, scaler, scaler, scaler,
                    scaler, scaler, scaler, scaler
                );
            }
        }
    });

    Object.defineProperties(Matrix4.prototype,
    {
        M11:
        {
            get: function M11() { return this.Buffer[0];  },
            set: function M11(m11) { this.Buffer[0] = m11;   }
        },
        M12:
        {
            get: function M12() { return this.Buffer[1];  },
            set: function M12(m12) { this.Buffer[1] = m12;   }
        },
        M13:
        {
            get: function M13() { return this.Buffer[2];  },
            set: function M13(m13) { this.Buffer[2] = m13;   }
        },
        M14:
        {
            get: function M14() { return this.Buffer[3];  },
            set: function M14(m14) { this.Buffer[3] = m14;   }
        },
        M21:
        {
            get: function M21() { return this.Buffer[4];  },
            set: function M21(m21) { this.Buffer[4] = m21;   }
        },
        M22:
        {
            get: function M22() { return this.Buffer[5];  },
            set: function M22(m22) { this.Buffer[5] = m22;   }
        },
        M23:
        {
            get: function M23() { return this.Buffer[6];  },
            set: function M23(m23) { this.Buffer[6] = m23;   }
        },
        M24:
        {
            get: function M24() { return this.Buffer[7];  },
            set: function M24(m24) { this.Buffer[7] = m24;   }
        },
        M31:
        {
            get: function M31() { return this.Buffer[8];  },
            set: function M31(m31) { this.Buffer[8] = m31;   }
        },
        M32:
        {
            get: function M32() { return this.Buffer[9];  },
            set: function M32(m32) { this.Buffer[9] = m32;   }
        },
        M33:
        {
            get: function M33() { return this.Buffer[10]; },
            set: function M33(m33) { this.Buffer[10] = m33;  }
        },
        M34:
        {
            get: function M34() { return this.Buffer[11]; },
            set: function M34(m34) { this.Buffer[11] = m34;  }
        },
        M41:
        {
            get: function M41() { return this.Buffer[12]; },
            set: function M41(m41) { this.Buffer[12] = m41;  }
        },
        M42:
        {
            get: function M42() { return this.Buffer[13]; },
            set: function M42(m42) { this.Buffer[13] = m42;  }
        },
        M43:
        {
            get: function M43() { return this.Buffer[14]; },
            set: function M43(m43) { this.Buffer[14] = m43;  }
        },
        M44:
        {
            get: function M44() { return this.Buffer[15]; },
            set: function M44(m44) { this.Buffer[15] = m44;  }
        },


        /**
         * @function    Set
         * @param       {Matrix4}   matrix
         * @param       {number}    m11
         * @param       {number}    m12
         * @param       {number}    m13
         * @param       {number}    m14
         * @param       {number}    m21
         * @param       {number}    m22
         * @param       {number}    m23
         * @param       {number}    m24
         * @param       {number}    m31
         * @param       {number}    m32
         * @param       {number}    m33
         * @param       {number}    m34
         * @param       {number}    m41
         * @param       {number}    m42
         * @param       {number}    m43
         * @param       {number}    m44
         * @return      {Matrix4}
         */
        Set:
        {
            value: function Set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
            {
                return Matrix4.Set(this, m11 instanceof Array || m11 instanceof Float32Array || m11 instanceof Matrix4 ? m11 : [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44]);
            }
        },

        /**
         * @function    Transpose
         * @return      {Matrix4}
         */
        Transpose:
        {
            value: function Transpose()
            {
                return this.Set
                (
                    this.M11, this.M21, this.M31, this.M41,
                    this.M12, this.M22, this.M32, this.M42,
                    this.M13, this.M23, this.M33, this.M43,
                    this.M14, this.M24, this.M34, this.M44
                );
            }
        },
        
        /**
         * @function    Identity
         * @return      {Matrix4}
         */
        Identity:
        {
            value: function Identity()
            {
                return this.Set
                (
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                );
            }
        },

        /**
         * @function    Determinant
         * @return      {Matrix4}
         */
        Determinant:
        {
            get: function Determinant()
            {
                return Matrix4.Determinant(this);
            }
        },

        /**
         * @function    Inverse
         * @return      {Matrix4}
         */
        Inverse:
        {
            value: function Inverse()
            {
                var det = this.Determinant;

                if (det !== 0)
                    det = 1;

                return this.Set
                (
                    (this.M22 * this.M33 * this.M44 +
                    this.M23 * this.M34 * this.M42 +
                    this.M24 * this.M32 * this.M43 -
                    this.M22 * this.M34 * this.M43 -
                    this.M23 * this.M32 * this.M44 -
                    this.M24 * this.M33 * this.M42) / det,
                    (this.M12 * this.M34 * this.M43 +
                    this.M13 * this.M32 * this.M44 +
                    this.M14 * this.M33 * this.M42 -
                    this.M12 * this.M33 * this.M44 -
                    this.M13 * this.M34 * this.M42 -
                    this.M14 * this.M32 * this.M43) / det,
                    (this.M12 * this.M23 * this.M44 +
                    this.M13 * this.M24 * this.M42 +
                    this.M14 * this.M22 * this.M43 -
                    this.M12 * this.M24 * this.M43 -
                    this.M13 * this.M22 * this.M44 -
                    this.M14 * this.M23 * this.M42) / det,
                    (this.M12 * this.M24 * this.M33 +
                    this.M13 * this.M22 * this.M34 +
                    this.M14 * this.M23 * this.M32 -
                    this.M12 * this.M23 * this.M34 -
                    this.M13 * this.M24 * this.M32 -
                    this.M14 * this.M22 * this.M33) / det,
                
                    (this.M21 * this.M34 * this.M43 +
                    this.M23 * this.M31 * this.M44 +
                    this.M24 * this.M33 * this.M41 -
                    this.M21 * this.M33 * this.M44 -
                    this.M23 * this.M34 * this.M41 -
                    this.M24 * this.M31 * this.M43) / det,
                    (this.M11 * this.M33 * this.M44 +
                    this.M13 * this.M34 * this.M41 +
                    this.M14 * this.M31 * this.M43 -
                    this.M11 * this.M34 * this.M43 -
                    this.M13 * this.M31 * this.M44 -
                    this.M14 * this.M33 * this.M41) / det,
                    (this.M11 * this.M24 * this.M43 +
                    this.M13 * this.M21 * this.M44 +
                    this.M14 * this.M23 * this.M41 -
                    this.M11 * this.M23 * this.M44 -
                    this.M13 * this.M24 * this.M41 -
                    this.M14 * this.M21 * this.M43) / det,
                    (this.M11 * this.M23 * this.M34 +
                    this.M13 * this.M24 * this.M31 +
                    this.M14 * this.M21 * this.M33 -
                    this.M11 * this.M24 * this.M33 -
                    this.M13 * this.M21 * this.M34 -
                    this.M14 * this.M23 * this.M31) / det,
                
                    (this.M21 *  this.M32 * this.M44 +
                    this.M22 * this.M34 * this.M41 +
                    this.M24 * this.M31 * this.M42 -
                    this.M21 * this.M34 * this.M42 -
                    this.M22 * this.M31 * this.M44 -
                    this.M24 * this.M32 * this.M41) / det,
                    (this.M11 * this.M34 * this.M42 +
                    this.M12 * this.M31 * this.M44 +
                    this.M14 * this.M32 * this.M41 -
                    this.M11 * this.M32 * this.M44 -
                    this.M12 * this.M34 * this.M41 -
                    this.M14 * this.M31 * this.M42) / det,
                    (this.M11 * this.M22 * this.M44 +
                    this.M12 * this.M24 * this.M41 +
                    this.M14 * this.M21 * this.M42 -
                    this.M11 * this.M24 * this.M42 -
                    this.M12 * this.M21 * this.M44 -
                    this.M14 * this.M22 * this.M41) / det,
                    (this.M11 * this.M24 * this.M32 +
                    this.M12 * this.M21 * this.M34 +
                    this.M14 * this.M22 * this.M31 -
                    this.M11 * this.M22 * this.M34 -
                    this.M12 * this.M24 * this.M31 -
                    this.M14 * this.M21 * this.M32) / det,
                
                    (this.M21 * this.M33 * this.M42 +
                    this.M22 * this.M31 * this.M43 +
                    this.M23 * this.M32 * this.M41 -
                    this.M21 * this.M32 * this.M43 -
                    this.M22 * this.M33 * this.M41 -
                    this.M23 * this.M31 * this.M42) / det,
                    (this.M11 * this.M32 * this.M43 +
                    this.M12 * this.M33 * this.M41 +
                    this.M13 * this.M31 * this.M42 -
                    this.M11 * this.M33 * this.M42 -
                    this.M12 * this.M31 * this.M43 -
                    this.M13 * this.M32 * this.M41) / det,
                    (this.M11 * this.M23 * this.M42 +
                    this.M12 * this.M21 * this.M43 +
                    this.M13 * this.M22 * this.M41 -
                    this.M11 * this.M22 * this.M43 -
                    this.M12 * this.M23 * this.M41 -
                    this.M13 * this.M21 * this.M42) / det,
                    (this.M11 * this.M22 * this.M33 +
                    this.M12 * this.M23 * this.M31 +
                    this.M13 * this.M21 * this.M32 -
                    this.M11 * this.M23 * this.M32 -
                    this.M12 * this.M21 * this.M33 -
                    this.M13 * this.M22 * this.M31) / det);
            }
        },

        /**
         * @function    Sum
         * @param       {number}    m11
         * @param       {number}    m12
         * @param       {number}    m13
         * @param       {number}    m14
         * @param       {number}    m21
         * @param       {number}    m22
         * @param       {number}    m23
         * @param       {number}    m24
         * @param       {number}    m31
         * @param       {number}    m32
         * @param       {number}    m33
         * @param       {number}    m34
         * @param       {number}    m41
         * @param       {number}    m42
         * @param       {number}    m43
         * @param       {number}    m44
         * @return      {Matrix4}
         */
        Sum:
        {   
            value: function Sum(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
            {
                if (m11 instanceof Matrix4)
                    m11 = m11.Buffer;

                if (m11 instanceof Array)
                {
                    m44 = m11[15]; m43 = m11[14]; m42 = m11[13]; m41 = m11[12];
                    m34 = m11[11]; m33 = m11[10]; m32 = m11[9];  m31 = m11[8];
                    m24 = m11[7];  m23 = m11[6];  m22 = m11[5];  m21 = m11[4];
                    m14 = m11[3];  m13 = m11[2];  m12 = m11[1];  m11 = m11[0];
                }

                return this.Set
                (
                    this.M11 + m11, this.M12 + m12, this.M13 + m13, this.M14 + m14,
                    this.M21 + m21, this.M22 + m22, this.M23 + m23, this.M24 + m24,
                    this.M31 + m31, this.M32 + m32, this.M33 + m33, this.M34 + m34,
                    this.M41 + m41, this.M42 + m42, this.M43 + m43, this.M44 + m44
                );
            }
        },
        
        /**
         * @function    Mult
         * @param       {number}    m11
         * @param       {number}    m12
         * @param       {number}    m13
         * @param       {number}    m14
         * @param       {number}    m21
         * @param       {number}    m22
         * @param       {number}    m23
         * @param       {number}    m24
         * @param       {number}    m31
         * @param       {number}    m32
         * @param       {number}    m33
         * @param       {number}    m34
         * @param       {number}    m41
         * @param       {number}    m42
         * @param       {number}    m43
         * @param       {number}    m44
         * @return      {Matrix4}
         */
        Mult:
        {
            value: function Mult(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
            {
                if (m11 instanceof Matrix4)
                    m11 = m11.Buffer;

                if (m11 instanceof Float32Array || m11 instanceof Array)
                {
                    m44 = m11[15]; m43 = m11[14]; m42 = m11[13]; m41 = m11[12];
                    m34 = m11[11]; m33 = m11[10]; m32 = m11[9];  m31 = m11[8];
                    m24 = m11[7];  m23 = m11[6];  m22 = m11[5];  m21 = m11[4];
                    m14 = m11[3];  m13 = m11[2];  m12 = m11[1];  m11 = m11[0];
                }
                return this.Set
                (
                    this.M11 * m11 + this.M12 * m21 + this.M13 * m31 + this.M14 * m41,
                    this.M11 * m12 + this.M12 * m22 + this.M13 * m32 + this.M14 * m42,
                    this.M11 * m13 + this.M12 * m23 + this.M13 * m33 + this.M14 * m43,
                    this.M11 * m14 + this.M12 * m24 + this.M13 * m34 + this.M14 * m44,
                    
                    this.M21 * m11 + this.M22 * m21 + this.M23 * m31 + this.M24 * m41,
                    this.M21 * m12 + this.M22 * m22 + this.M23 * m32 + this.M24 * m42,
                    this.M21 * m13 + this.M22 * m23 + this.M23 * m33 + this.M24 * m43,
                    this.M21 * m14 + this.M22 * m24 + this.M23 * m34 + this.M24 * m44,
                    
                    this.M31 * m11 + this.M32 * m21 + this.M33 * m31 + this.M34 * m41,
                    this.M31 * m12 + this.M32 * m22 + this.M33 * m32 + this.M34 * m42,
                    this.M31 * m13 + this.M32 * m23 + this.M33 * m33 + this.M34 * m43,
                    this.M31 * m14 + this.M32 * m24 + this.M33 * m34 + this.M34 * m44,
                    
                    this.M41 * m11 + this.M42 * m21 + this.M43 * m31 + this.M44 * m41,
                    this.M41 * m12 + this.M42 * m22 + this.M43 * m32 + this.M44 * m42,
                    this.M41 * m13 + this.M42 * m23 + this.M43 * m33 + this.M44 * m43,
                    this.M41 * m14 + this.M42 * m24 + this.M43 * m34 + this.M44 * m44
                ); 
            }
        },

        Scale:
        {
            value: function Scale(scaler)
            {
                return this.Mult
                (
                    scaler, scaler, scaler, scaler,
                    scaler, scaler, scaler, scaler,
                    scaler, scaler, scaler, scaler,
                    scaler, scaler, scaler, scaler
                );
            }
        }
    });
    Object.seal(Matrix4.prototype);

    return Matrix4;
})();
Object.seal(Matrix4);
