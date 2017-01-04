/*!
 *  @constructor    PhysicsEngine
 *  @description    Hello
 */
function PhysicsEngine()
{
    Object.defineProperties(this,
    {
        Collision:          {value: Collision},
        PhysicsBody:        {value: PhysicsBody},
        PhysicsMaterial:    {value: PhysicsMaterial},

        /*!
         *  @property       {Number: Gravity}
         *  @description    Gravity in m/s
         */
    	Gravity: { value: -9.8 },

        /*!
         *  @function       Init
         *  @description    Initializes the physics engine
         */
        Init:
        {
            value: function Init()
            {

            }
        },

        /*!
         *  @function       PhysicsUpdate
         *  @description    Initializes the physics engine
         */
        PhysicsUpdate:
        {
            value: function PhysicsUpdate()
            {

            }
        }
    });
}

