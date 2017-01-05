/**
 * @constructor Collision
 * @description This is the base object for collision objects
 * @module      FWGE.Physics
 * @param       request: {Object}
 * 	            > parent: {PhysicsItem}
 */
function Collision(request)
{
    if (!request) request = {};
    request.type = "COLLISION";
    PhysicsItem.call(this, request);

    var _PhysicsItem = request.parent instanceof PhysicsItem ? request.parent : undefined;

    Object.defineProperties(this,
    {
        /**
         * @property    PhysicsItem: {PhysicsItem}
         *              > get
         *              > set
         * @description The physics item this collider is attached to
         */
        PhysicsItem:
        {
            get: function getPhysicsItem() { return _PhysicsItem; },
            set: function setPhysicsItem()
            {
                if (arguments[0] instanceof PhysicsItem || arguments === undefined)
                    _PhysicsItem = arguments[0];
            }
        }
    });   
}

