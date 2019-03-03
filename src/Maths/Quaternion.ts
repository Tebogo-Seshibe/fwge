import Vector4 from "./Vector4";

export default class Quaternion extends Vector4
{
    constructor(w?: Quaternion | Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number)
    {
        super(w, x, y, z)
    }
}
