function ParticleSystem(request)
{
    if (!request) request = {};
    request.type = "PARTICLESYSTEM";
    GameItem.call(this, request);

    var $ = this;
}

