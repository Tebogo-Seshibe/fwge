import { BufferedArray } from "../../Interfaces/BufferedArray";

export class Vector3 extends BufferedArray<number>
{
    // ---------- STATIC PROPERTIES ----------
    [index: number]: number;
    public readonly Buffer: Array<number>;

    public get X(): number  { return this.Buffer[0]; }
    public set X(x: number) { this.Buffer[0] = x;    }
    public get Y(): number  { return this.Buffer[1]; }
    public set Y(y: number) { this.Buffer[1] = y;    }
    public get Z(): number  { return this.Buffer[2]; }
    public set Z(z: number) { this.Buffer[2] = z;    }  
    
    public get Length(): number { return Vector3.Length(this); }
    // ---------- STATIC PROPERTIES ----------

    public constructor()
    public constructor(vector: Vector3 | Float32Array | number[])
    public constructor(x: number, y: number, z: number)
    public constructor(...args: any[])
    {
        super(3);
        this.Set(args);
    }
    
    // ---------- PUBLIC METHODS ----------
    public Set(vector: Vector3 | Float32Array | number[]): Vector3;
    public Set(x: number, y: number, z: number): Vector3;
    public Set(args: any): Vector3
    {
        return Vector3.Set(this, args);
    }
    
    public Sum(vector: Vector3 | Float32Array | number[]): Vector3;
    public Sum(x: number, y: number, z: number): Vector3;
    public Sum(args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return this.Set(this.X + x, this.Y + y, this.Z + z);
    }
    
    public Diff(vector: Vector3 | Float32Array | number[]): Vector3;
    public Diff(x: number, y: number, z: number): Vector3;
    public Diff(args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return this.Set(x - this.X, y - this.Y, z - this.Z);
    }
    
    public Mult(vector: Vector3 | Float32Array | number[]): Vector3;
    public Mult(x: number, y: number, z: number): Vector3;
    public Mult(args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);
        
        return this.Set(this.X * x, this.Y * y, this.Z * z);
    }
    
    public Dot(vector: Vector3 | Float32Array | number[]): number;
    public Dot(x: number, y: number, z: number): number;
    public Dot(args: any): number
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return this.X * x + this.Y * y + this.Z * z;
    }

    public Cross(vector: Vector3 | Float32Array | number[]): Vector3;
    public Cross(x: number, y: number, z: number): Vector3;
    public Cross(args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return this.Set(this.Y * z + this.Z * y, this.Z * x - this.X * z, this.X * y + this.Y * x);
    }

    public Scale(scaler: number): Vector3
    {
        return this.Mult(scaler, scaler, scaler);
    }
    
    public Unit(): Vector3
    {
        var length = this.Length;

        if (length !== 0)
            this.Scale(1 / length);

        return this;
    }
    // ---------- PUBLIC METHODS ----------

    
    // ---------- STATIC PROPERTIES ----------
    public static get Zero():   Vector3 { return new Vector3(0, 0, 0); }
    public static get One():    Vector3 { return new Vector3(1, 1, 1); }
    // ---------- STATIC PROPERTIES ----------


    // ---------- STATIC METHODS ----------
    private static GetArgs(args: any = []): number[]
    {
        if (args.length === 1)
            args = args[0];
            
        if (args instanceof Vector3)
            return [args.X, args.Y, args.Z];

        else if (!!args && !!args.length && args.length === 3)
            return args;
        
        return [0, 0, 0];
    }

    public static Set(vector: Vector3, other: Vector3 | Float32Array | number[]): Vector3;
    public static Set(vector: Vector3, x: number, y: number, z: number): Vector3;
    public static Set(vector: Vector3, args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);
    
        vector.X = x;
        vector.Y = y;
        vector.Z = z;

        return vector;
    }  

    public static Length(other: Vector3 | Float32Array | number[]): number;
    public static Length(x: number, y: number, z: number): number;
    public static Length(args: any): number
    {
        let [x, y, z] = Vector3.GetArgs(args);
        
        return Math.sqrt(x * x + y * y + z * z);
    }

    public static Sum(vector: Vector3, other: Vector3 | Float32Array | number[]): Vector3;
    public static Sum(vector: Vector3, x: number, y: number, z: number): Vector3;
    public static Sum(vector: Vector3, args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return new Vector3(vector.X + x, vector.Y + y, vector.Z + z)
    }

    public static Diff(vector: Vector3, other: Vector3 | Float32Array | number[]): Vector3;
    public static Diff(vector: Vector3, x: number, y: number, z: number): Vector3;
    public static Diff(vector: Vector3, args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return new Vector3(x - vector.X, y - vector.Y, z - vector.Z);
    }

    public static Mult(vector: Vector3, other: Vector3 | Float32Array | number[]): Vector3;
    public static Mult(vector: Vector3, x: number, y: number, z: number): Vector3;
    public static Mult(vector: Vector3, args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return new Vector3(vector.X * x, vector.Y * y, vector.Z * z)
    }

    public static Scale(vector: Vector3, scaler: number): Vector3
    {
        return vector.Scale(scaler);
    }
    
    public static Cross(vector: Vector3, other: Vector3 | Float32Array | number[]): Vector3;
    public static Cross(vector: Vector3, x: number, y: number, z: number): Vector3;
    public static Cross(vector: Vector3, args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return new Vector3(vector.Y * z + vector.Z * y, vector.Z * x - vector.X * z, vector.X * y + vector.Y * x);
    }

    public static Unit(vector: Vector3): Vector3
    {
        var length = vector.Length;

        if (length !== 0)
            vector.Scale(1 / length);

        return vector;
    }
    // ---------- STATIC METHODS ----------
}
