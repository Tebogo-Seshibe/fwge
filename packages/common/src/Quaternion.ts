import { Matrix3, Matrix4 } from "./matrix"
import { FixedLengthArray, NumberArray } from "./types"
import { Scalar, Vector3, Vector4 } from "./vector"

export class Quaternion extends Float32Array
{
    //#region Instance Properties
    set W(w: number)
    {
        this[0] = w
    }

    get X(): number
    {
        return this[1]
    }

    set X(x: number)
    {
        this[1] = x
    }

    get Y(): number
    {
        return this[2]
    }

    set Y(y: number)
    {
        this[2] = y
    }

    get Z(): number
    {
        return this[3]
    }

    set Z(z: number)
    {
        this[3] = z
    }

    get W(): number
    {
        return this[0]
    }

    get Length(): number
    {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3]);
    }

    get LengthSquared(): number
    {
        return this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3];
    }
    //#endregion

    readonly Vector: Vector3;
    readonly Scalar: Scalar;

    get Matrix3(): Matrix3
    {
        return new Matrix3(
            2 * (this[0] * this[0] + this[1] * this[1]) - 1,
            2 * (this[1] * this[2] - this[0] * this[3]),
            2 * (this[1] * this[3] + this[0] * this[2]),
            
            2 * (this[1] * this[2] + this[0] * this[3]),
            2 * (this[0] * this[0] + this[2] * this[2]) - 1,
            2 * (this[2] * this[3] - this[0] * this[1]),
            
            2 * (this[1] * this[3] - this[0] * this[2]),
            2 * (this[2] * this[3] + this[0] * this[1]),
            2 * (this[0] * this[0] + this[3] * this[3]) - 1,
        )
    }

    get Matrix4(): Matrix4
    {
        return new Matrix4(
            2 * (this[0] * this[0] + this[1] * this[1]) - 1,
            2 * (this[1] * this[2] - this[0] * this[3]),
            2 * (this[1] * this[3] + this[0] * this[2]),
            0,

            2 * (this[1] * this[2] + this[0] * this[3]),
            2 * (this[0] * this[0] + this[2] * this[2]) - 1,
            2 * (this[2] * this[3] - this[0] * this[1]),
            0,

            2 * (this[1] * this[3] - this[0] * this[2]),
            2 * (this[2] * this[3] + this[0] * this[1]),
            2 * (this[0] * this[0] + this[3] * this[3]) - 1,
            0,

            0,0,0,1
        )
    }

    constructor();
    constructor(w: number, x: number, y: number, z: number);
    constructor(quaternion: Quaternion);
    constructor(vector: Vector4);
    constructor(w: number, vector: Vector3);
    constructor(array: FixedLengthArray<number, 4>);
    constructor(buffer: ArrayBuffer | SharedArrayBuffer);
    constructor(buffer: ArrayBuffer | SharedArrayBuffer, byteOffset: number);
    constructor(_0?: Quaternion | Vector4 | number | FixedLengthArray<number, 4> | ArrayBuffer | SharedArrayBuffer | number, _1?: Vector3 | number, _2?: number, _3?: number)
    {
        if (_0 instanceof Vector4 || _0 instanceof Quaternion || _0 instanceof Array)
        {
            super(_0);
        }
        else if (typeof _0 === 'number')
        {
            if (_1 instanceof Vector3)
            {
                super([_0, _1[0], _1[1], _1[2]]);
            }
            else
            {
                super([_0, _1 as number, _2 as number, _3 as number]);
            }
        }
        else if (_0 !== undefined)
        {
            super(_0, _1 as number ?? 0, Quaternion.SIZE);
        }
        else
        {
            super(Quaternion.SIZE);
        }

        this.Scalar = new Scalar(this.buffer, 0);
        this.Vector = new Vector3(this.buffer, 4);
    }

    //#region Instance Methods
    
    Set(w: number, x: number, y: number, z: number): Quaternion
    Set(w: number, vector: Vector3): Quaternion
    Set(_0: number, _1: Vector3 | number, _2?: number, _3?: number): Quaternion
    {
        if (typeof _1 === 'number')
        {
            this[0] = _0;
            this[1] = _1;
            this[2] = _2 as number;
            this[3] = _3 as number;
        }
        else
        {
            this[0] = _0;
            this[1] = _1[0];
            this[2] = _1[1];
            this[3] = _1[2];
        }
                
        return this;
    }

    Normalize(): Quaternion
    {
        let length = this.LengthSquared;

        if (length !== 0 && length !== 1)
        {
            length = Math.sqrt(length);
            this[0] /= length;
            this[1] /= length;
            this[2] /= length;
            this[3] /= length;
        }

        return this;
    }
    
    Conjugate(): Quaternion
    {
        this[1] = -this[1];
        this[2] = -this[2];
        this[3] = -this[3];

        return this;
    }

    //#endregion

    //#region Static Properties
    static get Zero(): Quaternion
    {
        return new Quaternion(0, 0, 0, 0)
    }

    static get Identity(): Quaternion
    {
        return new Quaternion(1, 0, 0, 0)
    }
    
    public static readonly SIZE: number = 4;
    //#endregion

    //#region Static Methods
    
    static Multiply(quat1: Quaternion, quat2: Quaternion): Quaternion
    static Multiply(quat1: Quaternion, quat2: Quaternion, out: Quaternion): Quaternion
    static Multiply(_0: Quaternion, _1: Quaternion, _2?: Quaternion): Quaternion
    {
        const out = _2 ?? new Quaternion();
        const w1 = _0[0];
        const w2 = _1[0];
        const v1 = new Vector3(_0[1], _0[2], _0[3]);
        const v2 = new Vector3(_1[1], _1[2], _1[3]);

        return out.Set(
            (w1 * w2) - Vector3.Dot(v1, v2),
            Vector3.Add(
                Vector3.Scale(v2, w1),
                Vector3.Scale(v1, w2),
            ).Add(Vector3.Cross(v1, v2))
           
        );
    }
    
    static Conjugate(quaternion: Quaternion): Quaternion
    static Conjugate(quaternion: Quaternion, out: Quaternion): Quaternion
    static Conjugate(_0: Quaternion, _1?: Quaternion): Quaternion
    {
        const out = _1 ?? new Quaternion();
        
        out[0] =  _0[0];
        out[1] = -_0[1];
        out[2] = -_0[2];
        out[3] = -_0[3];

        return out;
    }
    //#endregion
}
