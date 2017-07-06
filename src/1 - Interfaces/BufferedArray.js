/**
 * @name        BufferedArray
 * @module      FWGE.Interfaces
 * @description This object is a base container for any fixed-lenth array with accesssors
 */

let BufferedArray = (function()
{
    /**
     * @param   {number}    length
     * @param   {Function}  arraytype
     */
    function BufferedArray(length = 0, arraytype = Array)
    {
        var type = typeof length;
        var self = this;

        if (type !== 'number')
            throw `Expected number, ${type} found.`;
            
        if (length <= 0)
            throw 'Length provided must be larger than 0';

        Object.defineProperties(this,
        {
            /**
             * @property    {Buffer}
             * @type        {Array}
             */
            Buffer: { value: new arraytype(length), configurable: false, enumerable: true, writable: false  },

            /**
             * @property    {length}
             * @type        {number}
             */
            length: { value: length, configurable: false, enumerable: true, writable: false }
        });

        for (var i = 0; i < length; ++i)
        {
            (function(index)
            {
                Object.defineProperty(self, index,
                {
                    set: function set(value) { this.Buffer[index] = value; },
                    get: function get() { return this.Buffer[index]; },
                    configurable: false, enumerable: true
                });
            })(i);
        }
    }

    BufferedArray.prototype = Object.create(null);
    Object.seal(BufferedArray.prototype);

    return BufferedArray;
})();
Object.seal(BufferedArray);
