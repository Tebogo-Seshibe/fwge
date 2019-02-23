/**
 * @name        TransformAnimationFrame
 * @module      FWGE.Game
 * @description An animation frame thay changes the transform attributes of an object
 */

window.TransformAnimationFrame = (function()
{
    /**
     * @param   {Object}    request
     * @param   {Transform} request.before
     * @param   {Transform} request.after
     * @param   {number}    request.length
     */
    function TransformAnimationFrame({before = new Transform(), after = new Transform(), length = 0} = {})
    {
        AnimationFrame.call(this, Transform, before, after, length);
        Object.seal(this);
    }

    TransformAnimationFrame.prototype = Object.create(null);
    Object.seal(TransformAnimationFrame.prototype);


    return TransformAnimationFrame;
})();
Object.seal(TransformAnimationFrame);
