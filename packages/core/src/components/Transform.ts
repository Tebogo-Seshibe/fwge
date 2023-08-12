import { Matrix4, MinLengthArray, Vector3, Vector3Array } from '@fwge/common';
import { UniqueComponent } from '../ecs/Component';

export type ITransform = 
{
    position?: Vector3 | MinLengthArray<number, 3>
    rotation?: Vector3 | MinLengthArray<number, 3>
    scale?: Vector3 | MinLengthArray<number, 3>
}

export class Transform extends UniqueComponent
{
    private readonly _buffer: Float32Array
    public readonly Position: Vector3
    public readonly Rotation: Vector3
    public readonly Scale: Vector3

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
        
        this._buffer = new Float32Array(9);
        this.Position = new Vector3(this._buffer.buffer, 0 * Float32Array.BYTES_PER_ELEMENT);
        this.Rotation = new Vector3(this._buffer.buffer, 3 * Float32Array.BYTES_PER_ELEMENT);
        this.Scale = new Vector3(this._buffer.buffer, 6 * Float32Array.BYTES_PER_ELEMENT);

        if (args.position)
        {
            this.Position.Set(args.position as Vector3Array);
        }
        else
        {
            this.Position.Set(0, 0, 0);
        }

        if (args.rotation)
        {
            this.Rotation.Set(args.rotation as Vector3Array);
        }
        else
        {
            this.Rotation.Set(0, 0, 0);
        }

        if (args.scale)
        {
            this.Scale.Set(args.scale as Vector3Array);
        }
        else
        {
            this.Scale.Set(1, 1, 1);
        }
    }
}
