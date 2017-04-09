/**
 * @name        SphereCollider
 * @description This is a sphere-shaped collision object
 * @module      FWGE.Physics
 */
function SphereCollider(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "SPHERECOLLISION ";
    
    Collider.call(this, request);

    //define dimensions   
}

