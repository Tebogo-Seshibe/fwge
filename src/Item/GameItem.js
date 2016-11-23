/*!
 *  @param  {GameObject: gameobject}    The GameObject this item is attached to.
 *  @param  {String: type}              The type of the item.
 */
function GameItem(gameobject, type)
{
    var $ = this;
    var _GameObject = gameobject;
    
    Object.defineProperties($,
    {
        Type: { value: type },
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

