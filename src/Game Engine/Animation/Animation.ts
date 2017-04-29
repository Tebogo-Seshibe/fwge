import { GameItem } from "../GameItem";
import { GameObject } from "../GameObject";

export interface IAnimation
{
    Name?:           string;
    GameObject?:     GameObject | null;

}

/**
 * @name        Particle
 * @description Definition of an animator
 * @module      FWGE.Game
 */

export class Animation extends GameItem
{
    constructor(request: IAnimation)
    {
        super(request.Name || "Animation", request.GameObject || null);
    }

    public Update(): void { }
}
