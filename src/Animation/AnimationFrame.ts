import Colour4 from "../Render/Colour4"
import Vector3 from "../Maths/Vector3"

export class IAnimationFrame
{
    colour?: Colour4 | number[]
    position?: Vector3 | number[]
    rotation?: Vector3 | number[]
    scale?: Vector3 | number[]
    time: number
}

export default class AnimationFrame
{
    public Start: number
    public End: number
    public Colour: Colour4
    public Position: Vector3
    public Rotation: Vector3
    public Scale: Vector3

    constructor(start: number, end: number, colour: number[], position: number[], rotation: number[], scale: number[])
    {
        this.Start = start
        this.End = end
        this.Colour = new Colour4(colour)
        this.Position = new Vector3(position)
        this.Rotation = new Vector3(rotation)
        this.Scale = new Vector3(scale)
    }
}