/**
 * @name        DirectionalLight
 * @module      FWGE.Game.Light
 * @description This light illuminates the scene in a given direction, similar that to the sun
*/

window.DirectionalLight = (function()
{
    /**
     * @param {Object}      request
     * @param {string}      request.name
     * @param {GameObject}  request.gameobject
     * @param {Array}       request.colour
     * @param {number}      request.intensity
     * @param {Array}       request.direction
     */
    function DirectionalLight({name = 'Directional Light', gameobject = undefined, colour = [1, 1, 1, 1], intensity = 1.0, direction = Vector3.One} = {})
    {
        LightItem.call(this, name, gameobject, colour, intensity)

        Object.defineProperties(this,
        {
            /**
             * @property    {Direction}
             * @type        {Vector3}
             */
            Direction: { value: new Vector3(direction[0], direction[1], direction[2]), configurable: false, enumerable: true, writable: false }
        });

        Object.seal(this);
    }

    DirectionalLight.prototype = Object.create(null);
    Object.seal(DirectionalLight.prototype);

    return DirectionalLight;
})();
Object.seal(DirectionalLight);
