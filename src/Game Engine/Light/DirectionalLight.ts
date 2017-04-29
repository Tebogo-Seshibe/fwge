import { Vector3 }      from "../Maths/Vector3";
import { LightItem }    from "./LightItem";

export interface IDirectionalLight extends ILightItem
{
    Direction:  Vector3;
}

/**
 * @name        {DirectionalLight}
 * @module      {FWGE.Game.Light}
 * @description Definition of a light that shines in a given direction.
 */
export class DirectionalLight extends LightItem
{
    /**
     * @property    {Float32Array} : Direction
     * @description Returns the direction the light is pointing in.
     */
    public Direction: Vector3;

    /**
     * 
     * @param request {IDirectionalLight}
     */
    constructor(request: IDirectionalLight)
    {
        super(request);
        this.Direction = request.Direction || Vector3.One;
    }
}
