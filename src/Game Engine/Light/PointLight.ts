import { LightItem }    from "./LightItem";
import { Vector3 }      from "../Maths/Vector3";

export interface IPointLight extends ILightItem
{ 
    Radius?:    number; 
    Angle?:     number; 
    Shininess?: number;
}

/**
 * @name        {PointLight}
 * @module      {FWGE.Game.Light}
 * @description Defines a light Object that emits from a given point within a radius.
 */
export class PointLight extends LightItem
{
    /**
     * @property    {Number} : Radius
     * @description The range the light will illuminate 
     */
    public Radius: number;
    /**
     * @property    {Number} : Angle
     * @description The angle the light will illuminate.
     *              35 would be a spotlight while 180 would be a globe.
     */
    public Angle: number;
    /**
     * @property    {number} Shininess
     */
    public Shininess: number;

    public Position: Vector3;

    /**
     * 
     * @param request {IPointLight}
     */
    constructor(request: IPointLight)
    {
        super(request);
        
        this.Radius = request.Radius || 5;
        this.Angle  = request.Angle || 180;
        this.Shininess  = request.Shininess || 5;
    }    
}
