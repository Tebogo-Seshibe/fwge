import { Vector3 } from '../atoms/vector/Vector3'
import { Component } from '../ecs/Component'
import { Matrix4 } from '../atoms/matrix/Matrix4'
import { CalcuateModelView } from '../utils/Model'

interface ITransform
{
    position?: Vector3 | Float32Array | [number, number, number]
    rotation?: Vector3 | Float32Array | [number, number, number]
    scale?: Vector3 | Float32Array | [number, number, number]
    shear?: Vector3 | Float32Array | [number, number, number]
}

export class Transform extends Component
{    
    private _position: Vector3 = Vector3.ZERO
    private _rotation: Vector3 = Vector3.ZERO
    private _scale: Vector3 = Vector3.ONE
    private _shear: Vector3 = Vector3.ZERO

    public static readonly UP = new Vector3(0, 1, 0)
    public static readonly DOWN = new Vector3(0, -1, 0)
    public static readonly FORWARD = new Vector3(0, 0, 1)
    public static readonly BACKWARD = new Vector3(0, 0, -1)
    public static readonly RIGHT = new Vector3(1, 0, 0)
    public static readonly LEFT = new Vector3(-1, 0, 0)

    public get Position(): Vector3
    {
        return this._position
    }

    public set Position(position: Vector3 | Float32Array | [number, number, number])
    {
        this._position = new Vector3(position as Float32Array)
    }

    public get Rotation(): Vector3
    {
        return this._rotation
    }

    public set Rotation(rotation: Vector3 | Float32Array | [number, number, number])
    {
        this._rotation = new Vector3(rotation as Float32Array)
    }

    public get Scale(): Vector3
    {
        return this._scale
    }

    public set Scale(scale: Vector3 | Float32Array | [number, number, number])
    {
        this._scale = new Vector3(scale as Float32Array)
    }

    public get Shear(): Vector3
    {
        return this._shear
    }

    public set Shear(shear: Vector3 | Float32Array | [number, number, number])
    {
        this._shear = new Vector3(shear as Float32Array)
    }

    public get Matrix(): Matrix4
    {
        return CalcuateModelView(this)
    }

    constructor(transform: ITransform = { })
    {
        super(Transform)

        const {
            position = [0, 0, 0],
            rotation = [0, 0, 0],
            scale = [1, 1, 1],
            shear = [0, 0, 0]
        }: ITransform = transform
        
        this.Position = position
        this.Rotation = rotation
        this.Scale = scale
        this.Shear = shear
    }
}
