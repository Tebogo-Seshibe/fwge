import { CalcuateModelView, Matrix3, Matrix4, Rotate, Vector3 } from '@fwge/common'
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
    public Position: Vector3
    public Rotation: Vector3
    public Scale: Vector3

    get ModelViewMatrix(): Matrix4
    {
        const modelviewMatrix = Matrix4.Identity
        let transform: Transform | undefined = this

        while (transform)
        {
            modelviewMatrix.Multiply(
                Matrix4.TransformationMatrix(
                    transform.Position,
                    transform.Rotation,
                    transform.Scale
                )
            )
            transform = transform.Owner?.Parent?.GetComponent(Transform)
        }

        return modelviewMatrix
    }

    constructor()
    constructor(transform: ITransform)
    constructor(args: ITransform = { })
    {
        super()

        if (args.position instanceof Array)
        {
            this.Position = new Vector3(args.position[0], args.position[1], args.position[2])
        }
        else if (!args.position)
        {
            this.Position = new Vector3(0, 0, 0)
        }
        else
        {
            this.Position = args.position
        }

        if (args.rotation instanceof Array)
        {
            this.Rotation = new Vector3(args.rotation[0], args.rotation[1], args.rotation[2])
        }
        else if (!args.rotation)
        {
            this.Rotation = new Vector3(0, 0, 0)
        }
        else
        {
            this.Rotation = args.rotation
        }

        if (args.scale instanceof Array)
        {
            this.Scale = new Vector3(args.scale[0], args.scale[1], args.scale[2])
        }
        else if (!args.scale)
        {
            this.Scale = new Vector3(1, 1, 1)
        }
        else
        {
            this.Scale = args.scale
        }
    }
}