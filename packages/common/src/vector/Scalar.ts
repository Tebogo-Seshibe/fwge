import { FixedLengthArray, NumberArray } from "../types";
import { IEquatable } from "../utils";

export type ScalarArray = FixedLengthArray<number, 1>;

export class Scalar extends Float32Array implements IEquatable<Scalar>
{
    //#region Local Properties
    get Value(): number
    {
        return this[0];
    }

    set Value(value: number)
    {
        this[0] = value;
    }
    //#endregion

    constructor();
    constructor(value: number);
    constructor(array: ScalarArray);
    constructor(buffer: ArrayBuffer);
    constructor(buffer: ArrayBuffer, byteOffset: number);
    constructor(_0?: ArrayBuffer | ScalarArray | number, _1?: number)
    {
        if (_0 instanceof ArrayBuffer)
        {
            super(_0, _1 ?? 0, Scalar.SIZE);
        }
        else if (typeof _0 === 'number')
        {
            super([_0]);
        }
        else if (_0 !== undefined)
        {
            super(_0);
        }
        else
        {
            super(Scalar.SIZE)
        }
    }

    //#region Local Methods
    Set(value: number): Scalar;
    Set(scalar: Scalar): Scalar;
    Set(array: NumberArray): Scalar;
    Set(_0: Scalar | NumberArray | number): Scalar
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

    Negate(): Scalar
    {
        this[0] = -this[0];

        return this;
    }

    Add(value: number): Scalar;
    Add(scalar: Scalar): Scalar;
    Add(array: NumberArray): Scalar;
    Add(_0: Scalar | NumberArray | number): Scalar
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

    Subtract(value: number): Scalar;
    Subtract(scalar: Scalar): Scalar;
    Subtract(array: NumberArray): Scalar;
    Subtract(_0: Scalar | NumberArray | number): Scalar
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

    Multiply(value: number): Scalar;
    Multiply(scalar: Scalar): Scalar;
    Multiply(array: NumberArray): Scalar;
    Multiply(_0: Scalar | NumberArray | number): Scalar
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

    Divide(value: number): Scalar;
    Divide(scalar: Scalar): Scalar;
    Divide(array: NumberArray): Scalar;
    Divide(_0: Scalar | NumberArray | number): Scalar
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

    Scale(scalar: number): Scalar
    {
        this[0] *= scalar;

        return this;
    }

    Clone(): Scalar
    {
        return new Scalar(this);
    }

    Equals(other: Scalar): boolean
    {
        return this[0] === other[0];
    }
    //#endregion

    public static readonly SIZE: number = 1;

    //#region Static Methods
    static Negate(scalar: Scalar): Scalar;
    static Negate(scalar: Scalar, out: Scalar): Scalar;
    static Negate(_0: Scalar, _1?: Scalar): Scalar
    {
        const out = _1 !== undefined ? _1 : new Scalar();

        out[0] = -_0[0];
        out[1] = -_0[1];

        return out;
    }

    static Add(value1: number, value2: number): Scalar;
    static Add(value1: number, value2: number, out: Scalar): Scalar;
    static Add(scalar1: Scalar, scalar2: Scalar): Scalar;
    static Add(scalar1: Scalar, scalar2: Scalar, out: Scalar): Scalar;
    static Add(array1: NumberArray, array2: NumberArray): Scalar;
    static Add(array1: NumberArray, array2: NumberArray, out: Scalar): Scalar;
    static Add(_0: Scalar | NumberArray | number, _1: Scalar | NumberArray | number, _2?: number | Scalar, _3?: number, _4?: Scalar): Scalar
    {
        const out = _4 !== undefined ? _4 : _2 instanceof Scalar ? _2 as Scalar : new Scalar();

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) + (_2 as number);
        }
        else
        {
            out[0] = _0[0] + _1[0];
        }

        return out;
    }

    static Subtract(value1: number, value2: number): Scalar;
    static Subtract(value1: number, value2: number, out: Scalar): Scalar;
    static Subtract(scalar1: Scalar, scalar2: Scalar): Scalar;
    static Subtract(scalar1: Scalar, scalar2: Scalar, out: Scalar): Scalar;
    static Subtract(array1: NumberArray, array2: NumberArray): Scalar;
    static Subtract(array1: NumberArray, array2: NumberArray, out: Scalar): Scalar;
    static Subtract(_0: Scalar | NumberArray | number, _1: Scalar | NumberArray | number, _2?: number | Scalar, _3?: number, _4?: Scalar): Scalar
    {
        const out = _4 !== undefined ? _4 : _2 instanceof Scalar ? _2 as Scalar : new Scalar();

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) - (_2 as number);
        }
        else
        {
            out[0] = _0[0] - _1[0];
        }

        return out;
    }

    static Multiply(value1: number, value2: number): Scalar;
    static Multiply(value1: number, value2: number, out: Scalar): Scalar;
    static Multiply(scalar1: Scalar, scalar2: Scalar): Scalar;
    static Multiply(scalar1: Scalar, scalar2: Scalar, out: Scalar): Scalar;
    static Multiply(array1: NumberArray, array2: NumberArray): Scalar;
    static Multiply(array1: NumberArray, array2: NumberArray, out: Scalar): Scalar;
    static Multiply(_0: Scalar | NumberArray | number, _1: Scalar | NumberArray | number, _2?: number | Scalar, _3?: number, _4?: Scalar): Scalar
    {
        const out = _4 !== undefined ? _4 : _2 instanceof Scalar ? _2 as Scalar : new Scalar();

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) * (_2 as number);
        }
        else
        {
            out[0] = _0[0] * _1[0];
        }

        return out;
    }

    static Divide(value1: number, value2: number): Scalar;
    static Divide(value1: number, value2: number, out: Scalar): Scalar;
    static Divide(scalar1: Scalar, scalar2: Scalar): Scalar;
    static Divide(scalar1: Scalar, scalar2: Scalar, out: Scalar): Scalar;
    static Divide(array1: NumberArray, array2: NumberArray): Scalar;
    static Divide(array1: NumberArray, array2: NumberArray, out: Scalar): Scalar;
    static Divide(_0: Scalar | NumberArray | number, _1: Scalar | NumberArray | number, _2?: number | Scalar, _3?: number, _4?: Scalar): Scalar
    {
        const out = _4 !== undefined ? _4 : _2 instanceof Scalar ? _2 as Scalar : new Scalar();

        if (typeof _0 === 'number' || typeof _1 === 'number')
        {
            out[0] = (_0 as number) / (_2 as number);
        }
        else
        {
            out[0] = _0[0] / _1[0];
        }

        return out;
    }

    static Scale(value: Scalar, scalar: number): Scalar;
    static Scale(vector: Scalar, scalar: number, out: Scalar): Scalar;
    static Scale(_0: Scalar, _1: number, _2?: Scalar): Scalar
    {
        const out = _2 !== undefined ? _2 : new Scalar();

        out[0] = _0[0] * _1;

        return out;
    }
    //#endregion
}
