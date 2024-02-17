import { FixedLengthArray, NumberArray } from "../types";
import { IsEquatable } from "../utils";

export type ScalarArray = FixedLengthArray<number, 1>;

export class Scalar extends Float32Array implements IsEquatable<Scalar>
{
    //#region Local Properties
    public get Value(): number
    {
        return this[0];
    }

    public set Value(value: number)
    {
        this[0] = value;
    }
    //#endregion

    constructor();
    constructor(value: number);
    constructor(array: ScalarArray);
    constructor(buffer: ArrayBuffer | SharedArrayBuffer);
    constructor(buffer: ArrayBuffer | SharedArrayBuffer, byteOffset: number);
    constructor(_0: ArrayBuffer | SharedArrayBuffer | ScalarArray | number = 0, _1: number = 0)
    {
        if (typeof _0 === 'number')
        {
            super([_0]);
        }
        else if (_0 instanceof Array)
        {
            super(_0[0]);
        }
        else
        {
            super(_0, _1, Scalar.SIZE);
        }
    }

    //#region Local Methods
    public Set(value: number): Scalar;
    public Set(scalar: Scalar): Scalar;
    public Set(array: ScalarArray): Scalar;
    public Set(_0: Scalar | ScalarArray | number): Scalar
    {
        if (typeof _0 === 'number')
        {
            this[0] = _0;
        }
        else
        {
            this[0] = _0[0];
        }

        return this;
    }

    public Negate(): Scalar
    {
        this[0] = -this[0];

        return this;
    }

    public Add(value: number): Scalar;
    public Add(scalar: Scalar): Scalar;
    public Add(array: NumberArray): Scalar;
    public Add(_0: Scalar | NumberArray | number): Scalar
    {
        if (typeof _0 === 'number')
        {
            this[0] += _0;
        }
        else
        {
            this[0] += _0[0];
        }

        return this;
    }

    public Subtract(value: number): Scalar;
    public Subtract(scalar: Scalar): Scalar;
    public Subtract(array: NumberArray): Scalar;
    public Subtract(_0: Scalar | NumberArray | number): Scalar
    {
        if (typeof _0 === 'number')
        {
            this[0] -= _0;
        }
        else
        {
            this[0] -= _0[0];
        }

        return this;
    }

    public Multiply(value: number): Scalar;
    public Multiply(scalar: Scalar): Scalar;
    public Multiply(array: NumberArray): Scalar;
    public Multiply(_0: Scalar | NumberArray | number): Scalar
    {
        if (typeof _0 === 'number')
        {
            this[0] *= _0;
        }
        else
        {
            this[0] *= _0[0];
        }

        return this;
    }

    public Divide(value: number): Scalar;
    public Divide(scalar: Scalar): Scalar;
    public Divide(array: NumberArray): Scalar;
    public Divide(_0: Scalar | NumberArray | number): Scalar
    {
        if (typeof _0 === 'number')
        {
            this[0] /= _0;
        }
        else
        {
            this[0] /= _0[0];
        }

        return this;
    }

    public Scale(scalar: number): Scalar
    {
        this[0] *= scalar;

        return this;
    }

    public Clone(): Scalar
    {
        return new Scalar(this);
    }

    public Equals(other: Scalar): boolean
    {
        return this[0] === other[0];
    }
    //#endregion

    public static readonly SIZE: number = 1;

    //#region public static Methods
    public static Negate(scalar: Scalar): Scalar;
    public static Negate(scalar: Scalar, out: Scalar): Scalar;
    public static Negate(_0: Scalar, _1?: Scalar): Scalar
    {
        const out = _1 || new Scalar();

        out[0] = -_0[0];

        return out;
    }

    public static Add(value1: number, value2: number): Scalar;
    public static Add(value1: number, value2: number, out: Scalar): Scalar;
    public static Add(scalar1: Scalar, scalar2: Scalar): Scalar;
    public static Add(scalar1: Scalar, scalar2: Scalar, out: Scalar): Scalar;
    public static Add(array1: NumberArray, array2: NumberArray): Scalar;
    public static Add(array1: NumberArray, array2: NumberArray, out: Scalar): Scalar;
    public static Add(_0: Scalar | NumberArray | number, _1: Scalar | NumberArray | number, _2?: Scalar): Scalar
    {
        const out = _2 || new Scalar();

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) + (_1 as number);
        }
        else
        {
            out[0] = _0[0] + _1[0];
        }

        return out;
    }

    public static Subtract(value1: number, value2: number): Scalar;
    public static Subtract(value1: number, value2: number, out: Scalar): Scalar;
    public static Subtract(scalar1: Scalar, scalar2: Scalar): Scalar;
    public static Subtract(scalar1: Scalar, scalar2: Scalar, out: Scalar): Scalar;
    public static Subtract(array1: NumberArray, array2: NumberArray): Scalar;
    public static Subtract(array1: NumberArray, array2: NumberArray, out: Scalar): Scalar;
    public static Subtract(_0: Scalar | NumberArray | number, _1: Scalar | NumberArray | number, _2?: Scalar): Scalar
    {
        const out = _2 || new Scalar();

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) - (_1 as number);
        }
        else
        {
            out[0] = _0[0] - _1[0];
        }

        return out;
    }

    public static Multiply(value1: number, value2: number): Scalar;
    public static Multiply(value1: number, value2: number, out: Scalar): Scalar;
    public static Multiply(scalar1: Scalar, scalar2: Scalar): Scalar;
    public static Multiply(scalar1: Scalar, scalar2: Scalar, out: Scalar): Scalar;
    public static Multiply(array1: NumberArray, array2: NumberArray): Scalar;
    public static Multiply(array1: NumberArray, array2: NumberArray, out: Scalar): Scalar;
    public static Multiply(_0: Scalar | NumberArray | number, _1: Scalar | NumberArray | number, _2?: Scalar): Scalar
    {
        const out = _2 || new Scalar();

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) * (_1 as number);
        }
        else
        {
            out[0] = _0[0] * _1[0];
        }

        return out;
    }

    public static Divide(value1: number, value2: number): Scalar;
    public static Divide(value1: number, value2: number, out: Scalar): Scalar;
    public static Divide(scalar1: Scalar, scalar2: Scalar): Scalar;
    public static Divide(scalar1: Scalar, scalar2: Scalar, out: Scalar): Scalar;
    public static Divide(array1: NumberArray, array2: NumberArray): Scalar;
    public static Divide(array1: NumberArray, array2: NumberArray, out: Scalar): Scalar;
    public static Divide(_0: Scalar | NumberArray | number, _1: Scalar | NumberArray | number, _2?: Scalar): Scalar
    {
        const out = _2 || new Scalar();

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) / (_1 as number);
        }
        else
        {
            out[0] = _0[0] / _1[0];
        }

        return out;
    }

    public static Scale(value: Scalar, scalar: number): Scalar;
    public static Scale(vector: Scalar, scalar: number, out: Scalar): Scalar;
    public static Scale(_0: Scalar, _1: number, _2?: Scalar): Scalar
    {
        const out = _2 || new Scalar();

        out[0] = _0[0] * _1;

        return out;
    }
    //#endregion
}
