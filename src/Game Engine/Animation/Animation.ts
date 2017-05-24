import { GameItem } from "../GameItem";
import { GameObject } from "../GameObject";

export class IAnimation
{
    public Name: string | undefined;
    public GameObject: GameObject | null | undefined;
}

export class Animation extends GameItem
{
    constructor({Name = "Animation", GameObject = null}: IAnimation)
    {
        super(Name, GameObject);
    }

    public Update(): void { }
}
