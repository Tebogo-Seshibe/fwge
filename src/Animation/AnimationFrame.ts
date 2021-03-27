// import { Transform } from "../Object"
// import { Colour4 } from "../Render"
import Cloneable from "../Interfaces/Cloneable"

type Transform = {
    Position: Float32Array
    Rotation: Float32Array
    Scale: Float32Array
    Shear: Float32Array
}
class IAnimationFrame
{
    length: number
    next?: AnimationFrame
    colour?: Float32Array
    transform?: Transform
}

export default class AnimationFrame implements Cloneable<AnimationFrame>
{
    //#region Public Properties
    public Timestamp: number
    public Length: number
    
    public Next: AnimationFrame
    public Colour: Float32Array
    public Transform: Transform
    //#endregion

    //#region Public Properties
    constructor({ length, next, colour, transform }: IAnimationFrame)
    {
        this.Timestamp = 0
        this.Length = length
        this.Next = next
        this.Colour = new Float32Array(colour)
        this.Transform = transform
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