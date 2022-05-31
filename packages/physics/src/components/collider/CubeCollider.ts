import { Matrix4, Vector3, Vector4 } from "@fwge/common"
import { Entity, Transform } from "@fwge/core"
import { Collider } from "./Collider"

interface ICubeCollider
{
    isStatic?: boolean
    isTrigger?: boolean
    position?: Vector3
    material?: any
    onCollisionEnter?: (this: Entity, other: Entity) => void
    onCollision?: (this: Entity, other: Entity) => void
    onCollisionExit?: (this: Entity, other: Entity) => void
}

export class CubeCollider extends Collider
{
    public Height: number = 1
    public Width: number = 1
    public Depth: number = 1

    public Up: Vector3 = new Vector3(0,1,0)
    public Right: Vector3 = new Vector3(1,0,0)
    public Forward: Vector3 = new Vector3(0,0,1)

    public readonly Vertices: Vector3[] = [
        new Vector3(-0.5, 0.5, 0.5),
        new Vector3(-0.5,-0.5, 0.5),
        new Vector3( 0.5,-0.5, 0.5),
        new Vector3( 0.5, 0.5, 0.5),
        new Vector3(-0.5, 0.5,-0.5),
        new Vector3(-0.5,-0.5,-0.5),
        new Vector3( 0.5,-0.5,-0.5),
        new Vector3( 0.5, 0.5,-0.5)
    ]

    GetDimentions(transform: Transform)
    {
        const mv = transform.ModelViewMatrix

        return [
            Matrix4.MultVector(mv, new Vector4(this.Up, 0.0)).XYZ.Normalize(),
            Matrix4.MultVector(mv, new Vector4(this.Right, 0.0)).XYZ.Normalize(),
            Matrix4.MultVector(mv, new Vector4(this.Forward, 0.0)).XYZ.Normalize(),
        ]
    }

    GetVertices(transform: Transform)
    {
        const mv = transform.ModelViewMatrix
        return this.Vertices.map(vertex => Matrix4.MultVector(mv, new Vector4(vertex, 1.0)).XYZ)
    }

    constructor()
    constructor(collider: ICubeCollider)
    constructor(collider: ICubeCollider = { })
    {
        super(
            collider.position ?? Vector3.ZERO,
            collider.isStatic ?? false,
            collider.isTrigger ?? false,
            collider.material,
            collider.onCollisionEnter,
            collider.onCollision,
            collider.onCollisionExit
        )
    }
}
