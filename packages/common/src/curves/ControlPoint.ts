import { Vector2, Vector3, Vector4 } from "../vector"

export interface ControlPoint<T extends Vector2 | Vector3 | Vector4>
{
    Position: T
    Rotation: T
}
