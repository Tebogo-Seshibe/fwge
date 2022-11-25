import { Vector2 } from "../vector";
import { Geometry2D } from "./Geometry2D";

export class SquareGeometry extends Geometry2D
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
