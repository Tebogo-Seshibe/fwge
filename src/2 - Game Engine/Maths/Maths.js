/**
 * @name Maths
 * @description This module contains the methods required for matrix and vector
 *              operations.
 * @module      FWGE.Game
 */

window.Maths = (function()
{
    function Maths()
    {
        Object.defineProperties(this,
        {
            Radian: { value: function Radian(degree)            { return Math.PI / 180 * degree; } },
            Cot:    { value: function Cot(angle)                { return 1 / Math.tan(angle)} },
            Clamp:  { value: function Clamp(value, min, max)    { return Math.max(Math.min(value, max), min); } }
        });
    }

    return new Maths();
})();