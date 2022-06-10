import { CubeGeometry, Matrix4, Vector3, Vector4 } from "@fwge/common"
import { Entity, Transform } from "@fwge/core"
import { Collider } from "./Collider"

interface ICubeCollider
{
    isStatic?: boolean
    isTrigger?: boolean
    position?: Vector3
    material?: any
    
    height?: number
    width?: number
    depth?: number

    onCollisionEnter?: (this: Entity, other: Entity) => void
    onCollision?: (this: Entity, other: Entity) => void
    onCollisionExit?: (this: Entity, other: Entity) => void
}

export class CubeCollider extends Collider
{
    public Height: number = 1
    public Width: number = 1
    public Depth: number = 1

    public Up: Vector3 = new Vector3(0, 1, 0)
    public Right: Vector3 = new Vector3(1, 0, 0)
    public Forward: Vector3 = new Vector3(0, 0, 1)

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
        mv.Transpose()

        return [
            Matrix4.MultiplyVector(mv, new Vector4(this.Up[0], this.Up[1], this.Up[2], 0.0)).XYZ.Normalize(),
            Matrix4.MultiplyVector(mv, new Vector4(this.Right[0], this.Right[1], this.Right[2], 0.0)).XYZ.Normalize(),
            Matrix4.MultiplyVector(mv, new Vector4(this.Forward[0], this.Forward[1], this.Forward[2], 0.0)).XYZ.Normalize(),
        ]
    }

    GetVertices(transform: Transform)
    {
        transform.Position.Add(this.Position)
        transform.Scale.Multiply(this.Width, this.Height, this.Depth)
        const mv = transform.ModelViewMatrix
        mv.Transpose()
        transform.Scale.Multiply(1 / this.Width, 1 / this.Height, 1 / this.Depth)
        transform.Position.Subtract(this.Position)

        return this.Vertices.map(vertex => Matrix4.MultiplyVector(mv, new Vector4(vertex[0], vertex[1], vertex[2], 1.0)).XYZ)
    }

    constructor()
    constructor(collider: ICubeCollider)
    constructor(collider: ICubeCollider = { })
    {
        super(
            collider.position ?? Vector3.Zero,
            collider.isStatic ?? false,
            collider.isTrigger ?? false,
            collider.material,
            collider.onCollisionEnter,
            collider.onCollision,
            collider.onCollisionExit,
            new CubeGeometry()
        )

        this.Height = collider.height ?? 1.0
        this.Width = collider.width ?? 1.0
        this.Depth = collider.depth ?? 1.0
    }
}
