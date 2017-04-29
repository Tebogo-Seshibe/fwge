import { KeyFrame, IKeyFrame } from "./KeyFrame";

interface AnimationFrameColour extends IKeyFrame<Colour> { }
interface AnimationFrameTransform extends IKeyFrame<Transform> { }

export interface IAnimationFrame
{
    Length: number;
    Colour: AnimationFrameColour;
    Transform: AnimationFrameTransform;
}

export class AnimationFrame
{
    public Length: number;
    public Colour: KeyFrame<Colour>;
    public Transform: KeyFrame<Transform>;

    constructor(request: IAnimationFrame)
    {
        this.Length     = request.Length || 1000;
        this.Colour     = new KeyFrame<Colour>(request.Colour);
        this.Transform  = new KeyFrame<Transform>(request.Transform);
    }
}
