/**
 * @name        PhysicsEngine
 * @module      FWGE
 * @description Something...
 */

let PhysicsEngine = (function()
{
    function PhysicsEngine()
    {
        Object.defineProperties(this,
        {        
            /**
             * @property    {Gravity}
             * @type        {Number}
             * @description Gravity in m/s
             */
            Gravity: { value: -9.8, configurable: false, enumerable: true, writable: false },

            /**
             * @function    PhysicsUpdate
             * @return      {undefined}
             * @description Initializes the physics engine
             */
            Update: { value: function Update(){}, configurable: false, enumerable: false, writable: false },
        });
    }
    
    PhysicsEngine.prototype = Object.create(null);
    Object.seal(PhysicsEngine.prototype);

    return new PhysicsEngine()
})();
Object.seal(PhysicsEngine);
