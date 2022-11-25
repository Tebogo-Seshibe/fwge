import { Matrix3 } from "../matrix";
import { Vector2, Vector3 } from "../vector";
import { Geometry } from "./Geometry";

export class Geometry2D extends Geometry<Vector2, Matrix3>
{    
    TransformedVertices(transformationMatrix: Matrix3): Vector2[]
    TransformedVertices(transformationMatrix: Matrix3, out: Vector2[]): Vector2[]
    TransformedVertices(transformationMatrix: Matrix3, out?: Vector2[]): Vector2[]
    {
        const buffer = new Float32Array(Float32Array.BYTES_PER_ELEMENT * this.Vertices.length)
        const result = new Vector3()
        
        out = out ?? []

        for (let i = 0; i < this.Vertices.length; ++i)
        {
            const original = this.Vertices[i]
            Matrix3.MultiplyVector(transformationMatrix, original[0], original[1], 1, result)

            const calculated = new Vector2(buffer.buffer, Float32Array.BYTES_PER_ELEMENT * i)
            calculated.Set(result[0], result[1])

            out[i] = calculated
        }

        return out
    }
}