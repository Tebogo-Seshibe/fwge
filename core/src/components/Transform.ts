import { Vector3 } from '@fwge/common'
import { UniqueComponent } from '../ecs/Component'

interface ITransform
{
    position?: Vector3 | [number, number, number]
    rotation?: Vector3 | [number, number, number]
    scale?: Vector3 | [number, number, number]
    shear?: Vector3 | [number, number, number]
}

export class Transform extends UniqueComponent
{    
    Position!: Vector3
    Rotation!: Vector3
    Scale!: Vector3
    Shear!: Vector3

    constructor()
    constructor(transform: ITransform)
    constructor(args: ITransform = { })
    {
        super()
        
        this.Position = args.position ? new Vector3(args.position[0], args.position[1], args.position[2]) : Vector3.ZERO
        this.Rotation = args.rotation ? new Vector3(args.rotation[0], args.rotation[1], args.rotation[2]) : Vector3.ZERO
        this.Scale = args.scale ? new Vector3(args.scale[0], args.scale[1], args.scale[2]) : Vector3.ONE
        this.Shear = args.shear ? new Vector3(args.shear[0], args.shear[1], args.shear[2]) : Vector3.ZERO
    }    

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
}
