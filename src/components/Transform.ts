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
    #position!: Vector3
    #rotation!: Vector3
    #scale!: Vector3
    #shear!: Vector3

    get Position(): Vector3
    {
        return this.#position
    }

    set Position(position: Vector3 | [number, number, number])
    {
        this.#position = new Vector3([...position])
    }

    get Rotation(): Vector3
    {
        return this.#rotation
    }

    set Rotation(rotation: Vector3 | [number, number, number])
    {
        this.#rotation = new Vector3([...rotation])
    }

    get Scale(): Vector3
    {
        return this.#scale
    }

    set Scale(scale: Vector3 | [number, number, number])
    {
        this.#scale = new Vector3([...scale])
    }

    get Shear(): Vector3
    {
        return this.#shear
    }

    set Shear(shear: Vector3 | [number, number, number])
    {
        this.#shear = new Vector3([...shear])
    }

    constructor()
    constructor(transform: ITransform)
    constructor(args: ITransform = { })
    {
        super()
        
        this.Position = args.position ?? Vector3.ZERO
        this.Rotation = args.rotation ?? Vector3.ZERO
        this.Scale = args.scale ?? Vector3.ONE
        this.Shear = args.shear ?? Vector3.ZERO
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
