/*!
 *  @constructor    GameItem
 *  @module         FWGE.GameEngine
 *  @description    The base container for objects used within the scene.
 *  @param          {Object: request}
 *                  > {GameObject: gameobject}
 */
function GameItem(request)
{
    if (!request) request = {};
    Item.call(this, request);

    var $           = this;
    var _GameObject = request.gameobject;
    
    Object.defineProperties($,
    {
        /*!
         *  @property       {GameObject: GameObject}
         *                  > get
         *                  > set
         *  @description    The GameObject this item is attached to.
         */
        GameObject:
        {
            get: function getGameObject() { return _GameObject; },
            set: function setGameObject(gameobject)
            {
                if (parent instanceof GameObject || gameobject === undefined)
                    _GameObject = gameobject;
            }
        }
    });
}

