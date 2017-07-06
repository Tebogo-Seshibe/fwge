/**
 * @name        PointLight
 * @module      FWGE.Game
 * @description Represents a light object that illumntes froma fixed point in space,
 *              within a given radius.
 */

window.PointLight = (function()
{
    /** 
     * @param {Object}      request 
     * @param {string}      request.name 
     * @param {GameOject}   request.gameobject 
     * @param {Array}       request.colour 
     * @param {number}      request.intensity 
     * @param {number}      request.radius 
     * @param {number}      request.angle 
     * @param {number}      request.ahininess 
     */
    function PointLight({name = "Point Light", gameobject = undefined, colour = [1,1,1,1], intensity = 1, radius = 5, angle = 180, shininess = 255} = {})
    {
        LightItem.call(this, name, gameobject, colour, intensity);

        Object.defineProperties(this,
        {
            /**
             * @property    {Radius}
             * @type        {number}
             */
            Radius: { value: radius, configurable: false, enumerable: true, writable: true },

            /**
             * @property    {Angle}
             * @type        {number}
             */
            Angle: { value: angle, configurable: false, enumerable: true, writable: true },

            /**
             * @property    {Shininess}
             * @type        {number}
             */
            Shininess: { value: ahininess, configurable: false, enumerable: true, writable: true },
        });

        Object.seal(this);
    }

    PointLight.prototype = Object.create(null);
    Object.seal(PointLight.prototype);

    return PointLight;
})();
Object.seal(PointLight);