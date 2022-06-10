import { Matrix3 } from "../matrix"
import { Vector2 } from "../vector"
import { Polygon } from "./Polygon"

export class Polygon2D extends Polygon<Vector2>
{
    TransformedVertices(transformationMatrix: Matrix3): Vector2[]
    {
        return this.Vertices.map(vertex =>
            Matrix3.MultiplyVector(
                transformationMatrix,
                vertex[0], vertex[1], 1
            ).XY
        )
    }
}
