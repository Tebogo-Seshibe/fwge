/**
 * @name        ParticleSystem
 * @module      FWGE.Game
 * @description Definition of a particle system.
 */

window.ParticleSystem = (function()
{
    /**
     * @param   {Object}    request
     * @param   {string}    request.name
     * @param   {Particle}  request.particle
     */
    function ParticleSystem({name = "Particle System", particle = {}} = {})
    {
        Item.call(this, name);

        Object.defineProperties(this,
        {
            /**
             * @property    {Particle}
             * @type        {Particle}
             */
            Particle:  { value: new Particle(particle), configurable: false, enumerable: true, writable: true }
        });

        Object.seal(this);
    }

    ParticleSystem.prototype = Object.create(null);
    Object.seal(ParticleSystem.prototype);

    return ParticleSystem;
})();
Object.seal(ParticleSystem);
