import { KeyFrame, IKeyFrame } from "../../Interfaces/KeyFrame";

export interface IAnimationFrame<T> extends IKeyFrame<T> { }

export class AnimationFrame<T> extends KeyFrame<T>
{
    constructor(request: IAnimationFrame<T>)
    {
        super(request);
    }
}
