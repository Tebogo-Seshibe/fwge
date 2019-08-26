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
    public Position: Vector3
    public Rotation: Vector3
    public Scale: Vector3
    public Shear: Vector3
    //#endregion

    //#region Public Methods
    constructor()
    constructor(transform: ITransform)
    constructor({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], shear = [0, 0, 0] }: ITransform = new ITransform)
    {
        this.Position = new Vector3(position as number[])
        this.Rotation = new Vector3(rotation as number[])
        this.Scale = new Vector3(scale as number[])
        this.Shear = new Vector3(shear as number[])
    }
    //#endregion

    //#region Static Properties
    static get UP(): Vector3
    {
        return new Vector3(0, 1, 0)
    }

    static get DOWN(): Vector3
    {
        return new Vector3(0, -1, 0)
    }

    static get FORWARD(): Vector3
    {
        return new Vector3(0, 0, 1)
    }

    static get BACKWARD(): Vector3
    {
        return new Vector3(0, 0, -1)
    }

    static get RIGHT(): Vector3
    {
        return new Vector3(1, 0, 0)
    }

    static get LEFT(): Vector3
    {
        return new Vector3(-1, 0, 0)
    }
    //#endregion
}