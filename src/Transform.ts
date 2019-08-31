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
    //#region Public Properties
    public Position: Vector3 = Vector3.ZERO
    public Rotation: Vector3 = Vector3.ZERO
    public Scale: Vector3 = Vector3.ONE
    public Shear: Vector3 = Vector3.ZERO
    //#endregion

    //#region Public Methods
    constructor()
    constructor(transform: ITransform)
    constructor({ position, rotation, scale, shear }: ITransform = new ITransform)
    {
        if (position) 
        {
            this.Position = new Vector3(position as number[])
        }

        if (rotation) 
        {
            this.Rotation = new Vector3(rotation as number[])
        }

        if (scale) 
        {
            this.Scale = new Vector3(scale as number[])
        }

        if (shear) 
        {
            this.Shear = new Vector3(shear as number[])
        }
    }
    //#endregion

    //#region Static Properties
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
    //#endregion
}