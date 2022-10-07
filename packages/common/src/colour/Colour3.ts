import { FixedLengthArray, NumberArray } from '../types'
import { Colour4 } from './Colour4'

export type Colour3Array = FixedLengthArray<number, 3>
export class Colour3 extends Float32Array
{    
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
    
    get RGBA(): Colour4
    {
        return new Colour4(this, 1)
    }

    get BIN(): string
    {
        let str = 'b'
        this.forEach(i => str += Math.round(i * 255).toString(2))

        return str
    }

    get OCT(): string
    {
        let str = 'o'
        this.forEach(i => str += Math.round(i * 255).toString(8))

        return str
    }

    get DEC(): string
    {
        let str = ''
        this.forEach(i => str += Math.round(i * 255).toString(10) + ',')

        return str.substring(0, str.length - 1)
    }

    get HEX(): string
    {
        let str = '#' 
        this.forEach(i => str += Math.round(i * 255).toString(16))

        return str
    }

    get HSV(): string
    {
        return 'TODO'
    }

    static readonly SIZE: number = 3
    
    constructor()
    constructor(rgb: number)
    constructor(r: number, g: number, b: number)
    constructor(colour: Colour3)
    constructor(colour: [number, number, number])
    constructor(colour: Colour4)
    constructor(buffer: ArrayBuffer)
    constructor(buffer: ArrayBuffer, byteOffset: number)
    constructor(_0: ArrayBuffer | Colour4 | Colour3 | NumberArray | number = 0, _1?: number, _2?: number)
    {
        if (_0 instanceof ArrayBuffer)
        {
            super(_0, _1 ?? 0, Colour3.SIZE)
        }
        else if (typeof _0 === 'number')
        {
            super([_0, _1 ?? _0, _2 ?? _0])
        }
        else
        {
            super(_0)
        }
    }
    
    Set(rgb: number): Colour3
    Set(r: number, g: number, b: number): Colour3
    Set(colour: Colour3): Colour3
    Set(colour: Colour3Array): Colour3
    Set(colour: Colour4): Colour3
    Set(_0: Colour4 | Colour3 | NumberArray | number, _1?: number, _2?: number): Colour3
    {
        if (typeof _0 === 'number')
        {
            this[0] = _0
            this[1] = _1 ?? _0
            this[2] = _2 ?? _0
        }
        else
        {            
            this[0] = _0[0]
            this[1] = _0[1]
            this[2] = _0[2]
        }
        
        return this
    }
    
    Clone()
    {
        return new Colour3(this)
    }
}
