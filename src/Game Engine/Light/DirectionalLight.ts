import { Vector3 }      from "../Maths/Vector3";
import { LightItem, ILightItem } from "./LightItem";

export interface IDirectionalLight extends ILightItem
{
    Direction: Vector3;
}

export class DirectionalLight extends LightItem
{
    public Direction: Vector3;

    constructor({Direction = Vector3.One, Paint, Intensity, Name, Parent}: IDirectionalLight)
    {
        super({Name, Parent, Paint, Intensity});
        this.Direction = Direction;
    }
}
