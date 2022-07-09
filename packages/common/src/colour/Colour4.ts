import { NumberArray } from '../types'
import { Colour3 } from './Colour3'

export class Colour4 extends Uint8Array
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

    set A(alpha: number)
    {
        this[3] = alpha
    }
    
    get RGB(): Colour3
    {
        return new Colour3(this[0], this[1], this[2])
    }

    // get BIN(): string
    // {
    //     let str = 'b'
    //     this.forEach(i => str += Math.round(i * 255).toString(2))

    //     return str
    // }

    // get OCT(): string
    // {
    //     let str = 'o'
    //     this.forEach(i => str += Math.round(i * 255).toString(8))

    //     return str
    // }

    // get DEC(): string
    // {
    //     let str = ''
    //     this.forEach(i => str += Math.round(i * 255).toString(10) + ',')

    //     return str.substring(0, str.length - 1)
    // }

    // get HEX(): string
    // {
    //     let str = '#' 
    //     this.forEach(i => str += Math.round(i * 255).toString(16))

    //     return str
    // }

    // get HSV(): string
    // {
    //     return 'TODO'
    // }

    static readonly SIZE: number = 4
    
    constructor()
    constructor(rgba: number)
    constructor(r: number, g: number, b: number, a: number)
    constructor(colour: Colour3, alpha: number)
    constructor(colour: Colour4)
    constructor(colour: [number, number, number, number])
    constructor(_0: Colour4 | Colour3 | NumberArray | number = 0, _1?: number, _2?: number, _3?: number)
    {
        super(typeof _0 === 'number' ? 
        [
            _0,
            _1 ?? _0,
            _2 ?? _0,
            _3 ?? _0
        ] : [_0[0], _0[1], _0[2], _0[3] ?? _1])
    }
    
    Set(rgba: number): Colour4
    Set(r: number, g: number, b: number, a: number): Colour4
    Set(rgb: Colour3, a: number): Colour4
    Set(colour: Colour4): Colour4
    Set(_0: Colour4 | Colour3 | NumberArray | number, _1?: number, _2?: number, _3?: number): Colour4
    {
        console.log(
        [
            _0,
            _1,
            _2,
            _3
        ])
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
}
