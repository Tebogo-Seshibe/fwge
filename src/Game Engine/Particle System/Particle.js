/**
 * @name        Particle
 * @module      FWGE.Game.ParticleSystem
 * @description Definition of a single particle.
 */

window.Particle = (function()
{
    /**
     * @param   {object}    request
     * @param   {string}    request.name
     */
    function Particle({before = new Transform(), after = new Transform(), length = 0})
    {
        KeyFrame.call(this, Transform, before, after, length);

        Object.seal(this);
    }

    Particle.prototype = Object.create(null);
    Object.seal(Particle.prototype);

    return Particle;
})();
Object.seal(Particle);
