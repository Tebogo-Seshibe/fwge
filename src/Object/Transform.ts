import Vector3 from '../Maths/Vector3'
import Cloneable from '../Interfaces/Cloneable'

export interface ITransform
{
    position?: Float64Array | Float32Array | number[]
    rotation?: Float64Array | Float32Array | number[]
    scale?: Float64Array | Float32Array | number[]
    shear?: Float64Array | Float32Array | number[]
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
        let { position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], shear = [0, 0, 0] }: ITransform = { }
        
        if (args instanceof Transform)
        {
            position = args.Position as Float32Array
            rotation = args.Rotation as Float32Array
            scale = args.Scale as Float32Array
            shear = args.Shear as Float32Array
        }
        else if (args !== undefined)
        {
            position = args.position || position
            rotation = args.rotation || rotation
            scale = args.scale || scale
            shear = args.shear || shear
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

    public readonly UP = new Vector3(0, 1, 0)
    public readonly DOWN = new Vector3(0, -1, 0)
    public readonly FORWARD = new Vector3(0, 0, 1)
    public readonly BACKWARD = new Vector3(0, 0, -1)
    public readonly RIGHT = new Vector3(1, 0, 0)
    public readonly LEFT = new Vector3(-1, 0, 0)
}
