import { Matrix4 } from "../matrix"
import { Vector3 } from "../vector"
import { Polygon } from "./Polygon"

export class Polygon3D extends Polygon<Vector3>
{
    TransformedVertices(transformationMatrix: Matrix4): Vector3[]
    {
        return this.Vertices.map(vertex =>
            Matrix4.MultiplyVector(
                transformationMatrix,
                vertex[0], vertex[1], vertex[2], 1
            ).XYZ
        )
    }
}
