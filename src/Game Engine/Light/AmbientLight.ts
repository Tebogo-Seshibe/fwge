import { LightItem, ILightItem } from "./LightItem";
import { GameObject } from '../GameObject';

export interface IAmbientLight extends ILightItem { }

export class AmbientLight extends LightItem
{
    constructor({Name = "Ambient Light", Parent, Paint, Intensity}: IAmbientLight)
    {
        super({Name, Parent, Paint, Intensity});
    }
}
