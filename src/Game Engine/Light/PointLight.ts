import { LightItem, ILightItem } from "./LightItem";
import { Vector3 }      from "../Maths/Vector3";

export interface IPointLight extends ILightItem
{ 
    Radius:    number; 
    Angle:     number; 
    Shininess: number;
}

export class PointLight extends LightItem
{
    public Radius: number;
    public Angle: number;
    public Shininess: number;

    constructor({Name, Parent, Paint, Intensity, Radius = 5, Angle = 180, Shininess = 255}: IPointLight)
    {
        super({Name, Parent, Paint, Intensity});
        
        this.Radius = Radius;
        this.Angle = Angle;
        this.Shininess = Shininess;
    }    
}
