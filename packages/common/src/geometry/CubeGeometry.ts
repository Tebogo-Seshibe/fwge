import { Vector3 } from "../vector"
import { Polygon3D } from "./Polygon3D"

export class CubeGeometry extends Polygon3D
{
    constructor()
    {
        super(
        [
            new Vector3(-0.5, 0.5, 0.5),
            new Vector3(-0.5,-0.5, 0.5),
            new Vector3( 0.5,-0.5, 0.5),
            new Vector3( 0.5, 0.5, 0.5),
            new Vector3(-0.5, 0.5,-0.5),
            new Vector3(-0.5,-0.5,-0.5),
            new Vector3( 0.5,-0.5,-0.5),
            new Vector3( 0.5, 0.5,-0.5),
        ])
    }
}
