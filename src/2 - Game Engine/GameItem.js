/**
 * @name        GameItem
 * @module      FWGE.Game
 */

let GameItem = (function()
{
    /**
     * @param   {string}        name
     * @param   {GameObject}    gameobject
     */
    function GameItem(name, gameobject)
    {
        Item.call(this, name);

        Object.defineProperties(this,
        {
            /**
             * @property    {GameObject}
             * @type        {GameObject}
             */
            GameObject: { value: gameobject, configurable: false, enumerable: true, writable: false }
        });
    }

    GameItem.prototype = Object.create(null);
    Object.seal(GameItem.prototype);

    return GameItem;
})();
Object.seal(GameItem);
