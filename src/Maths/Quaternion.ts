import List from '../Utility/List';
import Vector4 from './Vector4';

export default class Quaternion extends Vector4
{
    constructor(x?: Quaternion | Vector4 | Float32Array | List<number> | Array<number> | number, y?: number, z?: number, w?: number)
    {
        super()

        Vector4.Set(this, x, y, z, w)
    }
}
