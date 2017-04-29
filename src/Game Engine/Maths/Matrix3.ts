/**
 * @name Matrix3
 * @description This library contains the methods for 3x3 matrix operations.
 *              3x3 matrices are represented as a Float32Array of length 9.
 * @module      FWGE.Game.Maths 
 */
export class Matrix3
{
    public readonly Buffer: Float32Array;
    public get M11():   number  { return this.Buffer[0]; }
    public set M11(m11: number) { this.Buffer[0] = m11;  }
    public get M12():   number  { return this.Buffer[1]; }
    public set M12(m12: number) { this.Buffer[1] = m12;  }
    public get M13():   number  { return this.Buffer[2]; }
    public set M13(m13: number) { this.Buffer[2] = m13;  }
    public get M21():   number  { return this.Buffer[3]; }
    public set M21(m21: number) { this.Buffer[3] = m21;  }
    public get M22():   number  { return this.Buffer[4]; }
    public set M22(m22: number) { this.Buffer[4] = m22;  }
    public get M23():   number  { return this.Buffer[5]; }
    public set M23(m23: number) { this.Buffer[5] = m23;  }
    public get M31():   number  { return this.Buffer[6]; }
    public set M31(m31: number) { this.Buffer[6] = m31;  }
    public get M32():   number  { return this.Buffer[7]; }
    public set M32(m32: number) { this.Buffer[7] = m32;  }
    public get M33():   number  { return this.Buffer[8]; }
    public set M33(m33: number) { this.Buffer[8] = m33;  }

    public static get Identity(): Matrix3 { return new Matrix3().Identity(); }

    private static GetArgs(args: any): number[]
    {
        if (!args)
            return [0, 0, 0,
                    0, 0, 0,
                    0, 0, 0];
        if (args instanceof Matrix3)
            return [args.M11, args.M12, args.M13,
                    args.M21, args.M22, args.M23,
                    args.M31, args.M32, args.M33];

        else if ((args instanceof Float32Array && args.length >= 9) || 
                (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number" && 
                 typeof args[3] === "number" && typeof args[4] === "number" && typeof args[5] === "number" && 
                 typeof args[6] === "number" && typeof args[7] === "number" && typeof args[8] === "number"))
            return args;

        return Matrix3.GetArgs(args[0]);
    }

    /**
     * @function    Create: {Float32Array}
     * @param       array:  {Float32Array}  [null, override: 1]
     * @param       m11:    {Number}        [null, override: 2]
     * @param       m12:    {Number}        [null, override: 2]
     * @param       m13:    {Number}        [null, override: 2]
     * @param       m21:    {Number}        [null, override: 2]
     * @param       m22:    {Number}        [null, override: 2]
     * @param       m23:    {Number}        [null, override: 2]
     * @param       m31:    {Number}        [null, override: 2]
     * @param       m32:    {Number}        [null, override: 2]
     * @param       m33:    {Number}        [null, override: 2]
     * @description Creates an new Float32Array with the Type set to "MATRIX3".
     *              It also has the appropriate value indexers:
     *              M11, M12, M13
     *              M21, M22, M23,
     *              M31, M32, M33
     */
    constructor()
    {
        this.Buffer = new Float32Array(9);
    }
    
        
    /**
     * @function    Set:    {Float32Array}
     * @param       array1: {Float32Array}  [override: 1]
     * @param       array2: {Float32Array}  [override: 1]
     * @param       array:  {Float32Array}  [override: 2]
     * @param       m11:    {Number}        [override: 2]
     * @param       m12:    {Number}        [override: 2]
     * @param       m13:    {Number}        [override: 2]
     * @param       m21:    {Number}        [override: 2]
     * @param       m22:    {Number}        [override: 2]
     * @param       m23:    {Number}        [override: 2]
     * @param       m31:    {Number}        [override: 2]
     * @param       m32:    {Number}        [override: 2]
     * @param       m33:    {Number}        [override: 2]
     * @description Assigns new to the a given Float32Array.
     */
    Set(matrix: Matrix3): Matrix3
    Set(array: Float32Array): Matrix3
    Set(array: number[]): Matrix3
    Set(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3
    Set(...args: any[]): Matrix3
    {         
        let [m11, m12, m13,
             m21, m22, m23,
             m31, m32, m33] = Matrix3.GetArgs(args);

        this.M11 = m11; this.M12 = m12; this.M13 = m13;
        this.M21 = m21; this.M22 = m22; this.M23 = m23;
        this.M31 = m31; this.M32 = m32; this.M33 = m33;

        return this;
    }
    
    /**
     * @function    Transpose:  {Float32Array}
     * @param       array:      {Float32Array}
     * @description Transposes a matrix.
     */
    Transpose(): Matrix3
    {
        return this.Set(this.M11, this.M21, this.M31,
                        this.M12, this.M22, this.M32,
                        this.M13, this.M23, this.M33);
    }
    
    /**
     * @function    Identity:   {Float32Array}
     * @param       array:      {Float32Array}
     * @description If given a Float32Array, it resets it to an identity matrix.
     *              If not, it simply returns a new identity matrix.
     */
    Identity(): Matrix3
    {
        return this.Set(1, 0, 0,
                        0, 1, 0,
                        0, 0, 1);
    }

    /**
     * @function    Determinant:    {Number}
     * @param       array:          {Float32Array}
     * @description Calculates the determinant of a given Float32Array.
     */
    get Determinant(): number
    {
        return  this.M11 * (this.M22 * this.M33 - this.M23 * this.M32) -
                this.M12 * (this.M21 * this.M33 - this.M23 * this.M31) + 
                this.M13 * (this.M21 * this.M32 - this.M22 * this.M31);
    }
    
    /**
     * @function    Inverse:    {Float32Array}
     * @param       array:      {Float32Array}
     * @description Inverts a given Float32Array when possible i.e. the determinant
     *              is not 0.
     */
    Inverse(): Matrix3
    {
        let det = this.Determinant;

        if (det !== 0)
            this.Set((this.M22 * this.M33 - this.M32 * this.M23) / det,
                    -(this.M12 * this.M33 - this.M32 * this.M13) / det,
                     (this.M12 * this.M23 - this.M22 * this.M13) / det,

                    -(this.M21 * this.M33 - this.M31 * this.M23) / det,
                     (this.M11 * this.M33 - this.M31 * this.M13) / det,
                    -(this.M11 * this.M23 - this.M21 * this.M13) / det,

                     (this.M21 * this.M32 - this.M31 * this.M22) / det,
                    -(this.M11 * this.M32 - this.M31 * this.M12) / det,
                     (this.M11 * this.M22 - this.M21 * this.M12) / det);
    
        return this;
    }
    
    /**
     * @function    Sum:        {Float32Array}
     * @param       array1:     {Float32Array}
     * @param       array2:     {Float32Array}
     * @description Adds two Float32Array component-wise.
     */
    Sum(matrix: Matrix3): Matrix3;
    Sum(array: Float32Array): Matrix3;
    Sum(array: number[]): Matrix3;
    Sum(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3;
    Sum(...args: any[]): Matrix3
    {
        let[m11, m12, m13, m21, m22, m23, m31, m32, m33] = Matrix3.GetArgs(args);
    
        return this.Set(this.M11 + m11, this.M12 + m12, this.M13 + m13,
                        this.M21 + m21, this.M22 + m22, this.M23 + m23,
                        this.M31 + m31, this.M32 + m32, this.M33 + m33);
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
    Mult(matrix: Matrix3): Matrix3
    Mult(array: Float32Array): Matrix3
    Mult(array: number[]): Matrix3
    Mult(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3
    Mult(...args: any[])
    {
        let[m11, m12, m13, m21, m22, m23, m31, m32, m33] = Matrix3.GetArgs(args);
    
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

    Scale(scaler: number): Matrix3
    {
        return this.Set(this.M11 * scaler, this.M12 * scaler, this.M13 * scaler,
                        this.M21 * scaler, this.M22 * scaler, this.M23 * scaler,
                        this.M31 * scaler, this.M32 * scaler, this.M33 * scaler);
    }
}
