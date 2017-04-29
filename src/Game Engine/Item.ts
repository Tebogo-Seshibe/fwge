/**
 * @name        Item
 * @module      FWGE.Game
 * @description The base object for every item
 *              used within the game engine.
 */
export class Item
{
    /**
     * @type        {String}
     * @description A string descriptor for the type of item.
     */
    public Name: string;

    /**
     * @type        {String}
     * @description A simple string naming the item
     */
    public readonly ID: number;

    private static ID_COUNTER = 0;
    private static hashcode(number: number): number
    {
        var i:          number = 0;
        var hash:       number = 0;
        var chr:        number = 0;
        var string:     string = number + "";

        for (i = 0; i < string.length; i++)
        {
            chr   = string.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0;
        }

        return hash;
    }

    constructor(name: string)
    {
        this.Name   = name;
        this.ID     = Item.hashcode(Item.ID_COUNTER++);
    }
}
