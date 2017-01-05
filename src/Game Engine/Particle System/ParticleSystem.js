/**
 * @constructor ParticleSystem
 * @description Definition of a particle system.
 * @module      FWGE.Game
 * @param       request:     {Object}
 */
function ParticleSystem(request)
{
    if (!request) request = {};
    request.type = "PARTICLESYSTEM";
    GameItem.call(this, request);
}

