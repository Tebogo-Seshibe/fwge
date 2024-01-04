import { Vector2 } from "../vector";
import { Geometry2D } from "./Geometry2D";

export class SquareGeometry extends Geometry2D
{
    constructor()
    {
        super(
        [
            [-0.5, 0.5],
            [-0.5,-0.5],
            [ 0.5,-0.5],
            [ 0.5, 0.5]
        ])
    }
}
