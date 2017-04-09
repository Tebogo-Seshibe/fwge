/**
 * @name        Item
 * @module      FWGE.Game
 * @description The base object for every item
 *              used within the game engine.
 */
function Item(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = (request.type + "ITEM").trim().split(/\s+/);

    var _Name = request.name || "Item";

    Object.defineProperties(this,
    {
        /**
         * @property    Type: {String} [read]
         * @description A string descriptor for the type of item.
         */
        Type: { value: request.type },

        /**
         * @property    Name: {String} [read|write]
         * @description A simple string naming the item
         */
        Name:
        {
            get: function getName() { return _Name; },
            set: function setName()
            {
                if (typeof arguments[0] === 'string')
                    _Name = arguments[0];
            }
        }
    });
}

