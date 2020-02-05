import '../../Logic/Maths/Math';
import Colour4 from './Colour4';

export default class Colour3 extends Float32Array
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
    constructor(r: number, g: number, b: number)
    constructor(hex: string)
    constructor(colour: Colour3)
    constructor(colour: Colour4)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(r?: Float32Array | number[] | number | string, g?: number, b?: number)
    {
        super(3)

        if (r !== undefined)
        {
            if (typeof r === 'number')
            {
                this.Set(r, g, b)
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
    
    public Set(r: number, g: number, b: number): Colour3
    public Set(hex: string): Colour3
    public Set(colour: Colour3): Colour3
    public Set(colour: Colour4): Colour3
    public Set(array: Float32Array): Colour3
    public Set(array: number[]): Colour3
    public Set(r: Float32Array | number[] | number | string, g?: number, b?: number): Colour3
    {
        [ r, g, b ] = Colour3.Deconstruct(r, g, b)
        

        this.R = r
        this.G = g
        this.B = b

        return this
    }

    private static Deconstruct(r: Float32Array | number[] | number | string, g?: number, b?: number): number[]
    {
        if (typeof r === 'string')
        {
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
        }
        else if (r instanceof Float32Array || r instanceof Array)
        {
            [ r, g, b ] = r
        }

        return [ r, g, b ]
    }
}
