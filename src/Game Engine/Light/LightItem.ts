import { GameItem }     from "../GameItem";
import { GameObject }   from "../GameObject";
import { Colour }       from "../../Render Engine/Colour";

export interface ILightItem
{
    Name:       string;
    Parent:     GameObject;
    Paint:      number[];
    Intensity:  number;
}

export class LightItem extends GameItem
{
    public Colour: Colour;
    public Intensity: number;

    constructor({Name = "Light Item", Parent = new GameObject(), Paint = [1, 1, 1, 1], Intensity = 1.0}: ILightItem)
    {
        super(Name, Parent);

        this.Colour = new Colour(Paint);
        this.Intensity = Intensity;
    }
}
