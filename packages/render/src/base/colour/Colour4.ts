import { clamp, clean } from '@fwge/common'
import { Colour3 } from './Colour3'

export class Colour4 extends Float32Array
{    
    get R(): number
    {
        return this[0]
    }

    set R(red: number)
    {
        this[0] = clamp(red, 0, 1)
    }
        
    get G(): number
    {
        return this[1]
    }

    set G(green: number)
    {
        this[1] = clamp(green, 0, 1)
    }
        
    get B(): number
    {
        return this[2]
    }

    set B(blue: number)
    {
        this[2] = clamp(blue, 0, 1)
    }
        
    get A(): number
    {
        return this[3]
    }

    set A(alpha: number)
    {
        this[3] = clamp(alpha, 0, 1)
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

    public static readonly SIZE: number = 4

    constructor()
    constructor(rgba: number)
    constructor(r: number, g: number, b: number, a: number)
    constructor(colour: Colour4)
    constructor(colour: number[])
    constructor(r: Colour4 | Float32Array | number[] | number = 1.0, g?: number, b?: number, a?: number)
    {
        super(typeof r === 'number' ?
        [
            r, g ?? r, b ?? r, a ?? r
        ] : r)
    }

    Set(rgba: number): Colour4
    Set(r: number, g: number, b: number, a: number): Colour4
    Set(colour: Colour4): Colour4
    Set(r: Colour3 | Colour4 | Float32Array | number[] | number, g?: number, b?: number, a?: number): Colour4
    {
        r = typeof r === 'number' ?
        [
            r, g ?? r, b ?? r, a ?? r
        ] : r
        // r = typeof r === 'number' 
        //     ? [ r, g, b, a ] 
        //     : typeof r === 'string'
        //         ? parseString(r)
        //         : [ 0, 0, 0, 0 ]

        this[0] = r[0]
        this[1] = r[1]
        this[2] = r[2]
        this[3] = r[3]

        return this
    }

    // static Lerp(number: number, r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number): Colour4
    // static Lerp(number: number, hex1: string, hex2: string): Colour4
    // static Lerp(number: number, array1: number[], array: number[]): Colour4
    // static Lerp(number: number, array1: Float32Array, array2: Float32Array): Colour4
    // static Lerp(number: number, r1: number | string | number[] | Float32Array, g1: number | string | number[] | Float32Array, b1?: number, a1?: number, r2?: number, g2?: number, b2?: number, a2?: number): Colour4
    // {
    //     // return lerp()
    //     return 
    // }

    Clone(): Colour4
    {
        return new Colour4(this)
    }
}

function parseString(s: string): number[]
{
    if (s.match(/#([0-9A-F]{3})/i))
    {
        return s.substring(1).toUpperCase().split('').map(c => parseInt(c + c, 16) / 255)
    }
    else if (s.match(/#[0-9A-F]{6}/i))
    {
        return s.substring(1).toUpperCase().split(/(?=(?:..)*$)/).map(c => parseInt(c, 16) / 255)
    }

    return [0,0,0,0]
}
