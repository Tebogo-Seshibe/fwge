import { GL, Matrix2, Matrix4, Polygon3D, Vector2, Vector3, Vector4 } from "@fwge/common"
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

    public CalculatedVertices(transform: Transform): [Float32Array, Vector3[]]
    {
        const mv: Matrix4 = Matrix4.Identity
        const buffer = new Float32Array(this._calculatedVertices.length)
        const vertices = new Array<Vector3>(this._calculatedBuffer.length)

        transform.Position.Add(this.Position)
        mv.Set(transform.ModelViewMatrix()).Transpose()
        transform.Position.Subtract(this.Position)

        let offset = 0
        this.Vertices.forEach((vert, index) =>
        {
            const vertex = Matrix4.MultiplyVector(mv, new Vector4(vert[0], vert[1], vert[2], 1.0))

            vertices[index][0] = vertex[0] + this.Position[0]
            vertices[index][1] = vertex[1] + this.Position[1]
            vertices[index][2] = vertex[2] + this.Position[2]
            buffer[offset + 0] = vertices[index][0]
            buffer[offset + 1] = vertices[index][1]
            buffer[offset + 2] = vertices[index][2]

            offset += 3
        })

        return [buffer, vertices]
    }

    public override findFurthest(transform: Transform, direction: Vector3): Vector3
    {
        const [, points] = this.CalculatedVertices(transform)
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
            collider.position ?? Vector3.Zero,
            collider.isStatic ?? false,
            collider.isTrigger ?? false,
            collider.material,
            collider.onCollisionEnter,
            collider.onCollision,
            collider.onCollisionExit,
            new Polygon3D(collider.vertices)
        )

        this.Vertices = collider.vertices
        this.IndexCount = collider.outline.length
        this._calculatedVertices = new Array(this.Vertices.length)
        this._calculatedBuffer = new Float32Array(this.Vertices.length * 3)

        this.Vertices.map((x, index) => {
            const offset = index * 3
            this._calculatedVertices[index] = x.Clone()
            this._calculatedBuffer[offset + 0] = x[0]
            this._calculatedBuffer[offset + 1] = x[1]
            this._calculatedBuffer[offset + 2] = x[2]
        })

        const buffer: number[] = []
        for (const vec of this.Vertices)
        {
            buffer.push(vec[0], vec[1], vec[2])
        }

        this.VertexBuffer = GL.createBuffer()!
        GL.bindBuffer(GL.ARRAY_BUFFER, this.VertexBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, 0, GL.DYNAMIC_DRAW)
        
        this.IndexBuffer = GL.createBuffer()!
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.IndexBuffer)
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint8Array(collider.outline), GL.DYNAMIC_DRAW)

    }
}
