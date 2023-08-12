import { Matrix3, Matrix4 } from "../matrix";
import { Vector2, Vector3 } from "../vector";

export abstract class Geometry<T extends Vector2 | Vector3, U extends Matrix3 | Matrix4>
{
    public readonly Vertices: T[]
    public readonly BufferData: Float32Array

    constructor(vertices: T[])
    {
        this.Vertices = []
        this.BufferData = new Float32Array(vertices.length * vertices[0].length)
        for (let i = 0; i < vertices.length; ++i)
        {
            const old = vertices[i]
            const offset = Float32Array.BYTES_PER_ELEMENT * i
            let vertex: Vector2 | Vector3

            if (old instanceof Vector2)
            {
                vertex = new Vector2(this.BufferData.buffer, offset)
                vertex.Set(old)
            }
            else
            {
                vertex = new Vector3(this.BufferData.buffer, offset)
                vertex.Set(old)
            }

            this.Vertices.push(vertex as T);
        }
    }

    abstract TransformedVertices(transformationMatrix: U): T[];
    abstract TransformedVertices(transformationMatrix: U, out?: T[]): T[];
}