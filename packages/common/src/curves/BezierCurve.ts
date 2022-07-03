import { Vector2, Vector3, Vector4 } from "../vector"
import { ControlPoint } from "./ControlPoint"

export class BezierCurve<T extends Vector2 | Vector3 | Vector4>
{
    public get StartPoint(): ControlPoint<T>
    {
        return this._controlPoints[0]
    }

    public get ControlPoint1(): ControlPoint<T>
    {
        return this._controlPoints[1]
    }
    
    public get ControlPoint2(): ControlPoint<T>
    {
        return this._controlPoints[2]
    }

    public get EndPoint(): ControlPoint<T>
    {
        return this._controlPoints[3]
    }

    constructor(
        private _controlPoints: [ControlPoint<T>, ControlPoint<T>, ControlPoint<T>, ControlPoint<T>]
    ) { }
}
