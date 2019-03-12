import Vector3 from './Maths/Vector3'

class ITransform
{
    position?: Vector3 | Float32Array | number[] = Vector3.ZERO
    rotation?: Vector3 | Float32Array | number[] = Vector3.ZERO
    scale?: Vector3 | Float32Array | number[] = Vector3.ONE
    shear?: Vector3 | Float32Array | number[] = Vector3.ZERO
}

export default class Transform
{
    Position: Vector3
    Rotation: Vector3
    Scale: Vector3
    Shear: Vector3

    constructor({position, rotation, scale, shear}: ITransform = new ITransform)
    {
        this.Position = new Vector3(position)
        this.Rotation = new Vector3(rotation)
        this.Scale = new Vector3(scale)
        this.Shear = new Vector3(shear)
    }


    get UP(): Vector3
    {
        return new Vector3(0, 1, 0)
    }

    get FORWARD(): Vector3
    {
        return new Vector3(0, 0, 1)
    }

    get RIGHT(): Vector3
    {
        return new Vector3(1, 0, 0)
    }
}