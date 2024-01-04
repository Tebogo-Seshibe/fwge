import { Matrix4 } from "../matrix";
import { Vector3, Vector3Array, Vector4 } from "../vector";
import { Geometry } from "./Geometry";

export class Geometry3D extends Geometry<Vector3, Matrix4, Vector3Array>
{
    TransformedVertices(transformationMatrix: Matrix4): Vector3[]
    TransformedVertices(transformationMatrix: Matrix4, out: Vector3[]): Vector3[]
    TransformedVertices(transformationMatrix: Matrix4, out?: Vector3[]): Vector3[]
    {
        const buffer = new Float32Array(Float32Array.BYTES_PER_ELEMENT * this.Vertices.length)
        const result = new Vector4()
        
        out = out ?? []

        for (let i = 0; i < this.Vertices.length; ++i)
        {
            const original = this.Vertices[i]
            Matrix4.MultiplyVector(transformationMatrix, original[0], original[1], original[2], 1, result)

            const calculated = new Vector3(buffer.buffer, Float32Array.BYTES_PER_ELEMENT * i)
            calculated.Set(result[0], result[1], result[2])

            out[i] = calculated
        }

        return out
    }
}