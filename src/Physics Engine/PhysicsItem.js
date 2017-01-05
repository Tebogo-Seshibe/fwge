/**
 * @constructor PhysicsItem
 * @description The physics item
 * @module      FWGE.Physics
 * @param       request: {Object}
 */
function PhysicsItem(request)
{
    if (!request) request = {};
    GameItem.call(this, request);
}

