/**
 * @name        AnimationFrame
 * @module      FWGE.Game
 * @description The base animation frame object
 */

let AnimationFrame = (function()
{
    /** 
     * @param {Function}    T 
     * @param {T}           before 
     * @param {T}           after 
     * @param {number}      length 
     */
    function AnimationFrame(T, before, after, length)
    {
        KeyFrame.call(this, T, before, after, length);
    }

    AnimationFrame.prototype = Object.create(null);
    Object.seal(AnimationFrame.prototype);

    return AnimationFrame;
})();
Object.seal(AnimationFrame);
