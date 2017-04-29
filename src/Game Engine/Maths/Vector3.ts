/**
 * @name        Vector3
 * @description This library contains the methods for 2 component vector operations.
 *              3 component vector are represented as a Float32Array of length 3.
 * @module      FWGE.Game.Maths 
 */
export class Vector3
{
    public readonly Buffer: Float32Array;
    public get X(): number  { return this.Buffer[0]; }
    public set X(x: number) { this.Buffer[0] = x;    }
    public get Y(): number  { return this.Buffer[1]; }
    public set Y(y: number) { this.Buffer[1] = y;    }
    public get Z(): number  { return this.Buffer[2]; }
    public set Z(z: number) { this.Buffer[2] = z;    }

    private static GetArgs(args: any): number[]
    {
        if (!args)
            return [0, 0, 0];

        if (args instanceof Vector3)
            return [args.X, args.Y, args.Z];

        else if ((args instanceof Float32Array && args.length >= 3) || 
                (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number"))
            return args;

        return Vector3.GetArgs(args[0]);
    }

    public static get Zero():   Vector3 { return (new Vector3()).Set(0, 0, 0); }
    public static get One():    Vector3 { return (new Vector3()).Set(1, 1, 1); }
    public static get Unit():   Vector3 { return (new Vector3()).Set(Math.sqrt(1/3), Math.sqrt(1/3), Math.sqrt(1/3)); }

    /**
     * @function    Create: {Float32Array}
     * @param       array:  {Float32Array}  [null, override: 1]
     * @param       x:      {Number}        [null, override: 2]
     * @param       y:      {Number}        [null, override: 2]
     * @param       z:      {Number}        [null, override: 2]
     * @description Creates an new Float32Array with the Type set to "VECTOR3".
     *              It also has the appropriate value indexers:
     *              <X, Y, Z>
     */
    constructor()
    {
        this.Buffer = new Float32Array(3);
    }
        
    /**
     * @function    Set:        {Float32Array}
     * @param       array1:     {Float32Array}  [override: 1]
     * @param       array2:     {Float32Array}  [override: 1]
     * @param       array:      {Float32Array}  [override: 2]
     * @param       x:          {Number}        [override: 2]
     * @param       y:          {Number}        [override: 2]
     * @param       z:          {Number}        [override: 2]
     * @description Assigns new values to the a given Float32Array.
     */
    public Set(vector: Vector3): Vector3;
    public Set(array: Float32Array): Vector3;
    public Set(array: number[]): Vector3;
    public Set(x: number, y: number, z: number): Vector3;
    public Set(...args: any[]): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);
    
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
        return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
    }
    
    /**
     * @function    Sum:    {Float32Array}
     * @param       array1: {Float32Array}
     * @param       array2: {Float32Array}
     * @description Adds two Float32Array component-wise.
     */
    public Sum(vector: Vector3): Vector3;
    public Sum(array: Float32Array): Vector3;
    public Sum(array: number[]): Vector3;
    public Sum(x: number, y: number, z: number): Vector3;
    public Sum(...args: any[]): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return this.Set(this.X + x, this.Y + y, this.Z + z);
    }
    
    /**
     * @function    Diff:   {Float32Array}
     * @param       array1: {Float32Array}
     * @param       array2: {Float32Array}
     * @description Subtracts two Float32Array component-wise.
     */
    public Diff(vector: Vector3): Vector3;
    public Diff(array: Float32Array): Vector3;
    public Diff(array: number[]): Vector3;
    public Diff(x: number, y: number, z: number): Vector3;
    public Diff(...args: any[]): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return this.Set(x - this.X, y - this.Y, z - this.Z);
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
    public Mult(vector: Vector3): Vector3;
    public Mult(array: Float32Array): Vector3;
    public Mult(array: number[]): Vector3;
    public Mult(x: number, y: number, z: number): Vector3;
    public Mult(...args: any[]): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);
        
        return this.Set(this.X * x, this.Y * y, this.Z * z);
    }

    public Scale(scaler: number)
    {
        return this.Set(this.X * scaler, this.Y * scaler, this.Z * scaler);
    }
    
    /**
     * @function    Dot:    {Number}
     * @param       array:  {Float32Array}
     * @description Calculates the dot product of two Float32Array objects.
     */
    public Dot(vector: Vector3): number;
    public Dot(array: Float32Array): number;
    public Dot(array: number[]): number;
    public Dot(x: number, y: number, z: number): number;
    public Dot(...args: any[]): number
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return this.X * x + this.Y * y + this.Z * z;
    }

    /**
     * @function    Unit:   {Float32Array}
     * @param       array:  {Float32Array}
     * @description Scales the given Float32Array down to a unit vector i.e. the length is 1
     */
    public Unit()
    {
        var length = this.Length;

        if (length !== 0)
            this.Scale(1 / length);

        return this;
    }
    
    /**
     * @function    Cross:  {Float32Array}
     * @param       array1: {Float32Array}
     * @param       array2: {Float32Array}
     * @description Performs a cross multiplication on two Float32Array objects
     */
    Cross(vector: Vector3): Vector3;
    Cross(array: Float32Array): Vector3;
    Cross(array: number[]): Vector3;
    Cross(x: number, y: number, z: number): Vector3;
    Cross(...args: any[]): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return this.Set(this.Y * z + this.Z * y, this.Z * x - this.X * z, this.X * y + this.Y * x);
    }
}
