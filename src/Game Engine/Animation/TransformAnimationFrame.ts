import { AnimationFrame, IAnimationFrame } from "./AnimationFrame";
import { Transform } from "../Transform";

export interface ITransformAnimationFrame extends IAnimationFrame<Transform> { }

export class TransformAnimationFrame extends AnimationFrame<Transform>
{
    constructor(request: ITransformAnimationFrame)
    {
        super(request);
    }
}
