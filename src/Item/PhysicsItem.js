function PhysicsItem(request)
{
    var $ = this;
    if (!request) request = {};
    GameItem.call($, request.gameobject, "PHYSICS");
}

