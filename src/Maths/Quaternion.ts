import List from '../Utility/List';
import Vector4 from './Vector4';

export class Quaternion extends Vector4
{
    constructor()
    constructor(x: number, y: number, z: number, w: number)
    constructor(array: Float32Array)
    constructor(array: number[])
    constructor(list: List<number>)
    constructor(x?: number | Float32Array | number[] | List<number>, y?: number, z?: number, w?: number)
    {
        super()
        
        if (x !== undefined)
        {
            if (typeof x === 'number')
            {
                this.Set(x, y, z, w)
            }
            else
            {
                this.Set([ ...x ])
            }
        }
    }
}
