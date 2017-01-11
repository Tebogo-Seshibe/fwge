/**
 * @constructor ParticleSystem
 * @description Definition of a particle system.
 * @module      FWGE.Game
 * @param       request:     {Object}
 */
function ParticleSystem(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "PARTICLESYSTEM ";
    
    GameItem.call(this, request);
}

