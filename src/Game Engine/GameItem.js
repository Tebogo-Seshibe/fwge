/**
 * @name        GameItem
 * @description The base container for objects used within the scene.
 * @module      FWGE.Game
 */
function GameItem(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "GAMEITEM ";
    
    Item.call(this, request);

    var _GameObject = request.gameobject;
    
    Object.defineProperties(this,
    {
        /**
         * @property    GameObject: {GameObject}
         *              > get
         *              > set
         * @description The GameObject this item is attached to.
         */
        GameObject:
        {
            get: function getGameObject() { return _GameObject; },
            set: function setGameObject()
            {
                if (arguments[0] instanceof GameObject || arguments[0] === undefined)
                    _GameObject = arguments[0];
            }
        }
    });
}

