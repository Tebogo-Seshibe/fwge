/**
 * @name 		Colliders
 * @description This module creates collision objects.
 * @module      FWGE.Physics
 */
function Colliders()
{
	Object.defineProperties(this, 
	{
		/**
		 * @function	BoxCollider: {BoxCollider}
		 * @description	A cube-shaped collider	
		 */
		BoxCollider: { value: function CreateBoxCollider() { return new BoxCollider(arguments); } },

		/**
		 * @function	SphereCollider: {SphereCollider}
		 * @description	A cube-shaped collider	
		 */
		SphereCollider: { value: function CreateSphereCollider() { return new SphereCollider(arguments); } }
	});
}