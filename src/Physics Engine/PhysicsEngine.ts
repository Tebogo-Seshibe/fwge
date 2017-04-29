import { PhysicsBody } from "./PhysicsBody";
import { PhysicsMaterial } from "./PhysicsMaterial";
import { Colliders } from "./Collision/Colliders";

/**
 * @name PhysicsEngine
 * @description Something...
 * @module      FWGE
 */
export class PhysicsEngine
{
    /**
     * @property    Collision: {Function}
     * @description Constructor for a Colliders object.
     * @see         FWGE.Physics.Colliders
     */
    public readonly Colliders: Colliders = new Colliders();
    
    /**
     * @constant    Gravity: {Number}
     * @description Gravity in m/s
     */
    public readonly Gravity: number = -9.8;

    /**
     * @function    Init: void
     * @description Initializes the physics engine
     */
    Init()
    {

    }

    /**
     * @function    PhysicsUpdate: void
     * @description Initializes the physics engine
     */
    Update()
    {

    }

    /**
     * @property    PhysicsBody: {Function}
     * @description Constructor for a Physics Body.
     * @see         FWGE.Physics.PhysicsBody
     */
    Body(request: IPhysicsBody): PhysicsBody
    {
        return new PhysicsBody(request);
    }
    
    /**
     * @property    PhysicsMaterial: {Function}
     * @description Constructor for a PhysicsMaterial.
     * @see         FWGE.Physics.PhysicsMaterial
     */
    Material(request: IPhysicsMaterial): PhysicsMaterial
    {
        return new PhysicsMaterial(request);
    }
}
