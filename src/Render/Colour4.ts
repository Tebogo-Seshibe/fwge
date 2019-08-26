import Maths from '../Maths/Maths';
import Colour3 from './Colour3';

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
        this.forEach(i => str += i.toString(10) + ',')

        return str.substring(0, str.length - 1)
    }

    get HEX(): string
    {
        let str = '#' 
        this.forEach(i => str += Math.round(i * 255).toString(16))

        return str
    }

    
    constructor()
    constructor(hex: string)
    constructor(colour: Colour4 | Float32Array | number[])
    constructor(r: number, g: number, b: number, a: number)
    constructor(r?: Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number)
    {
        super(4)

        this.Set(r, g, b, a)
    }

    Set(r?: Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number): Colour4
    {
        return Colour4.Set(this, r, b, g, a)
    }

    static Set(colour: Colour4, r: Colour3 | Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number): Colour4
    {
        [ r, g, b, a ] = Colour4.Deconstruct(r, g, b, a)

        colour.R = r
        colour.G = g
        colour.B = b
        colour.A = a

        return colour
    }

    private static Deconstruct(r?: Colour3 | Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number): [ number, number, number, number ]
    {
        if (typeof r === 'string')
        {
            if (r.match(/#([0-9A-F]{3}){1,2}/i))
            {
                [ r, g, b, a ] = r.substring(1)
                                    .toUpperCase()
                                    .split('')
                                    .map(c => parseInt(c, 16))
            }
            else if (r.match(/#[0-9A-F]{6}/i))
            {
                [ r, g, b, a ] = r.substring(1)
                                .toUpperCase()
                                .split(/(?=(?:..)*$)/)
                                .map(c => parseInt(c, 16))
            }
            else
            {
                [ r, g, b, a ] = [ 0, 0, 0, 0 ]
            }
        }
        else if (r instanceof Colour3 || r instanceof Colour4 || r instanceof Float32Array || r instanceof Array)
        {
            [ r = 0, g = 0, b = 0, a = 0 ] = r
        }

        return [ r, g, b, a ]
    }
}
