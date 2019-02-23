/**
 * @name        Colour
 * @module      FWGE.Render
 * @description This module is used to create simple 3 valued arrays
 *              representing the rgb values of colours.
 */

window.Colour = (function()
{
    /**
     * @param   {number} red
     * @param   {number} green
     * @param   {number} blue
     * @param   {number} alpha
     */
    function Colour(red = 1, green = 1, blue = 1, alpha = 1)
    {
        BufferedArray.call(this, 4, Float32Array);
        this.Set(red, green, blue, alpha);

        Object.seal(this);
    }
    Object.defineProperties(Colour,
    {
        /**
         * @function    Clamp
         * @param       {number}    value
         * @return      {number}
         */
        Clamp: 
        {
            value: function Clamp(value)
            {
                return value > 1 ? 1 : value < 0 ? 0 : value;
            },
            configurable: false, enumerable: false, writable: false
        },

        /**
         * @function    Set
         * @param       {Colour}    colour
         * @param       {number}    red
         * @param       {number}    green
         * @param       {number}    blue
         * @param       {number}    alpha
         * @return      {Colour}   
         */
        Set:
        {
            value: function Set(colour, red, green, blue, alpha)
            {
                colour.R = red;
                colour.G = green;
                colour.B = blue;
                colour.A = alpha;

                return colour;
            }
        }
    });

    Colour.prototype = Object.create(null);
    Object.defineProperties(Colour.prototype,
    {
        constructor: { value: Colour },

        /**
         * @property    {R}
         * @type        {number}
         */
        R:
        { 
            get: function get() { return this.Buffer[0]; },
            set: function set(red) { this.Buffer[0] = Colour.Clamp(red); },
            configurable: false, enumerable: false
        },
        
        /**
         * @property    {G}
         * @type        {number}
         */
        G:
        { 
            get: function get() { return this.Buffer[1]; },
            set: function set(green) { this.Buffer[1] = Colour.Clamp(green); },
            configurable: false, enumerable: false
        },
        
        /**
         * @property    {B}
         * @type        {number}
         */
        B:
        { 
            get: function get() { return this.Buffer[2]; },
            set: function set(blue) { this.Buffer[2] = Colour.Clamp(blue); },
            configurable: false, enumerable: false
        },
        
        /**
         * @property    {A}
         * @type        {number}
         */
        A:
        { 
            get: function get() { return this.Buffer[3]; },
            set: function set(alpha) { this.Buffer[3] = Colour.Clamp(alpha); },
            configurable: false, enumerable: false
        },

        /**
         * @function    Set
         * @param       {number}    red
         * @param       {number}    green
         * @param       {number}    blue
         * @param       {number}    alpha
         * @return      {Colour}
         */
        Set:
        {
            value: function Set(red, green, blue, alpha)
            {
                return Colour.Set(this, red, green, blue, alpha);
            }
        }
    });
    Object.seal(Colour.prototype);

    return Colour;
})();
Object.seal(Colour);
