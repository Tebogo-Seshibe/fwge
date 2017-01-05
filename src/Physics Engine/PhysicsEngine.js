/**
 * @constructor PhysicsEngine
 * @description Something...
 * @module      FWGE
 */
function PhysicsEngine()
{
    Object.defineProperties(this,
    {
        /**
         * @property    Collision: {Number}
         * @description Constructor for a Collision object.
         * @see         FWGE.Physics.Collision
         */
        Collision:      {value: Collision},
        
        /**
         * @property    Collision: {Number}
         * @description Constructor for a Physics Body.
         * @see         FWGE.Physics.PhysicsBody
         */
        PhysicsBody:    {value: PhysicsBody},
        
        /**
         * @property    Collision: {Number}
         * @description Constructor for a PhysicsMaterial.
         * @see         FWGE.Physics.PhysicsMaterial
         */
        PhysicsMaterial:{value: PhysicsMaterial},

        /**
         * @constant    Gravity: {Number}
         * @description Gravity in m/s
         */
        Gravity:        { value: -9.8 },

        /**
         * @function    Init: void
         * @description Initializes the physics engine
         */
        Init:
        {
            value: function Init()
            {

            }
        },

        /**
         * @function    PhysicsUpdate: void
         * @description Initializes the physics engine
         */
        PhysicsUpdate:
        {
            value: function PhysicsUpdate()
            {

            }
        }
    });
}

