/**
 * @name        Matrix2
 * @description This library contains the methods for 2x2 matrix operations.
 *              2x2 matrices are represented as a Float32Array of length 4.
 * @module      FWGE.Game.Maths 
 */
export class Matrix2
{
    public Buffer: Float32Array;
    public get M11():   number  { return this.Buffer[0]; }
    public set M11(m11: number) { this.Buffer[0] = m11;  }
    public get M12():   number  { return this.Buffer[1]; }
    public set M12(m12: number) { this.Buffer[1] = m12;  }
    public get M21():   number  { return this.Buffer[2]; }
    public set M21(m21: number) { this.Buffer[2] = m21;  }
    public get M22():   number  { return this.Buffer[3]; }
    public set M22(m22: number) { this.Buffer[3] = m22;  }

    public static get Identity(): Matrix2 { return new Matrix2().Identity(); }

    private static GetArgs(args: any): number[]
    {
        if (!args)
            return [0, 0,
                    0, 0];

        if (args instanceof Matrix2)
            return [args.M11, args.M12,
                    args.M21, args.M22];

        else if ((args instanceof Float32Array && args.length >= 4) || 
                (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number" && typeof args[3] === "number"))
            return args;

        return Matrix2.GetArgs(args[0]);
    }

    /**
     * @function    Create: {Float32Array}
     * @param       array:  {Float32Array}  [null, override: 1]
     * @param       m11:    {Number}        [null, override: 2]
     * @param       m12:    {Number}        [null, override: 2]
     * @param       m21:    {Number}        [null, override: 2]
     * @param       m22:    {Number}        [null, override: 2]
     * @description Creates an new Float32Array with the Type set to "MATRIX2".
     *              It also has the appropriate value indexers:
     *              M11, M12,
     *              M21, M22
     */
    constructor()
    {
        this.Buffer = new Float32Array(4);
    }

    /**
     * @function    Set:    {Float32Array}
     * @param       array1: {Float32Array}  [override: 1]
     * @param       array2: {Float32Array}  [override: 1]
     * @param       array:  {Float32Array}  [override: 2]
     * @param       m11:    {Number}        [override: 2]
     * @param       m12:    {Number}        [override: 2]
     * @param       m21:    {Number}        [override: 2]
     * @param       m22:    {Number}        [override: 2]
     * @description Assigns new to the a given Float32Array.
     */
    public Set(matrix: Matrix2): Matrix2;
    public Set(array: Float32Array): Matrix2;
    public Set(array: number[]): Matrix2;
    public Set(m11: number, m12: number, m21: number, m22: number): Matrix2;
    public Set(...args: any[]): Matrix2
    {
        let [m11, m12,
             m21, m22] = Matrix2.GetArgs(args);

        this.M11 = m11; this.M12 = m12;
        this.M21 = m21; this.M22 = m22;

        return this;
    }
    
    /**
     * @function    Transpose:  {Float32Array}
     * @param       array:      {Float32Array}
     * @description Transposes a matrix.
     */
    public Transpose(): Matrix2
    {
        return this.Set(this.M11, this.M21,
                        this.M12, this.M22);
    }
    
    /**
     * @function    Identity:   {Float32Array}
     * @param       array:      {Float32Array}
     * @description If given a Float32Array, it resets it to an identity matrix.
     *              If not, it simply returns a new identity matrix.
     */
    public Identity(): Matrix2
    {
        return this.Set(1, 0,
                        0, 1);
    }
    
    /**
     * @function    Determinant:    {Number}
     * @param       array:          {Float32Array}
     * @description Calculates the determinant of a given Float32Array.
     */
    public get Determinant(): number
    {
        return this.M11 * this.M22 - this.M21 * this.M12;
    }
    
    /**
     * @function    Inverse:    {Float32Array}
     * @param       array:      {Float32Array}
     * @description Inverts a given Float32Array when possible i.e. the determinant
     *              is not 0.
     */
    public Inverse(): Matrix2
    {
        let det = this.Determinant;

        if (det !== 0)
            this.Set(this.M22 / det, -this.M12 / det,
                    -this.M21 / det,  this.M11 / det);

        return this;
    }
    
    /**
     * @function    Sum:        {Float32Array}
     * @param       array1:     {Float32Array}
     * @param       array2:     {Float32Array}
     * @description Adds two Float32Array component-wise.
     */
    public Sum(matrix: Matrix2): Matrix2;
    public Sum(array: Float32Array): Matrix2;
    public Sum(array: number[]): Matrix2;
    public Sum(m11: number, m12: number, m21: number, m22: number): Matrix2;
    public Sum(...args: any[]): Matrix2
    {
        let [m11, m12, m21, m22] = Matrix2.GetArgs(args);

        return this.Set(this.M11 + m11, this.M12 + m12,
                        this.M21 + m21, this.M22 + m22);
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
    public Mult(matrix: Matrix2): Matrix2;
    public Mult(array: Float32Array): Matrix2;
    public Mult(array: number[]): Matrix2;
    public Mult(m11: number, m12: number, m21: number, m22: number): Matrix2;
    public Mult(...args: any[]): Matrix2
    {
        let [m11, m12, m21, m22] = Matrix2.GetArgs(args);

        return this.Set
        (
            this.M11 * m11 + this.M12 * m21,
            this.M11 * m12 + this.M12 * m22,
            
            this.M21 * m11 + this.M22 * m21,
            this.M21 * m12 + this.M22 * m22
        );
    }
    
    public Scale(scaler: number): Matrix2
    {
        return this.Set(this.M11 * scaler, this.M12 * scaler,
                        this.M21 * scaler, this.M22 * scaler);
    }
}
