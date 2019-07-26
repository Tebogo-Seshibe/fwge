import Colour4 from '../Render/Colour4';
import Transform from '../Transform';
export declare type Frame = Colour4 | Transform;
export declare class AnimationFrameGroup {
    Colour: Colour4;
    Transform: Transform;
}
export declare class IAnimationFrame<Frame> {
    value: Frame;
    time: number;
}
export default class AnimationFrame<Value> {
    Value: Value;
    Time: number;
    Offset: Value;
    Start: number;
    End: number;
    constructor({ value, time }: IAnimationFrame<Value>);
}
