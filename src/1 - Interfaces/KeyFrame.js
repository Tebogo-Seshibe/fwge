/**
 * @name        KeyFrame
 * @module      FWGE.Interface
 * @description SOme description
 */

let KeyFrame = (function()
{
    /**
     * 
     * @param {Function}    T 
     * @param {T}           before 
     * @param {T}           after 
     * @param {number}      length 
     */
    function KeyFrame(T, before, after, length)
    {
        var _Current = new T();
        var _Offset = new T();

        Object.defineProperties(this,
        {
            /**
             * @property    {Before}
             * @type        {T}
             */
            Before: { value: before, configurable: false, enumerable: true, writable: false },

            /**
             * @property    {After}
             * @type        {T}
             */
            After: { value: after, configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Length}
             * @type        {number}
             */
            Length: { value: length, configurable: false, enumerable: true, writable: false }
        });
    }

    return KeyFrame;
})();
Object.seal(KeyFrame);
