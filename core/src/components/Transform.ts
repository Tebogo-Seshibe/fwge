import { CalcuateModelView, Matrix3, Matrix4, Vector3 } from '@fwge/common'
import { Entity } from '../ecs'
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
    //#region Private fields
    private _position: Vector3 = Vector3.ZERO
    private _rotation: Vector3 = Vector3.ZERO
    private _scale: Vector3 = Vector3.ONE
    private _shear: Vector3 = Vector3.ZERO

    private _modelViewMatrix: Matrix4 = Matrix4.IDENTITY
    private _normalMatrix: Matrix3 = Matrix3.IDENTITY

    private _recalculateMatrices()
    {
        let parent: Transform | undefined = this.Owner?.Parent?.GetComponent(Transform)
        this._modelViewMatrix.Identity()

        CalcuateModelView(
            this._modelViewMatrix,
            this._position,
            this._rotation,
            this._scale
        )

        while (parent)
        {
            CalcuateModelView(
                this._modelViewMatrix,
                parent._position,
                parent._rotation,
                parent._scale
            )
            parent = parent.Owner?.Parent?.GetComponent(Transform)
        }
        
        this._normalMatrix.Set(
            this._modelViewMatrix[0], this._modelViewMatrix[1], this._modelViewMatrix[2],
            this._modelViewMatrix[4], this._modelViewMatrix[5], this._modelViewMatrix[6],
            this._modelViewMatrix[8], this._modelViewMatrix[9], this._modelViewMatrix[10]
        ).Inverse()
        
        this.Position.Dirty = false
        this.Rotation.Dirty = false
        this.Scale.Dirty = false
    }
    //#endregion

    public get Dirty(): boolean
    {
        return this._position.Dirty || this.Rotation.Dirty || this.Scale.Dirty
    }
    
    get ModelViewMatrix(): Matrix4
    {
        if (this.Dirty)
        {
            this._recalculateMatrices()
        }

        return this._modelViewMatrix
    }

    get NormalMatrix(): Matrix3
    {
        if (this.Dirty)
        {
            this._recalculateMatrices()
        }

        return this._normalMatrix
    }


    get Position(): Vector3
    {
        return this._position
    }

    set Position(position: Vector3)
    {
        this._position.Set(position)
    }

    get Rotation(): Vector3
    {
        return this._rotation
    }

    set Rotation(rotation: Vector3)
    {
        this._rotation.Set(rotation)
    }

    get Scale(): Vector3
    {
        return this._scale
    }

    set Scale(scale: Vector3)
    {
        this._scale.Set(scale)
    }

    get Shear(): Vector3
    {
        return this._shear
    }

    set Shear(shear: Vector3)
    {
        this._shear.Set(shear)
    }

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