import { clamp, clean } from '@fwge/common'
import { Colour4 } from './Colour4'

export class Colour3 extends Float32Array
{    
    get R(): number
    {
        return this[0]
    }

    set R(red: number)
    {
        this[0] = clean(clamp(red, 0, 1))
    }
        
    get G(): number
    {
        return this[1]
    }

    set G(green: number)
    {
        this[1] = clean(clamp(green, 0, 1))
    }
        
    get B(): number
    {
        return this[2]
    }

    set B(blue: number)
    {
        this[2] = clean(clamp(blue, 0, 1))
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
    
    constructor()
    constructor(r: number, g: number, b: number)
    constructor(hex: string)
    constructor(array: Float32Array)
    constructor(colour: Colour3)
    constructor(colour: Colour4)
    constructor(array: number[])
    constructor(r?: Float32Array | number[] | number | string, g?: number, b?: number)
    {
        super(3)

        if (r !== undefined)
        {
            if (typeof r === 'number')
            {
                this.Set(r, g!, b!)
            }
            else if (typeof r === 'string')
            {
                this.Set(r)
            }
            else
            {
                this.Set([ ...r ])
            }
        }
    }
    
    Set(r: number, g: number, b: number): Colour3
    Set(hex: string): Colour3
    Set(colour: Colour3): Colour3
    Set(colour: Colour4): Colour3
    Set(array: Float32Array): Colour3
    Set(array: number[]): Colour3
    Set(r: Float32Array | number[] | number | string, g?: number, b?: number): Colour3
    {
        [ r, g, b ] = Deconstruct(r, g, b)        

        this.R = r
        this.G = g
        this.B = b

        return this
    }
}

function Deconstruct(r: Float32Array | number[] | number | string, g?: number, b?: number): number[]
{
    if (typeof r === 'string')
    {
        if (r.match(/#[0-9A-F]{6}/i))
        {
            [ r, g, b ] = r.substring(1)
                .toUpperCase()
                .split(/(?=(?:..)*$)/)
                .map(c => parseInt(c, 16))
        }
        else if (r.match(/#([0-9A-F]{3}){1,2}/i))
        {
            [ r, g, b ] = r.substring(1)
                .toUpperCase()
                .split('')
                .map(c => parseInt(c, 16))
        }
        else
        {
            [ r, g, b ] = [ 0, 0, 0 ]
        }
    }
    else if (r instanceof Float32Array || r instanceof Array)
    {
        [ r = 0, g = 0, b = 0 ] = r
    }

    return [ r, g!, b! ]
}
