/**
 * @name        CollisionEvent
 * @description A collision event object
 * @module      FWGE.Physics
 */
function CollisionEvent(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "COLLISIONEVENT ";
    
    Item.call(this, request);

    //define dimensions   
}

