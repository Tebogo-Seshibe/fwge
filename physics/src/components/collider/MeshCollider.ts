import { Matrix2, Matrix4, Vector3, Vector4 } from "@fwge/common"
import { Entity, Transform } from "@fwge/core"
import { Collider } from "./Collider"

interface ISphereCollider
{
    material?: any
    isStatic?: boolean
    isTrigger?: boolean
    vertices: Vector3[]
    position?: Vector3
    onCollisionEnter?: (this: Entity, other: Entity) => void
    onCollision?: (this: Entity, other: Entity) => void
    onCollisionExit?: (this: Entity, other: Entity) => void
}

export class MeshCollider extends Collider
{
    public readonly Vertices: Vector3[]
    public get CalculatedVertices(): Vector3[]
    {
        const mv = this.Owner!.GetComponent(Transform)!.ModelViewMatrix
        return this.Vertices.map(vert =>
        {
            return new Vector3(Matrix4.MultVector(mv, new Vector4(vert[0], vert[1], vert[2], 1.0)))
        })
    }

    constructor(collider: ISphereCollider)
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

        this.Vertices = collider.vertices
    }
}
