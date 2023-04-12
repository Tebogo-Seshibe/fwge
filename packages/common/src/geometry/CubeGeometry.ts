import { Vector3, Vector3Array } from "../vector";
import { Geometry3D } from "./Geometry3D";

export class CubeGeometry extends Geometry3D
{
    constructor()
    constructor(min: Vector3, max: Vector3)
    constructor(min: Vector3Array, max: Vector3Array)
    constructor(min?: Vector3 | Vector3Array, max?: Vector3 | Vector3Array)
    {
        if (min && max)
        {
            super([
                new Vector3(min[0], min[1], min[2]),
                new Vector3(max[0], min[1], min[2]),
                new Vector3(min[0], max[1], min[2]),
                new Vector3(max[0], max[1], min[2]),
                new Vector3(min[0], min[1], max[2]),
                new Vector3(max[0], min[1], max[2]),
                new Vector3(min[0], max[1], max[2]),
                new Vector3(max[0], max[1], max[2])
            ]);
        }
        else
        {
            super([
                new Vector3(-0.5, 0.5, 0.5),
                new Vector3(-0.5,-0.5, 0.5),
                new Vector3( 0.5,-0.5, 0.5),
                new Vector3( 0.5, 0.5, 0.5),
                new Vector3(-0.5, 0.5,-0.5),
                new Vector3(-0.5,-0.5,-0.5),
                new Vector3( 0.5,-0.5,-0.5),
                new Vector3( 0.5, 0.5,-0.5),
            ]);
        }
    }
}
