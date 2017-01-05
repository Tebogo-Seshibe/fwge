/**
 * @constructor Item
 * @module 		FWGE.Game
 * @description The base object for every item
 *				used within the game engine.
 * @param		request: 	{Object}
 *				> type: 	{String}	[nullable]
 *				> name:		{String}	[nullable]
 */
function Item(request)
{
	if (!request) request = {};

	var _Name = request.name || "Item";

	Object.defineProperties(this,
	{
        /**
         * @property    Type:{String}
         *				> get
         * @description A string descriptor for the type of item.
         */
		Type: { value: request.type || "ITEM" },

        /**
         * @property    Name: {String}
         *				> get
         *				> set
         * @description A simple string naming the item
         */
		Name:
		{
			get: function getName() { return _Name; },
			set: function setName(name)
			{
				if (typeof name === 'string')
					_Name = name;
			}
		}
	});
}