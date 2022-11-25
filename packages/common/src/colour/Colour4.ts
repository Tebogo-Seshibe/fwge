import { FixedLengthArray, NumberArray } from '../types'
import { Colour3 } from './Colour3'

export type Colour4Array = FixedLengthArray<number, 4>

export class Colour4 extends Float32Array
{
    //#region Instance Properties
    get R(): number
    {
        return this[0]
    }

    set R(red: number)
    {
        this[0] = red
    }
        
    get G(): number
    {
        return this[1]
    }

    set G(green: number)
    {
        this[1] = green
    }
        
    get B(): number
    {
        return this[2]
    }

    set B(blue: number)
    {
        this[2] = blue
    }

    get A()
    {
        return this[3]
    }

    set A(alpha: number)
    {
        this[3] = alpha
    }
    
    get RGB(): Colour3
    {
        return new Colour3(this[0], this[1], this[2])
    }
    //#endregion
    
    constructor()
    constructor(rgba: number)
    constructor(r: number, g: number, b: number, a: number)
    constructor(colour: Colour3, alpha: number)
    constructor(colour: Colour4)
    constructor(colour: [number, number, number, number])
    constructor(buffer: ArrayBuffer)
    constructor(buffer: ArrayBuffer, byteOffset: number)
    constructor(_0: ArrayBuffer | Colour4 | Colour3 | NumberArray | number = 0, _1?: number, _2?: number, _3?: number)
    {
        if (_0 instanceof ArrayBuffer)
        {
            super(_0, _1 ?? 0, Colour4.SIZE)
        }
        else if (typeof _0 === 'number')
        {
            super([_0, _1 ?? _0, _2 ?? _0, _3 ?? _0])
        }
        else if (_0 instanceof Colour3)
        {
            super([_0[0], _0[1], _0[2], _1 as number])
        }
        else
        {
            super(_0)
        }
    }
    
    //#region Instance Methods
    Set(rgba: number): Colour4
    Set(r: number, g: number, b: number, a: number): Colour4
    Set(rgb: Colour3, a: number): Colour4
    Set(array: Colour4Array): Colour4
    Set(colour: Colour4): Colour4
    Set(_0: Colour4 | Colour3 | Colour4Array | number, _1?: number, _2?: number, _3?: number): Colour4
    {
        if (typeof _0 === 'number')
        {
            this[0] = _0
            this[1] = _1 ?? _0
            this[2] = _2 ?? _0
            this[3] = _3 ?? _0
        }
        else
        {            
            this[0] = _0[0]
            this[1] = _0[1]
            this[2] = _0[2]
            this[3] = _0[3] ?? _1
        }
        
        return this
    }
    
    Clone()
    {
        return new Colour4(this)
    }

    Equals(other: Colour4): boolean
    {
        return this[0] === other[0] && 
            this[1] === other[1] &&
            this[2] === other[2] &&
            this[3] === other[3]
    }
    //#endregion

    static readonly SIZE: number = 4
}
