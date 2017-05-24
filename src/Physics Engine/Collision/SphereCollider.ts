import { Collider, ICollider } from "./Collider";

export interface ISphereCollider extends ICollider
{
	Radius?: number;
}

/**
 * @name        SphereCollider
 * @description This is a sphere-shaped collision object
 * @module      FWGE.Physics
 */
export class SphereCollider extends Collider
{
    public Radius: number;

    constructor(request: ISphereCollider)
    {
        super(request);

        this.Radius = request.Radius || 2;
    }
}
