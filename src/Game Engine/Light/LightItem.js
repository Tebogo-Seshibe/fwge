/**
 * @name        LightItem
 * @module      FWGE.Game.Light
 * @description This is the base definition of a light oject within the scene
 */

let LightItem = (function()
{
    /**
     * @param {string} name 
     * @param {GameObject} gameobject 
     * @param {Array} colour 
     * @param {number} intensity 
     */
    function LightItem(name, colour, intensity)
    {
        Item.call(this, name);

        Object.defineProperties(this,
        {
            /**
             * @property    {Colour}
             * @type        {Colour}
             */
            Colour: { value: new Colour(colour[0], colour[1], colour[2], colour[3]), configurable: false, enumerable: true, writable: false },

            /**
             * @property    {Intensity}
             * @type        {number}
             */
            Intensity: { value: intensity, configurable: false, enumerable: true, writable: false }
        });
    }

    LightItem.prototype = Object.create(null);

    return LightItem;
})();
Object.seal(LightItem);
