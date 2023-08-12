import { FixedLengthArray, NumberArray } from "../types";
import { radian } from "../utils";
import { IsEquatable } from "../utils/interfaces/IsEquatable";
import { Vector3, Vector3Array } from "../vector";
import { Matrix2 } from "./Matrix2";
import { Matrix4 } from "./Matrix4";

export type Matrix3Array = FixedLengthArray<number, 9>;

export class Matrix3 extends Float32Array implements IsEquatable<Matrix3>
{
    //#region Local Properties
    get M11(): number
    {
        return this[0];
    }

    set M11(m11: number)
    {
        this[0] = m11;
    }

    get M12(): number
    {
        return this[1];
    }

    set M12(m12: number)
    {
        this[1] = m12;
    }

    get M13(): number
    {
        return this[2];
    }

    set M13(m13: number)
    {
        this[2] = m13;
    }

    get M21(): number
    {
        return this[3];
    }

    set M21(m21: number)
    {
        this[3] = m21;
    }

    get M22(): number
    {
        return this[4];
    }

    set M22(m22: number)
    {
        this[4] = m22;
    }

    get M23(): number
    {
        return this[5];
    }

    set M23(m23: number)
    {
        this[5] = m23;
    }

    get M31(): number
    {
        return this[6];
    }

    set M31(m31: number)
    {
        this[6] = m31;
    }

    get M32(): number
    {
        return this[7];
    }

    set M32(m32: number)
    {
        this[7] = m32;
    }

    get M33(): number
    {
        return this[8];
    }

    set M33(m33: number)
    {
        this[8] = m33;
    }

    get Determinant(): number
    {
        return (
            this[0] * (this[4] * this[8] - this[5] * this[7]) -
            this[1] * (this[3] * this[8] - this[5] * this[6]) +
            this[2] * (this[3] * this[7] - this[4] * this[6])
        );
    }

    get Column1(): Vector3
    {
        return new Vector3(this[0], this[3], this[6]);
    }

    get Column2(): Vector3
    {
        return new Vector3(this[1], this[4], this[7]);
    }

    get Column3(): Vector3
    {
        return new Vector3(this[2], this[5], this[8]);
    }

    get Row1(): Vector3
    {
        return new Vector3(this[0], this[1], this[2]);
    }

    get Row2(): Vector3
    {
        return new Vector3(this[3], this[4], this[5]);
    }

    get Row3(): Vector3
    {
        return new Vector3(this[6], this[7], this[8]);
    }

    get Diagonal(): Vector3
    {
        return new Vector3(this[0], this[4], this[8]);
    }

    get Trace(): number
    {
        return this[0] + this[4] + this[8];
    }
    //#endregion

    constructor();
    constructor(diag: number);
    constructor(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number);
    constructor(matrix: Matrix2);
    constructor(matrix: Matrix3);
    constructor(matrix: Matrix4);
    constructor(array: Matrix3Array);
    constructor(buffer: ArrayBuffer | SharedArrayBuffer);
    constructor(buffer: ArrayBuffer | SharedArrayBuffer, byteOffset: number);
    constructor(_0: ArrayBuffer | SharedArrayBuffer | Matrix4 | Matrix3 | Matrix2 | number[] | number = 0, _1: number = 0, _2?: number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number)
    {
        if (typeof _2 === 'number')
        {
            super(
            [
                _0 as number, _1 as number, _2 as number,
                _3 as number, _4 as number, _5 as number,
                _6 as number, _7 as number, _8 as number,
            ]);
        }
        else if (typeof _0 === 'number')
        {
            super(
            [
                _0,  0,  0,
                 0, _0,  0,
                 0,  0, _0,
            ]);
        }
        else if (_0 instanceof Matrix2)
        {
            super(
            [
                _0.M11, _0.M12, 0,
                _0.M21, _0.M22, 0,
                0, 0, 0,
            ]);
        }
        else if (_0 instanceof Matrix4 || _0 instanceof Matrix3)
        {
            super(
            [
                _0.M11, _0.M12, _0.M13,
                _0.M21, _0.M22, _0.M23,
                _0.M31, _0.M32, _0.M33,
            ]);
        }
        else if (_0 instanceof Array)
        {
            super(
            [
                _0[0], _0[1], _0[2],
                _0[3], _0[4], _0[5],
                _0[6], _0[7], _0[8],
            ]);
        }
        else
        {
            super(_0, _1, Matrix3.SIZE);
        }
    }

    //#region Local Methods
    Set(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3;
    Set(matrix: Matrix3): Matrix3;
    Set(array: NumberArray): Matrix3;
    Set(_0: Matrix4 | Matrix3 | Matrix3 | NumberArray | number, _1?: number, _2?: number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number): Matrix3
    {
        if (typeof _0 === 'number')
        {
            this[0] = _0 as number;
            this[1] = _1 as number;
            this[2] = _2 as number;
            this[3] = _3 as number;
            this[4] = _4 as number;
            this[5] = _5 as number;
            this[6] = _6 as number;
            this[7] = _7 as number;
            this[8] = _8 as number;
        }
        else
        {
            this[0] = _0[0];
            this[1] = _0[1];
            this[2] = _0[2];
            this[3] = _0[3];
            this[4] = _0[4];
            this[5] = _0[5];
            this[6] = _0[6];
            this[7] = _0[7];
            this[8] = _0[8];
        }

        return this;
    }

    Add(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3;
    Add(matrix: Matrix3): Matrix3;
    Add(array: NumberArray): Matrix3;
    Add(_0: Matrix4 | Matrix3 | Matrix3 | NumberArray | number, _1?: number, _2?: number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number): Matrix3
    {
        if (typeof _0 === 'number')
        {
            this[0] += _0 as number;
            this[1] += _1 as number;
            this[2] += _2 as number;
            this[3] += _3 as number;
            this[4] += _4 as number;
            this[5] += _5 as number;
            this[6] += _6 as number;
            this[7] += _7 as number;
            this[8] += _8 as number;
        }
        else
        {
            this[0] += _0[0];
            this[1] += _0[1];
            this[2] += _0[2];
            this[3] += _0[3];
            this[4] += _0[4];
            this[5] += _0[5];
            this[6] += _0[6];
            this[7] += _0[7];
            this[8] += _0[8];
        }

        return this;
    }

    Subtract(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3;
    Subtract(matrix: Matrix3): Matrix3;
    Subtract(array: NumberArray): Matrix3;
    Subtract(_0: Matrix4 | Matrix3 | Matrix3 | NumberArray | number, _1?: number, _2?: number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number): Matrix3
    {
        if (typeof _0 === 'number')
        {
            this[0] -= _0 as number;
            this[1] -= _1 as number;
            this[2] -= _2 as number;
            this[3] -= _3 as number;
            this[4] -= _4 as number;
            this[5] -= _5 as number;
            this[6] -= _6 as number;
            this[7] -= _7 as number;
            this[8] -= _8 as number;
        }
        else
        {
            this[0] -= _0[0];
            this[1] -= _0[1];
            this[2] -= _0[2];
            this[3] -= _0[3];
            this[4] -= _0[4];
            this[5] -= _0[5];
            this[6] -= _0[6];
            this[7] -= _0[7];
            this[8] -= _0[8];
        }

        return this;
    }

    Multiply(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3;
    Multiply(matrix: Matrix3): Matrix3;
    Multiply(array: NumberArray): Matrix3;
    Multiply(_0: Matrix4 | Matrix3 | Matrix3 | NumberArray | number, _1?: number, _2?: number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number): Matrix3
    {
        if (typeof _0 === 'number')
        {
            return this.Set(
                this[0] * (_0 as number) + this[1] * (_3 as number) + this[2] * (_6 as number),
                this[0] * (_1 as number) + this[1] * (_4 as number) + this[2] * (_7 as number),
                this[0] * (_2 as number) + this[1] * (_5 as number) + this[2] * (_8 as number),

                this[3] * (_0 as number) + this[4] * (_3 as number) + this[5] * (_6 as number),
                this[3] * (_1 as number) + this[4] * (_4 as number) + this[5] * (_7 as number),
                this[3] * (_2 as number) + this[4] * (_5 as number) + this[5] * (_8 as number),

                this[6] * (_0 as number) + this[7] * (_3 as number) + this[8] * (_6 as number),
                this[6] * (_1 as number) + this[7] * (_4 as number) + this[8] * (_7 as number),
                this[6] * (_2 as number) + this[7] * (_5 as number) + this[8] * (_8 as number)
            );
        }
        else
        {
            return this.Set(
                this[0] * _0[0] + this[1] * _0[3] + this[2] * _0[6],
                this[0] * _0[1] + this[1] * _0[4] + this[2] * _0[7],
                this[0] * _0[2] + this[1] * _0[5] + this[2] * _0[8],

                this[3] * _0[0] + this[4] * _0[3] + this[5] * _0[6],
                this[3] * _0[1] + this[4] * _0[4] + this[5] * _0[7],
                this[3] * _0[2] + this[4] * _0[5] + this[5] * _0[8],

                this[6] * _0[0] + this[7] * _0[3] + this[8] * _0[6],
                this[6] * _0[1] + this[7] * _0[4] + this[8] * _0[7],
                this[6] * _0[2] + this[7] * _0[5] + this[8] * _0[8]
            );
        }
    }

    Scale(scaler: number): Matrix3
    {
        this[0] *= scaler;
        this[1] *= scaler;
        this[2] *= scaler;
        this[3] *= scaler;
        this[4] *= scaler;
        this[5] *= scaler;
        this[6] *= scaler;
        this[7] *= scaler;
        this[8] *= scaler;

        return this;
    }

    Transpose(): Matrix3
    {
        return this.Set(
            this[0], this[3], this[6],
            this[1], this[4], this[7],
            this[2], this[5], this[8]
        );
    }

    Inverse(): Matrix3
    {
        const det = this.Determinant;

        if (det !== 0)
        {
            this.Set(
                (this[4] * this[8] - this[7] * this[5]) / det,
                (this[7] * this[2] - this[1] * this[8]) / det,
                (this[1] * this[5] - this[4] * this[2]) / det,

                (this[6] * this[5] - this[3] * this[8]) / det,
                (this[0] * this[8] - this[6] * this[2]) / det,
                (this[3] * this[2] - this[0] * this[5]) / det,

                (this[3] * this[7] - this[6] * this[4]) / det,
                (this[6] * this[1] - this[0] * this[7]) / det,
                (this[0] * this[4] - this[3] * this[1]) / det
            );
        }

        return this;
    }

    Zero(): Matrix3
    {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = 0;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;

        return this;
    }

    Identity(): Matrix3
    {
        this[0] = 1;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 1;
        this[5] = 0;
        this[6] = 0;
        this[7] = 0;
        this[8] = 1;

        return this;
    }

    Clone(): Matrix3
    {
        return new Matrix3(this);
    }

    Equals(other: Matrix3): boolean
    {
        return this[0] === other[0] &&
            this[1] === other[1] &&
            this[2] === other[2] &&
            this[3] === other[3] &&
            this[4] === other[4] &&
            this[5] === other[5] &&
            this[6] === other[6] &&
            this[7] === other[7] &&
            this[8] === other[8];
    }
    //#endregion

    //#region Static Properties
    static get Zero(): Matrix3
    {
        return new Matrix3(0);
    }

    static get Identity(): Matrix3
    {
        return new Matrix3(1);
    }

    public static readonly SIZE: number = 9;
    //#endregion

    //#region Static Methods
    static Add(
        m1_11: number, m1_12: number, m1_13: number,
        m1_21: number, m1_22: number, m1_23: number,
        m1_31: number, m1_32: number, m1_33: number,

        m2_11: number, m2_12: number, m2_13: number,
        m2_21: number, m2_22: number, m2_23: number,
        m2_31: number, m2_32: number, m2_33: number
    ): Matrix3;
    static Add(
        m1_11: number, m1_12: number, m1_13: number,
        m1_21: number, m1_22: number, m1_23: number,
        m1_31: number, m1_32: number, m1_33: number,

        m2_11: number, m2_12: number, m2_13: number,
        m2_21: number, m2_22: number, m2_23: number,
        m2_31: number, m2_32: number, m2_33: number,

        out: Matrix3
    ): Matrix3;
    static Add(matrix1: Matrix3, Matrix3: Matrix3): Matrix3;
    static Add(matrix1: Matrix3, Matrix3: Matrix3, out: Matrix3): Matrix3;
    static Add(array1: NumberArray, array2: NumberArray): Matrix3;
    static Add(array1: NumberArray, array2: NumberArray, out: Matrix3): Matrix3;
    static Add(
        _0: Matrix3 | NumberArray | number, _1: Matrix3 | NumberArray | number, _2?: Matrix3 | number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number,
        _9?: number, _10?: number, _11?: number, _12?: number, _13?: number, _14?: number, _15?: number, _16?: number, _17?: number, _18?: Matrix3): Matrix3
    {
        const out = _18 || (_2 instanceof Matrix3 ? _2 as Matrix3 : new Matrix3());

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) + (_9 as number);
            out[1] = (_1 as number) + (_10 as number);
            out[2] = (_2 as number) + (_11 as number);
            out[3] = (_3 as number) + (_12 as number);
            out[4] = (_4 as number) + (_13 as number);
            out[5] = (_5 as number) + (_14 as number);
            out[6] = (_6 as number) + (_15 as number);
            out[7] = (_7 as number) + (_16 as number);
            out[8] = (_8 as number) + (_17 as number);
        }
        else
        {
            out[0] = _0[0] + _1[0];
            out[1] = _0[1] + _1[1];
            out[2] = _0[2] + _1[2];
            out[3] = _0[3] + _1[3];
            out[4] = _0[4] + _1[4];
            out[5] = _0[5] + _1[5];
            out[6] = _0[6] + _1[6];
            out[7] = _0[7] + _1[7];
            out[8] = _0[8] + _1[8];
        }

        return out;
    }

    static Subtract(
        m1_11: number, m1_12: number, m1_13: number, m1_21: number, m1_22: number, m1_23: number, m1_31: number, m1_32: number, m1_33: number,
        m2_11: number, m2_12: number, m2_13: number, m2_21: number, m2_22: number, m2_23: number, m2_31: number, m2_32: number, m2_33: number): Matrix3;
    static Subtract(
        m1_11: number, m1_12: number, m1_13: number, m1_21: number, m1_22: number, m1_23: number, m1_31: number, m1_32: number, m1_33: number,
        m2_11: number, m2_12: number, m2_13: number, m2_21: number, m2_22: number, m2_23: number, m2_31: number, m2_32: number, m2_33: number, out: Matrix3): Matrix3;
    static Subtract(matrix1: Matrix3, Matrix3: Matrix3): Matrix3;
    static Subtract(matrix1: Matrix3, Matrix3: Matrix3, out: Matrix3): Matrix3;
    static Subtract(array1: NumberArray, array2: NumberArray): Matrix3;
    static Subtract(array1: NumberArray, array2: NumberArray, out: Matrix3): Matrix3;
    static Subtract(
        _0: Matrix3 | NumberArray | number, _1: Matrix3 | NumberArray | number, _2?: Matrix3 | number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number,
        _9?: number, _10?: number, _11?: number, _12?: number, _13?: number, _14?: number, _15?: number, _16?: number, _17?: number, _18?: Matrix3): Matrix3
    {
        const out = _18 || (_2 instanceof Matrix3 ? _2 as Matrix3 : new Matrix3());

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) - (_9 as number);
            out[1] = (_1 as number) - (_10 as number);
            out[2] = (_2 as number) - (_11 as number);
            out[3] = (_3 as number) - (_12 as number);
            out[4] = (_4 as number) - (_13 as number);
            out[5] = (_5 as number) - (_14 as number);
            out[6] = (_6 as number) - (_15 as number);
            out[7] = (_7 as number) - (_16 as number);
            out[8] = (_8 as number) - (_17 as number);
        }
        else
        {
            out[0] = _0[0] - _1[0];
            out[1] = _0[1] - _1[1];
            out[2] = _0[2] - _1[2];
            out[3] = _0[3] - _1[3];
            out[4] = _0[4] - _1[4];
            out[5] = _0[5] - _1[5];
            out[6] = _0[6] - _1[6];
            out[7] = _0[7] - _1[7];
            out[8] = _0[8] - _1[8];
        }

        return out;
    }

    static Multiply(
        m1_11: number, m1_12: number, m1_13: number, m1_21: number, m1_22: number, m1_23: number, m1_31: number, m1_32: number, m1_33: number,
        m2_11: number, m2_12: number, m2_13: number, m2_21: number, m2_22: number, m2_23: number, m2_31: number, m2_32: number, m2_33: number): Matrix3;
    static Multiply(
        m1_11: number, m1_12: number, m1_13: number, m1_21: number, m1_22: number, m1_23: number, m1_31: number, m1_32: number, m1_33: number,
        m2_11: number, m2_12: number, m2_13: number, m2_21: number, m2_22: number, m2_23: number, m2_31: number, m2_32: number, m2_33: number, out: Matrix3): Matrix3;
    static Multiply(matrix1: Matrix3, Matrix3: Matrix3): Matrix3;
    static Multiply(matrix1: Matrix3, Matrix3: Matrix3, out: Matrix3): Matrix3;
    static Multiply(array1: NumberArray, array2: NumberArray): Matrix3;
    static Multiply(array1: NumberArray, array2: NumberArray, out: Matrix3): Matrix3;
    static Multiply(
        _0: Matrix3 | NumberArray | number, _1: Matrix3 | NumberArray | number, _2?: Matrix3 | number, _3?: number, _4?: number, _5?: number, _6?: number, _7?: number, _8?: number,
        _9?: number, _10?: number, _11?: number, _12?: number, _13?: number, _14?: number, _15?: number, _16?: number, _17?: number, _18?: Matrix3): Matrix3
    {
        const out = _18 || (_2 instanceof Matrix3 ? _2 as Matrix3 : new Matrix3());

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            return out.Set(
                (_0 as number) * (_9 as number) + (_1 as number) * (_12 as number) + (_2 as number) * (_15 as number),
                (_0 as number) * (_10 as number) + (_1 as number) * (_13 as number) + (_2 as number) * (_16 as number),
                (_0 as number) * (_11 as number) + (_1 as number) * (_14 as number) + (_2 as number) * (_17 as number),

                (_3 as number) * (_9 as number) + (_4 as number) * (_12 as number) + (_5 as number) * (_15 as number),
                (_3 as number) * (_10 as number) + (_4 as number) * (_13 as number) + (_5 as number) * (_16 as number),
                (_3 as number) * (_11 as number) + (_4 as number) * (_14 as number) + (_5 as number) * (_17 as number),

                (_6 as number) * (_9 as number) + (_7 as number) * (_12 as number) + (_8 as number) * (_15 as number),
                (_6 as number) * (_10 as number) + (_7 as number) * (_13 as number) + (_8 as number) * (_16 as number),
                (_6 as number) * (_11 as number) + (_7 as number) * (_14 as number) + (_8 as number) * (_17 as number)
            );
        }
        else
        {
            return out.Set(
                _0[0] * _1[0] + _0[1] * _1[3] + _0[2] * _1[6],
                _0[0] * _1[1] + _0[1] * _1[4] + _0[2] * _1[7],
                _0[0] * _1[2] + _0[1] * _1[5] + _0[2] * _1[8],

                _0[3] * _1[0] + _0[4] * _1[3] + _0[5] * _1[6],
                _0[3] * _1[1] + _0[4] * _1[4] + _0[5] * _1[7],
                _0[3] * _1[2] + _0[4] * _1[5] + _0[5] * _1[8],

                _0[6] * _1[0] + _0[7] * _1[3] + _0[8] * _1[6],
                _0[6] * _1[1] + _0[7] * _1[4] + _0[8] * _1[7],
                _0[6] * _1[2] + _0[7] * _1[5] + _0[8] * _1[8]
            );
        }
    }

    static Scale(matrix: Matrix3, scalar: number): Matrix3;
    static Scale(matrix: Matrix3, scalar: number, out: Matrix3): Matrix3;
    static Scale(_0: Matrix3, _1: number, _2?: Matrix3): Matrix3
    {
        const out = _2 || new Matrix3();

        out[0] = _0[0] * _1;
        out[1] = _0[1] * _1;
        out[2] = _0[2] * _1;
        out[3] = _0[3] * _1;
        out[4] = _0[4] * _1;
        out[5] = _0[5] * _1;
        out[6] = _0[6] * _1;
        out[7] = _0[7] * _1;
        out[8] = _0[8] * _1;

        return out;
    }

    static Transpose(matrix: Matrix3): Matrix3;
    static Transpose(matrix: Matrix3, out: Matrix3): Matrix3;
    static Transpose(_0: Matrix3, _1?: Matrix3): Matrix3
    {
        const out = _1 || new Matrix3();

        return out.Set(
            _0[0], _0[3], _0[6],
            _0[1], _0[4], _0[7],
            _0[2], _0[5], _0[8]
        );
    }

    static Inverse(matrix: Matrix3): Matrix3;
    static Inverse(matrix: Matrix3, out: Matrix3): Matrix3;
    static Inverse(_0: Matrix3, _1?: Matrix3): Matrix3
    {
        const out = _1 || new Matrix3();
        const det = _0.Determinant;

        if (det !== 0)
        {
            out.Set(
                (_0[4] * _0[8] - _0[7] * _0[5]) / det,
                (_0[7] * _0[2] - _0[1] * _0[8]) / det,
                (_0[1] * _0[5] - _0[4] * _0[2]) / det,

                (_0[6] * _0[5] - _0[3] * _0[8]) / det,
                (_0[0] * _0[8] - _0[6] * _0[2]) / det,
                (_0[3] * _0[2] - _0[0] * _0[5]) / det,

                (_0[3] * _0[7] - _0[6] * _0[4]) / det,
                (_0[6] * _0[1] - _0[0] * _0[7]) / det,
                (_0[0] * _0[4] - _0[3] * _0[1]) / det
            );
        }

        return out;
    }

    static MultiplyVector(matrix: Matrix3, x: number, y: number, z: number): Vector3;
    static MultiplyVector(matrix: Matrix3, x: number, y: number, z: number, out: Vector3): Vector3;
    static MultiplyVector(matrix: Matrix3, vector: Vector3): Vector3;
    static MultiplyVector(matrix: Matrix3, vector: Vector3, out: Vector3): Vector3;
    static MultiplyVector(matrix: Matrix3, array: NumberArray): Vector3;
    static MultiplyVector(matrix: Matrix3, array: NumberArray, out: Vector3): Vector3;
    static MultiplyVector(_0: Matrix3, _1: Vector3 | NumberArray | number, _2?: Vector3 | number, _3?: number, _4?: Vector3): Vector3
    {
        const out = _4 || (_2 instanceof Vector3 ? _2 as Vector3 : new Vector3());
        const vec = typeof _1 === 'number'
            ? [_1, _2 as number, _3 as number]
            : _1;

        return out.Set(
            (_0[0] * vec[0]) + (_0[1] * vec[1]) + (_0[2] * vec[2]),
            (_0[3] * vec[0]) + (_0[4] * vec[1]) + (_0[5] * vec[2]),
            (_0[6] * vec[0]) + (_0[7] * vec[1]) + (_0[8] * vec[2])
        );
    }

    static RotationMatrixAroundAxis(x: number, y: number, z: number, angle: number): Matrix3;
    static RotationMatrixAroundAxis(x: number, y: number, z: number, angle: number, out: Matrix3): Matrix3;
    static RotationMatrixAroundAxis(axis: Vector3Array, angle: number): Matrix3;
    static RotationMatrixAroundAxis(axis: Vector3Array, angle: number, out: Matrix3): Matrix3;
    static RotationMatrixAroundAxis(axis: Vector3, angle: number): Matrix3;
    static RotationMatrixAroundAxis(axis: Vector3, angle: number, out: Matrix3): Matrix3;
    static RotationMatrixAroundAxis(_0: Vector3 | Vector3Array | number, _1: number, _2?: Matrix3 | number, _3?: number, _4?: Matrix3): Matrix3
    {
        const out = _4 || (_2 instanceof Matrix3 ? _2 as Matrix3 : new Matrix3());
        const axis = (
            typeof _0 === 'number'
            ? [_0, _1 as number, _2 as number]
            : _0
        ) as Vector3Array;
        const rotation = _3 !== undefined ? _3 : _1;

        const angle = radian(rotation);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const inv_cos = 1 - cos;

        out[0] = (cos) + (axis[0] * axis[0] * inv_cos);
        out[1] = (axis[0] * axis[1] * inv_cos) - (axis[2] * sin);
        out[2] = (axis[0] * axis[2] * inv_cos) + (axis[1] * sin);
        out[3] = (axis[1] * axis[0] * inv_cos) + (axis[2] * sin);
        out[4] = (cos) + (axis[1] * axis[1] * inv_cos);
        out[5] = (axis[1] * axis[2] * inv_cos) - (axis[0] * sin);
        out[6] = (axis[2] * axis[0] * inv_cos) - (axis[1] * sin);
        out[7] = (axis[2] * axis[1] * inv_cos) + (axis[0] * sin);
        out[8] = (cos) + (axis[2] * axis[2] * cos);

        return out;
    }

    static RotationMatrix(x: number, y: number, z: number): Matrix3;
    static RotationMatrix(x: number, y: number, z: number, out: Matrix3): Matrix3;
    static RotationMatrix(xyz: Vector3): Matrix3;
    static RotationMatrix(xyz: Vector3, out: Matrix3): Matrix3;
    static RotationMatrix(xyz: Vector3Array): Matrix3;
    static RotationMatrix(xyz: Vector3Array, out: Matrix3): Matrix3;
    static RotationMatrix(_0: Vector3 | Vector3Array | number, _1?: Matrix3 | number, _2?: number, _3?: Matrix3): Matrix3
    {
        const out = _3 || (_1 instanceof Matrix3 ? _1 as Matrix3 : new Matrix3());
        const rotation = (
            typeof _0 === 'number'
            ? [_0, _1 as number ?? _0, _2 as number ?? _0]
            : _0
        ) as Vector3Array;

        const x = radian(rotation[0]);
        const y = radian(rotation[1]);
        const z = radian(rotation[2]);

        const sin_x = Math.sin(x);
        const sin_y = Math.sin(y);
        const sin_z = Math.sin(z);

        const cos_x = Math.cos(x);
        const cos_y = Math.cos(y);
        const cos_z = Math.cos(z);

        out[0] = cos_y * cos_z;
        out[1] = cos_y * sin_z;
        out[2] = -sin_y;
        out[3] = sin_x * sin_y * cos_z - cos_x * sin_z;
        out[4] = sin_x * sin_y * sin_z + cos_x * cos_z;
        out[5] = sin_x * cos_y;
        out[6] = cos_x * sin_y * cos_z + sin_x * sin_z;
        out[7] = cos_x * sin_y * sin_z - sin_x * cos_z;
        out[8] = cos_x * cos_y;

        return out;
    }


    static ScaleMatrix(x: number, y: number, z: number): Matrix3;
    static ScaleMatrix(x: number, y: number, z: number, out: Matrix3): Matrix3;
    static ScaleMatrix(xyz: Vector3): Matrix3;
    static ScaleMatrix(xyz: Vector3, out: Matrix3): Matrix3;
    static ScaleMatrix(xyz: NumberArray): Matrix3;
    static ScaleMatrix(xyz: NumberArray, out: Matrix3): Matrix3;
    static ScaleMatrix(_0: Vector3 | NumberArray | number, _1?: Matrix3 | number, _2?: number, _3?: Matrix3): Matrix3
    {
        const out = _3 || (_1 instanceof Matrix3 ? _1 as Matrix3 : new Matrix3());
        const scale = typeof _0 === 'number'
            ? [_0, _1 as number, _2 as number]
            : _0;

        if (typeof _0 === 'number')
        {
            return out.Set(
                _0, 0, 0,
                0, _1 as number, 0,
                0, 0, _2 as number
            );
        }
        else
        {
            return out.Set(
                scale[0], 0, 0,
                0, scale[1], 0,
                0, 0, scale[2]
            );
        }
    }
    //#endregion
}
