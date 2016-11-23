function Animation(request)
{
    var $ = this;
    if (!request) request = {};
    GameItem.call($, request.gameobject, "ANIMATION");
}

