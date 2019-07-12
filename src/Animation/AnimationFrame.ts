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
    value: Frame
    time: number
}

export default class AnimationFrame<Value>
{
    public Value: Value
    public Time: number
    public Offset: Value
    
    public Start: number
    public End: number

    constructor({ value, time }: IAnimationFrame<Value>)
    {
        this.Value = value
        this.Time = time
    }
}