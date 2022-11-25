import { Vector3 } from "../vector";
import { Geometry3D } from "./Geometry3D";

export class CubeGeometry extends Geometry3D
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
