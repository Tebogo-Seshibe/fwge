import { GameItem } from "../Game Engine/GameItem";
import { GameObject } from "../Game Engine/GameObject";

export interface IPhysicsMaterial
{
    Name?:          string;
    GameObject?:    GameObject | null;
}

/**
 * @name        PhysicsMaterial
 * @description Some words of encouragement
 */
export class PhysicsMaterial extends GameItem
{
    constructor(request: IPhysicsMaterial)
    {
        super(request.Name || "Physics Material", request.GameObject || null);
    }
}
