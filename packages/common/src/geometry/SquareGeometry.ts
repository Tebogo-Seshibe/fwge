import { Vector2 } from "../vector"
import { Polygon2D } from "./Polygon2D"

export class SquareGeometry extends Polygon2D
{
    constructor()
    {
        super(
        [
            new Vector2(-0.5, 0.5),
            new Vector2(-0.5,-0.5),
            new Vector2( 0.5,-0.5),
            new Vector2( 0.5, 0.5)
        ])
    }
}
