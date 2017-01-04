/*!
 * 	@constructor 	Item
 *	@module 		FWGE.GameEngine
 *	@description 	The base object for every item
 *					used by the game engine.
 *	@param			{GameObject: request}
 *					> {String: type}
 *					> {String: name}
 */
function Item(request)
{
	if (!request) request = {};

	var $ 	  = this;
	var _Name = request.name || "Item";

	Object.defineProperties(this,
	{
        /*!
         *  @property       {String: Type}
         *					> get
         *  @description    A string descriptior for the type of item.
         */
		Type: { value: request.type || "ITEM" },

        /*!
         *  @property       {String: Name}
         *					> get
         *					> set
         *  @description    A string descriptior for the item.
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