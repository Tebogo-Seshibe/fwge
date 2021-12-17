import { Vector4 } from './vector/Vector4'

export default class Quaternion extends Vector4
{
    constructor()
    constructor(x: number, y: number, z: number, w: number)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(x?: number | Float32Array | number[], y?: number, z?: number, w?: number)
    {
        super()
        
        if (x !== undefined)
        {
            if (typeof x === 'number')
            {
                this.Set(x, y!, z!, w!)
            }
            else
            {
                this.Set([ ...x ])
            }
        }
    }
}
