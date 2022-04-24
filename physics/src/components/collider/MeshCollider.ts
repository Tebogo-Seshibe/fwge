import { GL, Matrix2, Matrix4, Vector2, Vector3, Vector4 } from "@fwge/common"
import { Entity, Transform } from "@fwge/core"
import { Collider } from "./Collider"

interface ISphereCollider
{
    vertices: Vector3[]
    outline: number[]
    material?: any
    isStatic?: boolean
    isTrigger?: boolean
    position?: Vector3
    onCollisionEnter?: (this: Entity, other: Entity) => void
    onCollision?: (this: Entity, other: Entity) => void
    onCollisionExit?: (this: Entity, other: Entity) => void
}

export class MeshCollider extends Collider
{
    public readonly Vertices: Vector3[]
    public readonly VertexBuffer: WebGLBuffer
    public readonly IndexBuffer: WebGLBuffer
    public readonly IndexCount: number

    private _calculatedVertices: Vector3[] = []
    private _calculatedBuffer: Float32Array = new Float32Array()

    private _recalculateVertices()
    {
        let mv: Matrix4 = Matrix4.IDENTITY
        if (this.Owner?.HasComponent(Transform))
        {
            const transform = this.Owner!.GetComponent(Transform)!
            transform.Position.Sum(this.Position)
            mv.Set(transform.ModelViewMatrix).Transpose()
            transform.Position.Diff(this.Position)
        }

        let arr: number[] = []
        this._calculatedVertices = this.Vertices.map(vert =>
        {
            const vec = Matrix4.MultVector(mv, new Vector4(vert[0], vert[1], vert[2], 1.0))
            const vertex = new Vector3(vec[0], vec[1], vec[2]).Sum(this.Position)

            arr.push(vertex[0], vertex[1], vertex[2])
            return vertex
        })
        this._calculatedBuffer = new Float32Array(arr)
    }

    public get CalculatedVertices(): Vector3[]
    {
        if (this.Owner?.GetComponent(Transform)?.Dirty || this.Position.Dirty)
        {
            this._recalculateVertices()
        }

        return this._calculatedVertices
    }

    public get CalculatedBuffer(): Float32Array
    {
        if (this.Owner?.GetComponent(Transform)?.Dirty || this.Position.Dirty)
        {
            this._recalculateVertices()
        }

        return this._calculatedBuffer
    }

    public override findFurthest(direction: Vector3): Vector3
    {
        const points = this.CalculatedVertices
        let maxPoint!: Vector3
        let maxDot: number = Number.NEGATIVE_INFINITY

        for (const currPoint of points)
        {
            const currDot: number = currPoint.Dot(direction)

            if (currDot > maxDot)
            {
                maxPoint = currPoint
                maxDot = currDot
            }
        }

        return maxPoint
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
        this.IndexCount = collider.outline.length
        this._recalculateVertices()

        const buffer: number[] = []
        for (const vec of this.Vertices)
        {
            buffer.push(vec[0], vec[1], vec[2])
        }

        this.VertexBuffer = GL.createBuffer()!
        GL.bindBuffer(GL.ARRAY_BUFFER, this.VertexBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, this.CalculatedBuffer, GL.DYNAMIC_DRAW)
        
        this.IndexBuffer = GL.createBuffer()!
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.IndexBuffer)
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint8Array(collider.outline), GL.DYNAMIC_DRAW)

    }
}
