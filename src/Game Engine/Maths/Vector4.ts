/**
 * @name        Vector4
 * @description This library contains the methods for 2 component vector operations.
 *              4 component vector are represented as a Float32Array of length 4.
 * @module      FWGE.Game.Maths 
 */
export class Vector4
{
    public readonly Buffer: Float32Array;
    public get W(): number  { return this.Buffer[0]; }
    public set W(w: number) { this.Buffer[0] = w;    }
    public get X(): number  { return this.Buffer[1]; }
    public set X(x: number) { this.Buffer[1] = x;    }
    public get Y(): number  { return this.Buffer[2]; }
    public set Y(y: number) { this.Buffer[2] = y;    }
    public get Z(): number  { return this.Buffer[3]; }
    public set Z(z: number) { this.Buffer[3] = z;    }

    private static GetArgs(args: any): number[]
    {   
        if (!args)
            return [0, 0, 0, 0];

        if (args instanceof Vector4)
            return [args.W, args.X, args.Y, args.Z];

        else if ((args instanceof Float32Array && args.length >= 4) || 
                (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number" && typeof args[3] === "number"))
            return args;

        return Vector4.GetArgs(args[0]);
    }
    
    public static get Zero(): Vector4   { return (new Vector4).Set(0, 0, 0, 0); }
    public static get One(): Vector4   { return (new Vector4).Set(1, 1, 1, 1); }
    public static get Unit(): Vector4    { return (new Vector4).Set(0.5, 0.5, 0.5, 0.5); }

    constructor()
    {
        this.Buffer = new Float32Array(4);
    }

    /**
     * @function    Set:        {Float32Array}
     * @param       array1:     {Float32Array}  [override: 1]
     * @param       array2:     {Float32Array}  [override: 1]
     * @param       array:      {Float32Array}  [override: 2]
     * @param       w:          {Number}        [override: 2]
     * @param       x:          {Number}        [override: 2]
     * @param       y:          {Number}        [override: 2]
     * @param       z:          {Number}        [override: 2]
     * @description Assigns new values to the a given Float32Array.
     */
    public Set(vector: Vector4): Vector4;
    public Set(array: Float32Array): Vector4;
    public Set(array: number[]): Vector4;
    public Set(w: number, x: number, y: number, z: number): Vector4;
    public Set(...args: any[]): Vector4
    {
        let [w, x, y, z] = Vector4.GetArgs(args);

        this.W = w;
        this.X = x;
        this.Y = y;
        this.Z = z;

        return this;
    }
    
    /**
     * @function    Length: {Number}
     * @param       array:  {Float32Array}
     * @description Calculates the length of a given Float32Array.
     */
    public get Length(): number
    {
        return Math.sqrt(this.W * this.W + this.X * this.X + this.Y * this.Y + this.Z * this.Z);
    }
    
    /**
     * @function    Sum:    {Float32Array}
     * @param       array1: {Float32Array}
     * @param       array2: {Float32Array}
     * @description Adds two Float32Array component-wise.
     */
    public Sum(vector: Vector4): Vector4;
    public Sum(array: Float32Array): Vector4;
    public Sum(array: number[]): Vector4;
    public Sum(w: number, x: number, y: number, z: number): Vector4;
    public Sum(...args: any[]): Vector4
    {
        let [w, x, y, z] = Vector4.GetArgs(args);

        return this.Set(this.W + w, this.X + x, this.Y + y, this.Z + z);
    }
    
    /**
     * @function    Diff:   {Float32Array}
     * @param       array1: {Float32Array}
     * @param       array2: {Float32Array}
     * @description Subtracts two Float32Array component-wise.
     */
    public Diff(vector: Vector4): Vector4;
    public Diff(array: Float32Array): Vector4;
    public Diff(array: number[]): Vector4;
    public Diff(w: number, x: number, y: number, z: number): Vector4;
    public Diff(...args: any[]): Vector4
    {
        let [w, x, y, z] = Vector4.GetArgs(args);

        return this.Set(w - this.W, x - this.X, y - this.Y, z - this.Z);
    }

    /**
     * @function    Mult:       {Float32Array}
     * @param       array1:     {Float32Array}  [override: 1]
     * @param       array2:     {Float32Array}  [override: 1]
     * @param       array:      {Float32Array}  [override: 2]
     * @param       constant:   {Number}        [override: 2]
     * @description Multiplies two Float32Array component-wise. If the second parameter is
     *              a number, the Float32Array is scale by it.
     */
    public Mult(vector: Vector4): Vector4;
    public Mult(array: Float32Array): Vector4;
    public Mult(array: number): Vector4;
    public Mult(w: number, x: number, y: number, z: number): Vector4;
    public Mult(...args: any[]): Vector4
    {
        let [w, x, y, z] = Vector4.GetArgs(args);

        return this.Set(this.W * w, this.X * x, this.Y * y, this.Z * z);
    }

    public Scale(scaler: number): Vector4
    {
        return this.Set(this.W * scaler, this.X * scaler, this.Y * scaler, this.Z * scaler);
    }
    
    /**
     * @function    Dot:    {Number}
     * @param       array:  {Float32Array}
     * @description Calculates the dot product of two Float32Array objects.
     */
    public Dot(vector: Vector4): number;
    public Dot(array: Float32Array): number;
    public Dot(array: number[]): number;
    public Dot(w: number, x: number, y: number, z: number): number;
    public Dot(...args: any[]): number
    {
        let [w, x, y, z] = Vector4.GetArgs(args);

        return this.W * w + this.X * x + this.Y * y + this.Z * z;
    }

    /**
     * @function    Unit:   {Float32Array}
     * @param       array:  {Float32Array}
     * @description Scales the given Float32Array down to a unit vector i.e. the length is 1
     */
    public Unit(): Vector4
    {   
        let length = this.Length;

        if (length !== 0)
            this.Scale(1 / length);
            
        return this;
    }
}
