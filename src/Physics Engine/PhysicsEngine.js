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
            Update:
            { 
                value: function Update()
                {
                    var self = this;
                    GameObject.Objects.forEach(function(gameobject)
                    {
                        if (!!gameobject.Physics)
                        {
                            let body = gameobject.Physics.Body;
                            let material = gameobject.Physics.Material;
                            let collider = gameobject.Physics.Collider;

                            if (!body.Geounded && !body.LockY)
                            {
                                let delta = (Time.Delta * self.Gravity) * 0.01;
                                gameobject.Transform.Position.Y += delta;
                            }
                        }   
                    });
                },
                configurable: false, enumerable: false, writable: false },
        });
    }
    
    PhysicsEngine.prototype = Object.create(null);
    Object.seal(PhysicsEngine.prototype);

    return new PhysicsEngine()
})();
Object.seal(PhysicsEngine);
