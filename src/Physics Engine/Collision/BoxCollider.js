/**
 * @name        BoxCollider
 * @description This is a cube-shaped collision object
 * @module      FWGE.Physics
 */
function BoxCollider(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "BOXCOLLISION ";
    
    Collider.call(this, request);

    //define dimensions   
}

