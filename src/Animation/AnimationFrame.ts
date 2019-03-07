import Colour4 from '../Colour4'
import Transform from '../Transform'

export type Frame = Colour4 | Transform

export class IAnimationFrame<Frame>
{
    before: Frame
    after: Frame
    length: number = 0
}

export default class AnimationFrame<Frame>
{
    public Before: Frame
    public After: Frame
    public Length: number

    constructor({before, after, length}: IAnimationFrame<Frame>)
    {
        this.Before = before
        this.After = after
        this.Length = length
    }
}