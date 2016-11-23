function ParticleSystem(request)
{
    var $ = this;
    if (!request) request = {};
    GameItem.call($, request.gameobject, "PARTICLESYSTEM");
}

