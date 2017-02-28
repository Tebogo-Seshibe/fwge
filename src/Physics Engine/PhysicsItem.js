/**
 * @name PhysicsItem
 * @description The physics item
 * @module      FWGE.Physics
 * @param       request: {Object}
 */
function PhysicsItem(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "PHYSICSITEM ";

    GameItem.call(this, request);

    var _Collision = request.collision instanceof Collision ? request.collision : undefined;
    var _PhysicsMaterial = request.material instanceof PhysicsMaterial ? request.material : undefined;
    
    Object.defineProperties(this,
    {
        /**
         * @property    PhysicsBody: {PhysicsBody}
         *              > get
         * @description Add some words...
         */
        PhysicsBody: { value: request.body instanceof PhysicsBody ? request.body : new PhysicsBody() },

        /**
         * @property    Collision: {Collision}
         *              > get
         *              > set
         * @description Add some words...
         */
        Collision:
        {
            get: function getCollision() { return _Collision },
            set: function setCollision()
            {
                if (arguments[0] instanceof Collision)
                {
                    _Collision = arguments[0];
                    _Collision.PhysicsItem = this;
                }
                else if (arguments[0] === undefined)
                {
                    _Collision.PhysicsItem = undefined;
                    _Collision = undefined;
                }
            }
        },

        /**
         * @property    PhysicsMaterial: {PhysicsMaterial}
         *              > get
         *              > set
         * @description Add some words...
         */
        PhysicsMaterial:
        {
            get: function getPhysicsMaterial() { return _PhysicsMaterial },
            set: function setPhysicsMaterial()
            {
                if (arguments[0] instanceof PhysicsMaterial || undefined)
                    _PhysicsMaterial = arguments[0];
            }
        },

        /**
         * @property    PhysicsUpdate: {Function}
         * @description Update the physics stuffs...
         */
        PhysicsUpdate:
        {
            value: function PhysicsUpdate()
            {
                if (!this.PhysicsBody.LockY)
                {
                    this.PhysicsBody.Velocity += (FWGE.Physics.Gravity * (FWGE.Game.Time.Delta / 1000));
                    this.GameObject.Transform.Position.Y += this.PhysicsBody.Velocity;
                }
            }
        }
    });
}

