import List from '../Utility/List'
import Vector4 from './Vector4'

export default class Quaternion extends Vector4
{
    constructor(w?: Quaternion | Vector4 | Float32Array | List<number> | Array<number> | number, x?: number, y?: number, z?: number)
    {
        super()

        Vector4.Set(this, w, x, y, z)
    }
}
