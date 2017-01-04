/*!
 * 	{GameObject: request}
 */
function Collision(request)
{
    if (!request) request = {};
    request.type = "COLLISION";
    PhysicsItem.call(this, request);

}

