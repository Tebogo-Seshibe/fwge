import { Item } from "./Item";
import { GameObject } from "./GameObject";

/**
 * @name        GameItem
 * @description The base container for objects used within the scene.
 * @module      FWGE.Game
 */
export class GameItem extends Item
{
    /**
     * @property    GameObject: {GameObject} [read|write]
     * @description The GameObject this item is attached to.
     */
    public GameObject: GameObject | null;

    constructor(name: string, gameObject: GameObject | null)
    {
        super(name);
        this.GameObject = gameObject;
    }
}
