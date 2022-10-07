import { Matrix3, Matrix4, Vector3, Vector3Array } from '@fwge/common'
import { UniqueComponent } from '../ecs/Component'

export interface ITransform
{
    position?: Vector3 | [number, number, number]
    rotation?: Vector3 | [number, number, number]
    scale?: Vector3 | [number, number, number]
}

export class Transform extends UniqueComponent
{
    private readonly _buffer: Float32Array
    public readonly Position: Vector3
    public readonly Rotation: Vector3
    public readonly Scale: Vector3
    
    SetPosition(xyz: number): void
    SetPosition(x: number, y: number, z: number): void
    SetPosition(array: [number, number, number]): void
    SetPosition(vector: Vector3): void
    SetPosition(_0: Vector3 | [number, number, number] | number, _1?: number, _2?: number): void
    {
        if (_1 === undefined || _2 === undefined)
        {
            this.Position.Set(_0 as [number, number, number])
        }
        else
        {
            this.Position.Set(_0 as number, _1, _2)
        }
    }

    SetRotation(xyz: number): void
    SetRotation(x: number, y: number, z: number): void
    SetRotation(array: [number, number, number]): void
    SetRotation(vector: Vector3): void
    SetRotation(_0: Vector3 | [number, number, number] | number, _1?: number, _2?: number): void
    {
        if (_1 === undefined || _2 === undefined)
        {
            this.Position.Set(_0 as [number, number, number])
        }
        else
        {            
            this.Position.Set(_0 as number, _1, _2)
        }
    }

    SetScale(axis: number): void
    SetScale(axisX: number, axisY: number, axisZ: number): void
    SetScale(axis: [number, number, number]): void
    SetScale(axis: Vector3): void
    SetScale(_0: Vector3 | [number, number, number] | number, _1?: number, _2?: number): void
    {
        if (_1 === undefined || _2 === undefined)
        {
            this.Scale.Set(_0 as [number, number, number])
        }
        else
        {            
            this.Scale.Set(_0 as number, _1, _2)
        }
    }

    RotateAround(target: Transform, axis: Vector3 | Vector3Array, angle: number): void
    {
        Matrix3.MultiplyVector(
            Matrix3.RotationMatrixAroundAxis(
                Vector3.Add(target.Position, Vector3.Normalize(axis as Vector3Array)),
                angle
            ),
            this.Position,
        this.Position)
    }

    RotateAroundAxis(xyz: number, angle: number): void
    RotateAroundAxis(x: number, y: number, z: number, angle: number): void
    RotateAroundAxis(array: [number, number, number], angle: number): void
    RotateAroundAxis(vector: Vector3, angle: number): void
    RotateAroundAxis(_0: Transform | Vector3 | [number, number, number] | number, _1?: number, _2?: number, _3?: number): void
    {
        let mat: Matrix3
        if (typeof _0 === 'number')
        {
            if (_2 === undefined || _3 === undefined)
            {
                mat = Matrix3.RotationMatrixAroundAxis(_0, _1 as number)
            }
            else
            {
                mat = Matrix3.RotationMatrixAroundAxis(_0, _1 as number, _2 as number, _3 as number)
            }
        }
        else 
        {
            mat = Matrix3.RotationMatrixAroundAxis(_0 as [number, number, number], _1 as number)
        }
        Matrix3.MultiplyVector(mat, this.Position, this.Position)
    }

    GlobalPosition(): Vector3
    GlobalPosition(position: Vector3): Vector3
    GlobalPosition(position: Vector3 = Vector3.Zero): Vector3
    {
        let transform: Transform | undefined = this

        while (transform)
        {
            position.Add(transform.Position)
            transform = transform.Owner?.Parent?.GetComponent(Transform)
        }

        return position
    }

    GlobalRotation(): Vector3
    GlobalRotation(rotation: Vector3): Vector3
    GlobalRotation(rotation: Vector3 = Vector3.Zero): Vector3
    {
        let transform: Transform | undefined = this

        while (transform)
        {
            rotation.Add(transform.Rotation)
            transform = transform.Owner?.Parent?.GetComponent(Transform)
        }

        return rotation
    }

    GlobalScale(): Vector3
    GlobalScale(scale: Vector3): Vector3
    GlobalScale(scale: Vector3 = Vector3.Zero): Vector3
    {
        let transform: Transform | undefined = this

        while (transform)
        {
            scale.Add(transform.Scale)
            transform = transform.Owner?.Parent?.GetComponent(Transform)
        }

        return scale
    }
    
    LocalModelViewMatrix(): Matrix4
    LocalModelViewMatrix(out: Matrix4): Matrix4
    LocalModelViewMatrix(_0: Matrix4 = Matrix4.Identity): Matrix4
    {
        return Matrix4.TransformationMatrix(
            this.Position,
            this.Rotation,
            this.Scale,
            _0
        )
    }

    ModelViewMatrix(): Matrix4
    ModelViewMatrix(out: Matrix4): Matrix4
    ModelViewMatrix(_0: Matrix4 = Matrix4.Identity): Matrix4
    {
        this.LocalModelViewMatrix(_0)
        let transform: Transform | undefined = this.Owner?.Parent?.GetComponent(Transform)

        while (transform)
        {
            Matrix4.Multiply(
                Matrix4.TransformationMatrix(
                    transform.Position,
                    transform.Rotation,
                    transform.Scale
                ),
                _0,
                _0
            )
            transform = transform.Owner?.Parent?.GetComponent(Transform)
        }

        return _0
    }

    constructor()
    constructor(transform: ITransform)
    constructor(args: ITransform = { })
    {
        super()
        
        this._buffer = new Float32Array(9)
        this.Position = new Vector3(this._buffer.buffer, 0 * Float32Array.BYTES_PER_ELEMENT)
        this.Rotation = new Vector3(this._buffer.buffer, 3 * Float32Array.BYTES_PER_ELEMENT)
        this.Scale = new Vector3(this._buffer.buffer, 6 * Float32Array.BYTES_PER_ELEMENT)

        if (args.position)
        {
            this.Position.Set(args.position as Vector3Array)
        }
        else
        {
            this.Position.Set(0, 0, 0)
        }

        if (args.rotation)
        {
            this.Rotation.Set(args.rotation as Vector3Array)
        }
        else
        {
            this.Rotation.Set(0, 0, 0)
        }

        if (args.scale)
        {
            this.Scale.Set(args.scale as Vector3Array)
        }
        else
        {
            this.Scale.Set(1, 1, 1)
        }
    }
}
