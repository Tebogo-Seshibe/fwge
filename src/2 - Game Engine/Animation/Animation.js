/**
 * @name        Animation
 * @module      FWGE.Game
 * @description An animation object
 */

window.Animation = (function()
{
    /**
     * @param   {Object}    request
     * @param   {string}    request.name
     */
    function Animation({name = "Animation"} = {})
    {
        Item.call(this, name);
        Object.seal(this);
    }

    Animation.prototype = Object.create(null);
    Object.seal(Animation.prototype);

    return Animation;
})();
Object.seal(Animation);
