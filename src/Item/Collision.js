function Collision(request)
{
    var $ = this;
    if (!request) request = {};
    GameItem.call($, request.gameobject, "COLLISION");
}

