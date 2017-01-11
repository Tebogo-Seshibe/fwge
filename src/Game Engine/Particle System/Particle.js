/**
 * @constructor Particle
 * @description Definition of a single particle.
 * @module      FWGE.Game.ParticleSystem
 * @param       request:     {Object}
 */
function Particle(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "PARTICLE ";
    
    Item.call(this, request);
}