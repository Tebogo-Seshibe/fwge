import Vector3 from '../Maths/Vector3'
import Cloneable from '../Interfaces/Cloneable'

export class ITransform
{
    position?: Float32Array | number[]
    rotation?: Float32Array | number[]
    scale?: Float32Array | number[]
    shear?: Float32Array | number[]
}

export default class Transform implements Cloneable<Transform>
{
    public Position: Vector3
    public Rotation: Vector3
    public Scale: Vector3
    public Shear: Vector3

    constructor()
    constructor(transform: ITransform)
    constructor(transform: Transform)
    constructor(args?: ITransform | Transform)
    {
        let { position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], shear = [0, 0, 0] }: ITransform = new ITransform
        
        if (args instanceof ITransform)
        {
            position = args.position || position
            rotation = args.rotation || rotation
            scale = args.scale || scale
            shear = args.shear || shear
        }
        else if (args instanceof Transform)
        {
            position = args.Position as Float32Array
            rotation = args.Position as Float32Array
            scale = args.Position as Float32Array
            shear = args.Position as Float32Array
        }

        this.Position = new Vector3(position as Float32Array)
        this.Rotation = new Vector3(rotation as Float32Array)
        this.Scale = new Vector3(scale as Float32Array)
        this.Shear = new Vector3(shear as Float32Array)
    }

    public Clone(): Transform
    {
        return new Transform(
        {
            position:   this.Position,
            rotation:   this.Rotation,
            scale:      this.Scale,
            shear:      this.Shear
        })
    }

    public static get UP(): Vector3
    {
        return new Vector3(0, 1, 0)
    }

    public static get DOWN(): Vector3
    {
        return new Vector3(0, -1, 0)
    }

    public static get FORWARD(): Vector3
    {
        return new Vector3(0, 0, 1)
    }

    public static get BACKWARD(): Vector3
    {
        return new Vector3(0, 0, -1)
    }

    public static get RIGHT(): Vector3
    {
        return new Vector3(1, 0, 0)
    }

    public static get LEFT(): Vector3
    {
        return new Vector3(-1, 0, 0)
    }
}
