/**
 * @name        Matrix4
 * @description This library contains the methods for 2x2 matrix operations.
 *              4x4 matrices are represented as a Float32Array of length 16.
 * @module      FWGE.Game.Maths 
 */
export class Matrix4
{
    public readonly Buffer: Float32Array;
    public get M11():   number  { return this.Buffer[0];  }
    public set M11(m11: number) { this.Buffer[0] = m11;   }
    public get M12():   number  { return this.Buffer[1];  }
    public set M12(m12: number) { this.Buffer[1] = m12;   }
    public get M13():   number  { return this.Buffer[2];  }
    public set M13(m13: number) { this.Buffer[2] = m13;   }
    public get M14():   number  { return this.Buffer[3];  }
    public set M14(m14: number) { this.Buffer[3] = m14;   }
    public get M21():   number  { return this.Buffer[4];  }
    public set M21(m21: number) { this.Buffer[4] = m21;   }
    public get M22():   number  { return this.Buffer[5];  }
    public set M22(m22: number) { this.Buffer[5] = m22;   }
    public get M23():   number  { return this.Buffer[6];  }
    public set M23(m23: number) { this.Buffer[6] = m23;   }
    public get M24():   number  { return this.Buffer[7];  }
    public set M24(m24: number) { this.Buffer[7] = m24;   }
    public get M31():   number  { return this.Buffer[8];  }
    public set M31(m31: number) { this.Buffer[8] = m31;   }
    public get M32():   number  { return this.Buffer[9];  }
    public set M32(m32: number) { this.Buffer[9] = m32;   }
    public get M33():   number  { return this.Buffer[10]; }
    public set M33(m33: number) { this.Buffer[10] = m33;  }
    public get M34():   number  { return this.Buffer[11]; }
    public set M34(m34: number) { this.Buffer[11] = m34;  }
    public get M41():   number  { return this.Buffer[12]; }
    public set M41(m41: number) { this.Buffer[12] = m41;  }
    public get M42():   number  { return this.Buffer[13]; }
    public set M42(m42: number) { this.Buffer[13] = m42;  }
    public get M43():   number  { return this.Buffer[14]; }
    public set M43(m43: number) { this.Buffer[14] = m43;  }
    public get M44():   number  { return this.Buffer[15]; }
    public set M44(m44: number) { this.Buffer[15] = m44;  }

    public static get Identity(): Matrix4 { return (new Matrix4()).Identity(); }

    private static GetArgs(args: any): number[]
    {
        if (!args)
            return [0, 0, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 0, 0];

        if (args instanceof Matrix4)
            return [args.M11, args.M12, args.M13, args.M14,
                    args.M21, args.M22, args.M23, args.M24,
                    args.M31, args.M32, args.M33, args.M34,
                    args.M41, args.M42, args.M43, args.M44];

        else if ((args instanceof Float32Array && args.length >= 16) || 
                (typeof args[0]  === "number" && typeof args[1]  === "number" && typeof args[2]  === "number" && typeof args[3]  === "number" &&
                 typeof args[4]  === "number" && typeof args[5]  === "number" && typeof args[6]  === "number" && typeof args[7]  === "number" &&
                 typeof args[8]  === "number" && typeof args[9]  === "number" && typeof args[10] === "number" && typeof args[11] === "number" &&
                 typeof args[12] === "number" && typeof args[13] === "number" && typeof args[14] === "number" && typeof args[15] === "number"))
            return args;

        return Matrix4.GetArgs(args[0]);

    }

    /**
     * @function    Create: {Float32Array}
     * @param       array:  {Float32Array}  [null, override: 1]
     * @param       m11:    {Number}        [null, override: 2]
     * @param       m12:    {Number}        [null, override: 2]
     * @param       m13:    {Number}        [null, override: 2]
     * @param       m14:    {Number}        [null, override: 2]
     * @param       m21:    {Number}        [null, override: 2]
     * @param       m22:    {Number}        [null, override: 2]
     * @param       m23:    {Number}        [null, override: 2]
     * @param       m24:    {Number}        [null, override: 2]
     * @param       m31:    {Number}        [null, override: 2]
     * @param       m32:    {Number}        [null, override: 2]
     * @param       m33:    {Number}        [null, override: 2]
     * @param       m34:    {Number}        [null, override: 2]
     * @param       m41:    {Number}        [null, override: 2]
     * @param       m42:    {Number}        [null, override: 2]
     * @param       m43:    {Number}        [null, override: 2]
     * @param       m44:    {Number}        [null, override: 2]
     * @description Creates an new Float32Array with the Type set to "MATRIX4".
     *              It also has the appropriate value indexers:
     *              M11, M12,
     *              M21, M22
     */
    constructor()
    {
        this.Buffer = new Float32Array(16);
    }
    
    /**
     * @function    Set:    {Float32Array}
     * @param       array1: {Float32Array}  [override: 1]
     * @param       array2: {Float32Array}  [override: 1]
     * @param       array:  {Float32Array}  [override: 2]
     * @param       m11:    {Number}        [override: 2]
     * @param       m12:    {Number}        [override: 2]
     * @param       m13:    {Number}        [override: 2]
     * @param       m14:    {Number}        [override: 2]
     * @param       m21:    {Number}        [override: 2]
     * @param       m22:    {Number}        [override: 2]
     * @param       m23:    {Number}        [override: 2]
     * @param       m24:    {Number}        [override: 2]
     * @param       m31:    {Number}        [override: 2]
     * @param       m32:    {Number}        [override: 2]
     * @param       m33:    {Number}        [override: 2]
     * @param       m34:    {Number}        [override: 2]
     * @param       m41:    {Number}        [override: 2]
     * @param       m42:    {Number}        [override: 2]
     * @param       m43:    {Number}        [override: 2]
     * @param       m44:    {Number}        [override: 2]
     * @description Assigns new to the a given Float32Array.
     */

    public Set(matrix: Matrix4): Matrix4;
    public Set(array: Float32Array): Matrix4;
    public Set(array: number[]): Matrix4;
    public Set(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4;
    public Set(...args: any[])
    {
        let [m11, m12, m13, m14,
             m21, m22, m23, m24,
             m31, m32, m33, m34,
             m41, m42, m43, m44] = Matrix4.GetArgs(args);

        this.M11 = m11; this.M12 = m12; this.M13 = m13; this.M14 = m14;
        this.M21 = m21; this.M22 = m22; this.M23 = m23; this.M24 = m24;
        this.M31 = m31; this.M32 = m32; this.M33 = m33; this.M34 = m34;
        this.M41 = m41; this.M42 = m42; this.M43 = m43; this.M44 = m44;

        return this;
    }
    
    /**
     * @function    Transpose:  {Float32Array}
     * @param       array:      {Float32Array}
     * @description Transposes a matrix.
     */
    public Transpose(): Matrix4
    {
        return this.Set(this.M11, this.M21, this.M31, this.M41,
                        this.M12, this.M22, this.M32, this.M42,
                        this.M13, this.M23, this.M33, this.M43,
                        this.M14, this.M24, this.M34, this.M44);
    }
    
    /**
     * @function    Identity:   {Float32Array}
     * @param       array:      {Float32Array}
     * @description If given a Float32Array, it resets it to an identity matrix.
     *              If not, it simply returns a new identity matrix.
     */
    public Identity(): Matrix4
    {
        return this.Set(1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1);
    }
    
    /**
     * @function    Determinant:    {Number}
     * @param       array:          {Float32Array}
     * @description Calculates the determinant of a given Float32Array.
     */
    public get Determinant(): number
    {
        return  this.M11 * this.M22 * this.M33 * this.M44 +
                this.M11 * this.M23 * this.M34 * this.M42 +
                this.M11 * this.M24 * this.M32 * this.M43 +
                this.M12 * this.M21 * this.M34 * this.M43 +
                this.M12 * this.M23 * this.M31 * this.M44 +
                this.M12 * this.M24 * this.M33 * this.M41 +
                this.M13 * this.M21 * this.M32 * this.M44 +
                this.M13 * this.M22 * this.M34 * this.M41 +
                this.M13 * this.M24 * this.M31 * this.M42 +
                this.M14 * this.M21 * this.M33 * this.M42 +
                this.M14 * this.M22 * this.M31 * this.M43 +
                this.M14 * this.M23 * this.M32 * this.M41 -
                this.M11 * this.M22 * this.M34 * this.M43 -
                this.M11 * this.M23 * this.M32 * this.M44 -
                this.M11 * this.M24 * this.M33 * this.M42 -
                this.M12 * this.M21 * this.M33 * this.M44 -
                this.M12 * this.M23 * this.M34 * this.M41 -
                this.M12 * this.M24 * this.M31 * this.M43 -
                this.M13 * this.M21 * this.M34 * this.M42 -
                this.M13 * this.M22 * this.M31 * this.M44 -
                this.M13 * this.M24 * this.M32 * this.M41 -
                this.M14 * this.M21 * this.M32 * this.M43 -
                this.M14 * this.M22 * this.M33 * this.M41 -
                this.M14 * this.M23 * this.M31 * this.M42;
    }
    
    /**
     * @function    Inverse:    {Float32Array}
     * @param       array:      {Float32Array}
     * @description Inverts a given Float32Array when possible i.e. the determinant
     *              is not 0.
     */
    public Inverse(): Matrix4
    {
        var det = this.Determinant;

        if (det !== 0)
            return this.Set((this.M22 * this.M33 * this.M44 +
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
                            (this.M11 * this.M24 *  this.M32 +
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
                            (this.M11 *  this.M32 * this.M43 +
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
        
        return this;
    }

    /**
     * @function    Sum:        {Float32Array}
     * @param       array1:     {Float32Array}
     * @param       array2:     {Float32Array}
     * @description Adds two Float32Array component-wise.
     */
    public Sum(matrix: Matrix4): Matrix4;
    public Sum(array: Float32Array): Matrix4;
    public Sum(array: number[]): Matrix4;
    public Sum(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4;
    public Sum(...args: any[]): Matrix4
    {
        let [m11, m12, m13, m14,
             m21, m22, m23, m24,
             m31, m32, m33, m34,
             m41, m42, m43, m44] = Matrix4.GetArgs(args);

        return this.Set(this.M11 + m11, this.M12 + m12, this.M13 + m13, this.M14 + m14,
                        this.M21 + m21, this.M22 + m22, this.M23 + m23, this.M24 + m24,
                        this.M31 + m31, this.M32 + m32, this.M33 + m33, this.M34 + m34,
                        this.M41 + m41, this.M42 + m42, this.M43 + m43, this.M44 + m44);
    }
    
    /**
     * @function    Mult:       {Float32Array}
     * @param       array1:     {Float32Array}  [override 1]
     * @param       array2:     {Float32Array}  [override 1]
     * @param       array:      {Float32Array}  [override 2]
     * @param       constant:   {Number}        [override 2]
     * @description Performs a matrix multiplication on two Float32Array or
     *              multiply a Float32Array with a scalar value.
     */
    public Mult(matrix: Matrix4): Matrix4;
    public Mult(array: Float32Array): Matrix4;
    public Mult(array: number[]): Matrix4;
    public Mult(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4;
    public Mult(...args: any[]): Matrix4
    {
        let [m11, m12, m13, m14,
             m21, m22, m23, m24,
             m31, m32, m33, m34,
             m41, m42, m43, m44] = Matrix4.GetArgs(args);

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

    public Scale(scaler: number): Matrix4
    {
        return this.Set(this.M11 * scaler, this.M12 * scaler, this.M13 * scaler, this.M14 * scaler,
                        this.M21 * scaler, this.M22 * scaler, this.M23 * scaler, this.M24 * scaler,
                        this.M31 * scaler, this.M32 * scaler, this.M33 * scaler, this.M34 * scaler,
                        this.M41 * scaler, this.M42 * scaler, this.M43 * scaler, this.M44 * scaler);
    }
}
