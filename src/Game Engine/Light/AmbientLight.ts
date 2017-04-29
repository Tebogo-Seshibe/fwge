import { LightItem }    from "./LightItem";

export interface IAmbientLight extends ILightItem
{

}

/**
 * @name        {AmbientLight}
 * @module      {FWGE.Game.Light}
 * @description This type of light is used to light the scene evenly
 *				in one colour.
 */
export class AmbientLight extends LightItem
{
    /**
     * 
     * @param request {IAmbientLight}
     */
    constructor(request: IAmbientLight)
    {
        super(request)
    }
}
