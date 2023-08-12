import { Matrix3, Matrix4 } from "./matrix"
import { NumberArray } from "./types"
import { Scalar, Vector3, Vector4 } from "./vector"

export class Quaternion extends Float32Array
{
    //#region Instance Properties
    get X(): number
    {
        return this[0]
    }

    set X(x: number)
    {
        this[0] = x
    }

    get Y(): number
    {
        return this[1]
    }

    set Y(y: number)
    {
        this[1] = y
    }

    get Z(): number
    {
        return this[2]
    }

    set Z(z: number)
    {
        this[2] = z
    }

    get W(): number
    {
        return this[3]
    }

    set W(w: number)
    {
        this[3] = w
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
    constructor(x: number, y: number, z: number, w: number);
    constructor(quaternion: Quaternion);
    constructor(vector: Vector4);
    constructor(vector: Vector3, w: number);
    constructor(array: NumberArray);
    constructor(buffer: ArrayBuffer | SharedArrayBuffer);
    constructor(buffer: ArrayBuffer | SharedArrayBuffer, byteOffset: number);
    constructor(_0?: Quaternion | Vector4 | Vector3 | NumberArray | ArrayBuffer | SharedArrayBuffer | number, _1?: number, _2?: number, _3?: number)
    {
        if (_0 instanceof Vector4 || _0 instanceof Quaternion)
        {
            super(_0);
        }
        else if (_0 instanceof Vector3 || _0 instanceof Array)
        {
            super([_0[0], _0[1], _0[2], _0[3] ?? _1 ?? 1]);
        }
        else if (typeof _0 === 'number')
        {
            super([_0 as number, _1 as number, _2 as number, _3 as number]);
        }
        else if (_0 !== undefined)
        {
            super(_0, _1 ?? 0, Quaternion.SIZE);
        }
        else
        {
            super(Quaternion.SIZE);
        }

        this.Vector = new Vector3(this.buffer, 0);
        this.Scalar = new Scalar(this.buffer, 12);
    }

    //#region Instance Methods
    //#endregion

    //#region Static Properties
    static get Zero(): Quaternion
    {
        return new Quaternion(0, 0, 0, 0)
    }

    static get Identity(): Quaternion
    {
        return new Quaternion(0, 0, 0, 1)
    }
    
    public static readonly SIZE: number = 4;
    //#endregion

    //#region Static Methods
    //#endregion
}
