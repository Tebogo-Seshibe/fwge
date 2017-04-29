import { GameItem }     from "../GameItem";
import { GameObject }   from "../GameObject";
import { Colour }       from "../../Render Engine/Colour";

export interface ILightItem
{
    Name?:       string;
    Colour?:     Colour;
    Intensity?:  number;
    GameObject?: GameObject;
}

/**
 * @name        LightItem
 * @description Base definition of an object that illuminates the scene.
 */
export class LightItem extends GameItem
{
    /**
     * @property    Colour: {Float32Array} [read|write]
     * @description Descrbies the colour that the light object emits.
     */
    public Colour: Colour;
    
    /**
     * @property    Intensity:  {Number} [read|write]s
     * @description Descrbies the intensity at which the light object emits.
     *              This ranges between: [0, 1].
     */
    public Intensity: number;

    /**
     * 
     * @param name {string}
     * @param gameObject {GameObject}
     * @param colour {Colour}
     * @param intensity {number}
     */
    constructor(request: ILightItem)
    {
        super(request.Name || "Light Item", request.GameObject || new GameObject({}));

        this.Colour = request.Colour || new Colour();
        this.Intensity = request.Intensity || 1.0;
    }
}
