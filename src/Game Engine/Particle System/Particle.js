/**
 * @constructor Particle
 * @description Definition of a single particle.
 * @module      FWGE.Game.ParticleSystem
 * @param       request:     {Object}
 */
function Particle(request)
{
    if (!request) request = {};
    request.type = "PARTICLE";
    GameItem.call(this, request);
}