import Maths from '../Maths/Maths'

export default class Colour4 extends Float32Array
{    
    get R(): number
    {
        return this[0]
    }

    set R(red: number)
    {
        this[0] = Maths.CleanFloat(Maths.Clamp(red, 0, 1))
    }
        
    get G(): number
    {
        return this[1]
    }

    set G(green: number)
    {
        this[1] = Maths.CleanFloat(Maths.Clamp(green, 0, 1))
    }
        
    get B(): number
    {
        return this[2]
    }

    set B(blue: number)
    {
        this[2] = Maths.CleanFloat(Maths.Clamp(blue, 0, 1))
    }
        
    get A(): number
    {
        return this[3]
    }

    set A(alpha: number)
    {
        this[3] = Maths.CleanFloat(Maths.Clamp(alpha, 0, 1))
    }

    get BIN(): string
    {
        let str = 'b'
        this.forEach(i => str += i.toString(2))

        return str
    }

    get OCT(): string
    {
        let str = 'o'
        this.forEach(i => str += i.toString(8))

        return str
    }

    get HEX(): string
    {
        let str = '#' 
        this.forEach(i => str += i.toString(16))

        return str
    }

    
    constructor()
    constructor(hex: string)
    constructor(colour: Colour4 | Float32Array | number[])
    constructor(r: number, g: number, b: number, a: number)
    constructor(r?: Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number)
    {
        super(4)

        this.Set(r, g, b, a);

        Object.seal(this);
    }

    Set(r?: Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number): Colour4
    {
        return Colour4.Set(this, r, b, g, a)
    }

    static Set(colour: Colour4, r?: Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number): Colour4
    {
        if (r instanceof Colour4 || r instanceof Float32Array || r instanceof Array)
        {
            [ r, g, b, a ] = [ r[0], r[1], r[2], r[3] ]

        }
        else if (typeof(r) === 'string')
        {
            if (r.match(/#([0-9A-F]{3}){1,2}/i))
            {
                [r, b, g, a] = r.substring(1)
                                .toUpperCase()
                                .split('')
                                .map(c => parseInt(c, 16))
            }
            else if (r.match(/#[0-9A-F]{6}/i))
            {
                [r, b, g, a] = r.substring(1)
                                .toUpperCase()
                                .split(/(?=(?:..)*$)/)
                                .map(c => parseInt(c, 16))
            }
            else
            {
                r = 0
            }
        }

        colour.R = r
        colour.G = g
        colour.B = b
        colour.A = a

        return colour;
    }

    static FromBin(bin: string): Colour4
    {
        return null
    }

    static ToBin(bin: Colour4 | Float32Array | Array<number>): string
    {
        return ''
    }
    
    static FromOct(oct: string): Colour4
    {
        return null
    }

    static ToOct(oct: Colour4 | Float32Array | Array<number>): string
    {
        return ''
    }
    
    static FromHex(hex: string): Colour4
    {
        return null
    }

    static ToHex(hex: Colour4 | Float32Array | Array<number>): string
    {
        return ''
    }
}
