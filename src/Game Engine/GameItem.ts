import Item from "./Item";
import GameObject from "./GameObject";

export default class GameItem extends Item
{
    GameObject: GameObject

    constructor(name: string, gameObject?: GameObject)
    {
        super(name);
        
        this.GameObject = gameObject
    }
}
