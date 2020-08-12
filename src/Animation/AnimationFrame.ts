import { Transform } from "../Logic/Object"
import { Colour4 } from "../Render"
import Cloneable from "../Logic/Interfaces/Cloneable"

class IAnimationFrame
{
    length: number
    next?: AnimationFrame
    colour?: Colour4
    transform?: Transform
}

export default class AnimationFrame implements Cloneable<AnimationFrame>
{
    //#region Public Properties
    public Timestamp: number
    public Length: number
    
    public Next: AnimationFrame
    public Colour: Colour4
    public Transform: Transform
    //#endregion

    //#region Public Properties
    constructor({ length, next, colour, transform }: IAnimationFrame)
    {
        this.Timestamp = 0
        this.Length = length
        this.Next = next
        this.Colour = new Colour4(colour)
        this.Transform = new Transform(transform)
    }

    public Clone(): AnimationFrame
    {
        return new AnimationFrame(
        {
            length: this.Length,
            next: this.Next,
            colour: this.Colour,
            transform: this.Transform  
        })
    }
    //#endregion
}