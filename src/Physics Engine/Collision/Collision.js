/**
 * @constructor Collision
 * @description This is the base object for collision objects
 * @module      FWGE.Physics
 * @param       request:  {Object}
 */
function Collision(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "COLLISION ";
    
    Item.call(this, request);

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

