import { Vector3 } from '../atoms/vector/Vector3'
import { Component } from '../ecs/Component'

interface ITransform
{
    position?: Vector3 | [number, number, number]
    rotation?: Vector3 | [number, number, number]
    scale?: Vector3 | [number, number, number]
    shear?: Vector3 | [number, number, number]
}

export class Transform extends Component
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
        
        this.Position = args.position ? new Vector3(args.position! as number[]) : Vector3.ZERO
        this.Rotation = args.rotation ? new Vector3(args.rotation! as number[]) : Vector3.ZERO
        this.Scale = args.scale ? new Vector3(args.scale! as number[]) : Vector3.ONE
        this.Shear = args.shear ? new Vector3(args.shear! as number[]) : Vector3.ZERO
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
