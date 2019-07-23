import Colour4 from "../Render/Colour4"
import Vector3 from "../Maths/Vector3"

export class FrameDetail
{
    Colour: Colour4
    Position: Vector3
    Rotation: Vector3
    Scale: Vector3
}

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
    public Offset: FrameDetail
    public Start: number
    public End: number

    constructor(start: number, end: number, offset: FrameDetail)
    {
        this.Offset = offset
        this.Start = start
        this.End = end
    }
}