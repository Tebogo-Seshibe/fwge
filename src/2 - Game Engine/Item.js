/**
 * @name        Item
 * @module      FWGE.Game
 * @description The {Item} object is the base item for all usable item in the system.
*/

let Item = (function()
{
    /**
     * @param   {string} Name
     */
    function Item(name = "Item")
    {
        Object.defineProperties(this,
        {
            /**
             * @property    {ID}
             * @type        {number}
             */
            ID: { value: Item.hashcode(Item.ID_COUNTER++), configurable: false, enumerable: true, writable: false },

            /**
             * @property    {Name}
             * @type        {String}
             */
            Name: { value: name, configurable: false, enumerable: true, writable: true }
        });
    }
    Object.defineProperties(Item,
    {
        /**
         * @property    {ID_COUNTER}
         * @type        {number}
         */
        ID_COUNTER: { value: 0, configurable: false, enumerable: false, writable: true },

        /**
         * @function    hashcode
         * @param       {number} number
         * @return      {number}
         */
        hashcode:
        {
            value: function hashcode(number)
            {
                var i = 0;
                var hash = 0;
                var chr = 0;
                var string = number + "";

                for (i = 0; i < string.length; i++)
                {
                    chr   = string.charCodeAt(i);
                    hash  = ((hash << 5) - hash) + chr;
                    hash |= 0;
                }

                return hash;
            },
            configurable: false, enumerable: false, writable: false
        }
    });

    Item.prototype = Object.create(null);
    Object.seal(Item.prototype);

    return Item;
})();
Object.seal(Item);
