import '../../Logic/Maths/Math';
import Colour3 from './Colour3';

export default class Colour4 extends Float32Array
{    
    public get R(): number
    {
        return this[0]
    }

    public set R(red: number)
    {
        this[0] = Math.clean(Math.clamp(red, 0, 1))
    }
        
    public get G(): number
    {
        return this[1]
    }

    public set G(green: number)
    {
        this[1] = Math.clean(Math.clamp(green, 0, 1))
    }
        
    public get B(): number
    {
        return this[2]
    }

    public set B(blue: number)
    {
        this[2] = Math.clean(Math.clamp(blue, 0, 1))
    }
        
    public get A(): number
    {
        return this[3]
    }

    public set A(alpha: number)
    {
        this[3] = Math.clean(Math.clamp(alpha, 0, 1))
    }

    public get BIN(): string
    {
        let str = 'b'
        this.forEach(i => str += Math.round(i * 255).toString(2))

        return str
    }

    public get OCT(): string
    {
        let str = 'o'
        this.forEach(i => str += Math.round(i * 255).toString(8))

        return str
    }

    public get DEC(): string
    {
        let str = ''
        this.forEach(i => str += Math.round(i * 255).toString(10) + ',')

        return str.substring(0, str.length - 1)
    }

    public get HEX(): string
    {
        let str = '#' 
        this.forEach(i => str += Math.round(i * 255).toString(16))

        return str
    }

    
    constructor()
    constructor(r: number, g: number, b: number, a: number)
    constructor(hex: string, alpha: number)
    constructor(colour: Colour3)
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
                this.Set(r, g, b, a)
            }
            else if (typeof r === 'string')
            {
                this.Set(r, g)
            }
            else
            {
                this.Set([ ...r ])
            }
        }
    }

    public Set(r: number, g: number, b: number, a: number): Colour4
    public Set(hex: string, alpha: number): Colour4
    public Set(colour: Colour3): Colour4
    public Set(colour: Colour4): Colour4
    public Set(array: Float32Array): Colour4
    public Set(array: number[]): Colour4
    public Set(r: Colour3 | Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number): Colour4
    {
        [ r, g, b, a ] = Colour4.Deconstruct(r, g, b, a)

        this.R = r
        this.G = g
        this.B = b
        this.A = a

        return this
    }

    private static Deconstruct(r?: Colour3 | Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number): number[]
    {
        if (typeof r === 'string')
        {
            let alpha: number = Number.isSafeInteger(g) ? g : 1

            if (r.match(/#([0-9A-F]{3}){1,2}/i))
            {
                [ r, g, b ] = r.substring(1)
                                    .toUpperCase()
                                    .split('')
                                    .map(c => parseInt(c, 16))
            }
            else if (r.match(/#[0-9A-F]{6}/i))
            {
                [ r, g, b ] = r.substring(1)
                                .toUpperCase()
                                .split(/(?=(?:..)*$)/)
                                .map(c => parseInt(c, 16))
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

        return [ r, g, b, a ]
    }
}
