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

    static SIZE: number = 4

    constructor()
    constructor(rgba: number)
    constructor(r: number, g: number, b: number, a: number)
    constructor(hex: string, alpha?: number)
    constructor(colour: Colour3)
    constructor(colour: Colour3, a: number)
    constructor(colour: Colour4)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(r?: Colour3 | Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number)
    {
        super(4)

        if (r !== undefined)
        {
            if (typeof r === 'number')
            {
                this.Set(r, g!, b!, a!)
            }
            else if (typeof r === 'string')
            {
                if (g !== undefined)
                {
                    g = 1.0
                }

                this.Set(r, g!)
            }
            else
            {
                this.Set([ ...r ])
            }
        }
    }

    Set(r: number, g: number, b: number, a: number): Colour4
    Set(hex: string, alpha: number): Colour4
    Set(colour: Colour3): Colour4
    Set(colour: Colour4): Colour4
    Set(array: Float32Array): Colour4
    Set(array: number[]): Colour4
    Set(r: Colour3 | Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number): Colour4
    {
        [ r, g, b, a ] = Deconstruct(r, g, b, a)

        this.R = r
        this.G = g
        this.B = b
        this.A = a

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

}

function Deconstruct(r: Colour3 | Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number): number[]
{
    if (typeof r === 'string')
    {
        let alpha: number = g !== undefined ? g : 1

        if (r.match(/#([0-9A-F]{3})/i))
        {
            [ r, g, b ] = r.substring(1)
                                .toUpperCase()
                                .split('')
                                .map(c => parseInt(c + c, 16) / 255)
        }
        else if (r.match(/#[0-9A-F]{6}/i))
        {
            [ r, g, b ] = r.substring(1)
                            .toUpperCase()
                            .split(/(?=(?:..)*$)/)
                            .map(c => parseInt(c, 16) / 255)
        }
        else
        {
            [ r, g, b ] = [ 0, 0, 0 ]
        }
        
        a = alpha
    }
    else if (r instanceof Float32Array || r instanceof Array)
    {
        [ r = 0, g = 0, b = 0, a = 0 ] = r
    }

    return [ r, g!, b!, a! ]
}
