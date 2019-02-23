/**
 * @name        AmbienLight
 * @module      FWGE.Game
 * @description Represents a light object that illumnintates the scene evenly with a specific colour
 */

window.AmbientLight = (function()
{
    /** 
     * @param {Object} request 
     * @param {string} request.name 
     * @param {GameObject} request.gameobject 
     * @param {Array} request.colour
     * @param {number} request.intensity
     */
    function AmbientLight({name = "Ambient Light", colour = [1, 1, 1, 1], intensity = 1.0} = {})
    {
        LightItem.call(this, name, colour, intensity);
        
        Lights.push(this);
        Object.seal(this);
    }

    AmbientLight.prototype = Object.create(null);
    Object.seal(AmbientLight.prototype);

    return AmbientLight;
})();
Object.seal(AmbientLight);
