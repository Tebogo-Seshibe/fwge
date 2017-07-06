/**
 * @name        ColourAnimationFrame
 * @module      FWGE.Game
 * @description An animation frame that changes the colour of the object.
 */

window.ColourAnimationFrame = (function()
{
    /**
     * @param   {Object}    equest
     * @param   {Colour}    request.before 
     * @param   {Colour}    request.after 
     * @param   {number}    request.length 
     */
    function ColourAnimationFrame({before = new Colour(), after = new Colour(), length = 0} = {})
    {
        AnimationFrame.call(this, Colour, before, after, length);
        Object.seal(this);
    }

    ColourAnimationFrame.prototype = Object.create(null);
    Object.seal(ColourAnimationFrame.prototype);


    return ColourAnimationFrame;
})();
Object.seal(ColourAnimationFrame);
