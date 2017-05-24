import { BoxCollider, IBoxCollider } from "./BoxCollider";
import { SphereCollider, ISphereCollider } from "./SphereCollider";

/**
 * @name 		Colliders
 * @description This module creates collision objects.
 * @module      FWGE.Physics
 */
export class Colliders
{
	constructor() {}

	/**
	 * @function	BoxCollider: {BoxCollider}
	 * @description	A cube-shaped collider	
	 */
	public Box(request: IBoxCollider): BoxCollider
	{
		return new BoxCollider(request);
	}

	/**
	 * @function	SphereCollider: {SphereCollider}
	 * @description	A cube-shaped collider	
	 */
	public Sphere(request: ISphereCollider): SphereCollider
	{
		return new SphereCollider(request);
	}
}
