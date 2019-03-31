import Colour4 from '../Render/Colour4'
import Transform from '../Transform'

export type Frame = Colour4 | Transform

export class AnimationFrameGroup
{
    Colour: Colour4
    Transform: Transform
}

export class IAnimationFrame<Frame>
{
    frame: Frame
    time: number
}

export default class AnimationFrame<Frame>
{
    public Frame: Frame
    public Time: number

    constructor({ frame, time }: IAnimationFrame<Frame>)
    {
        this.Frame = frame
        this.Time = time
    }
}