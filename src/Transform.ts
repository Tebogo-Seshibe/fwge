import Vector3 from './Maths/Vector3'

export class ITransform
{
    position?: Vector3
    rotation?: Vector3
    scale?: Vector3
    shear?: Vector3
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
    constructor({ position = Vector3.ZERO, rotation = Vector3.ZERO, scale = Vector3.ONE, shear = Vector3.ZERO }: ITransform = new ITransform)
    {
        this.Position = position
        this.Rotation = rotation
        this.Scale = scale
        this.Shear = shear
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