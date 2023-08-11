import { FixedLengthArray, NumberArray } from '../types';
import { IsEquatable } from '../utils';
import { Colour4 } from './Colour4';

export type Colour3Array = FixedLengthArray<number, 3>;

export class Colour3 extends Float32Array implements IsEquatable<Colour3>
{
    //#region Properties
    get R(): number
    {
        return this[0];
    }

    set R(red: number)
    {
        this[0] = red;
    }

    get G(): number
    {
        return this[1];
    }

    set G(green: number)
    {
        this[1] = green;
    }

    get B(): number
    {
        return this[2];
    }

    set B(blue: number)
    {
        this[2] = blue;
    }

    get RGBA(): Colour4
    {
        return new Colour4(this, 1);
    }
    //#endregion

    constructor();
    constructor(r: number, g: number, b: number);
    constructor(colour: Colour3);
    constructor(colour: Colour4);
    constructor(colour: Colour3Array);
    constructor(buffer: ArrayBuffer);
    constructor(buffer: ArrayBuffer, byteOffset: number);
    constructor(_0: ArrayBuffer | Colour4 | Colour3 | number[] | number = 0, _1: number = 0, _2: number = 0)
    {
        if (typeof _0 === 'number')
        {
            super([_0, _1, _2]);
        }
        else if (_0 instanceof Colour3 || _0 instanceof Colour4 || _0 instanceof Array)
        {
            super([_0[0], _0[1], _0[2]]);
        }
        else
        {
            super(_0, _1, Colour3.SIZE);
        }
    }

    //#region Instance Methods
    Set(r: number, g: number, b: number): Colour3;
    Set(colour: Colour3): Colour3;
    Set(colour: Colour3Array): Colour3;
    Set(_0: Colour4 | Colour3 | NumberArray | number, _1?: number, _2?: number): Colour3
    {
        if (typeof _0 === 'number')
        {
            this[0] = _0 as number;
            this[1] = _1 as number;
            this[2] = _2 as number;
        }
        else
        {
            this[0] = _0[0];
            this[1] = _0[1];
            this[2] = _0[2];
        }

        return this;
    }

    Clone()
    {
        return new Colour3(this);
    }

    Equals(other: Colour3): boolean
    {
        return this[0] === other[0] &&
            this[1] === other[1] &&
            this[2] === other[2];
    }
    //#endregion

    static readonly SIZE: number = 3;
}
