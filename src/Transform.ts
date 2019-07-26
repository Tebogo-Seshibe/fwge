import Vector3 from './Maths/Vector3'

export class ITransform
{
    position?: Vector3 | Float32Array | number[]
    rotation?: Vector3 | Float32Array | number[]
    scale?: Vector3 | Float32Array | number[]
    shear?: Vector3 | Float32Array | number[]
}

export default class Transform
{
    public Position: Vector3
    public Rotation: Vector3
    public Scale: Vector3
    public Shear: Vector3

    constructor({ position = Vector3.ZERO, rotation = Vector3.ZERO, scale = Vector3.ONE, shear = Vector3.ZERO }: ITransform = new ITransform)
    {
        this.Position = new Vector3(position)
        this.Rotation = new Vector3(rotation)
        this.Scale = new Vector3(scale)
        this.Shear = new Vector3(shear)
    }

    static get UP(): Vector3
    {
        return new Vector3(0, 1, 0)
    }

    static get FORWARD(): Vector3
    {
        return new Vector3(0, 0, 1)
    }

    static get RIGHT(): Vector3
    {
        return new Vector3(1, 0, 0)
    }
}