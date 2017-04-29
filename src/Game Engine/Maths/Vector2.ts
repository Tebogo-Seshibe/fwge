/**
 * @name        Vector2
 * @description This library contains the methods for 2 component vector operations.
 *              2 component vector are represented as a Float32Array of length 2.
 * @module      FWGE.Game.Maths 
 */
export class Vector2
{
    public readonly Buffer: Float32Array;
    public get X(): number  { return this.Buffer[0]; }
    public set X(x: number) { this.Buffer[0] = x;    }
    public get Y(): number  { return this.Buffer[1]; }
    public set Y(y: number) { this.Buffer[1] = y;    }
 
    private static GetArgs(args: any): number[]
    {   
        if (!args)
            return [0, 0];

        if (args instanceof Vector2)
            return [args.X, args.Y];

        else if ((args instanceof Float32Array && args.length >= 2) || 
                (typeof args[0] === "number" && typeof args[1] === "number"))
            return args;
        
        return Vector2.GetArgs(args[0]);
    }

    public static get Zero(): Vector2   { return (new Vector2).Set(0, 0); }
    public static get One(): Vector2    { return (new Vector2).Set(1, 1); }
    public static get Unit(): Vector2   { return (new Vector2).Set(Math.sqrt(1/2), Math.sqrt(1/2)); }

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
     * @description Assigns new values to the a given Float32Array.
     */
    public Set(vector: Vector2): Vector2;
    public Set(array: Float32Array): Vector2;
    public Set(array: number[]): Vector2;
    public Set(x: number, y: number): Vector2;
    public Set(...args: any[]): Vector2
    {
        let [x, y] = Vector2.GetArgs(args);

        this.X = x;
        this.Y = y;

        return this;
    }
    
    /**
     * @function    Length: {Number}
     * @param       array:  {Float32Array}
     * @description Calculates the length of a given Float32Array.
     */
    public get Length(): number
    {
        return Math.sqrt(this.X * this.X + this.Y * this.Y);
    }
    
    /**
     * @function    Sum:    {Float32Array}
     * @param       array1: {Float32Array}
     * @param       array2: {Float32Array}
     * @description Adds two Float32Array component-wise.
     */
    public Sum(vector: Vector2): Vector2;
    public Sum(array: Float32Array): Vector2;
    public Sum(array: number[]): Vector2;
    public Sum(x: number, y: number): Vector2;
    public Sum(...args: any[]): Vector2
    {
        let [x, y] = Vector2.GetArgs(args);
        
        return this.Set(this.X + x, this.Y + y);
    }
    
    /**
     * @function    Diff:   {Float32Array}
     * @param       array1: {Float32Array}
     * @param       array2: {Float32Array}
     * @description Subtracts two Float32Array component-wise.
     */
    public Diff(vector: Vector2): Vector2;
    public Diff(array: Float32Array): Vector2;
    public Diff(array: number[]): Vector2;
    public Diff(x: number, y: number): Vector2;
    public Diff(...args: any[]): Vector2
    {
        let [x, y] = Vector2.GetArgs(args);
        
        return this.Set(x - this.X, y - this.Y);
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
    public Mult(vector: Vector2): Vector2;
    public Mult(array: Float32Array): Vector2;
    public Mult(array: number[]): Vector2;
    public Mult(x: number, y: number): Vector2;
    public Mult(...args: any[]): Vector2
    {
        let [x, y] = Vector2.GetArgs(args);
        
        return this.Set(this.X * x, this.Y * y);
    }

    public Scale(scaler: number): Vector2
    {
        return this.Set(this.X * scaler, this.Y * scaler);
    }
    
    /**
     * @function    Dot:    {Number}
     * @param       array:  {Float32Array}
     * @description Calculates the dot product of two Float32Array objects.
     */
    public Dot(vector: Vector2): number;
    public Dot(array: Float32Array): number;
    public Dot(array: number[]): number;
    public Dot(x: number, y: number): number;
    public Dot(...args: any[]): number
    {
        let [x, y] = Vector2.GetArgs(args);
        
        return this.X * x + this.Y * y;
    }
    
    /**
     * @function    Unit:   {Float32Array}
     * @param       array:  {Float32Array}
     * @description Scales the given Float32Array down to a unit vector i.e. the length is 1
     */
    public Unit(): Vector2
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
    public Cross(vector: Vector2): Vector2;
    public Cross(array: Float32Array): Vector2;
    public Cross(x: number, y: number): Vector2;
    public Cross(...args: any[]): Vector2
    {
        let [x, y] = Vector2.GetArgs(args);

        return this.Set(x, y);
    }
}
