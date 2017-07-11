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
    function Animation({name = "Animation", mesh = undefined, material = undefined, frames = [], length = 0} = {})
    {
        Item.call(this, name);

        Object.defineProperties(this,
        {
            Frames:     { value: [], configurable: false, enumerable: true, writable: true },
            Mesh:       { value: mesh instanceof Mesh ? mesh : undefined, configurable: false, enumerable: true, writable: true },
            Material:   { value: material instanceof RenderMaterial ? material : undefined, configurable: false, enumerable: true, writable: true},
            Length:     { value: length, configurable: false, enumerable: true, writable: true }
        });
        Object.seal(this);
    }

    Animation.prototype = Object.create(null);
    Object.seal(Animation.prototype);

    return Animation;
})();
Object.seal(Animation);
