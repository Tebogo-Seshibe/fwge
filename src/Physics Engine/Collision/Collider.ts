import { Item } from "../../Game Engine/Item";
import { PhysicsItem } from "../PhysicsItem";
import { Vector3 } from "../../Game Engine/Maths/Vector3";

export interface ICollider
{
	Name?:          string
	PhysicsItem?:   PhysicsItem | null;
	Position?:      Vector3;
}

/**
 * @name        Collider
 * @description This is the base object for collision objects
 * @module      FWGE.Physics
 */
export class Collider extends Item
{
    
    public Position: Vector3;
    /**
     * @property    PhysicsItem: {PhysicsItem} [read|write]
     * @description The physics item this collider is attached to
     */
    public readonly PhysicsItem: PhysicsItem | null;
    
    constructor(request: ICollider)
    {
        super(request.Name || "Collider");

        this.Position = request.Position || Vector3.Zero;
        this.PhysicsItem = request.PhysicsItem || null;
    }   
}
