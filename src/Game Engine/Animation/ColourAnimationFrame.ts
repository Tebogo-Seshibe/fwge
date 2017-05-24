import { AnimationFrame, IAnimationFrame } from "./AnimationFrame";
import { Colour } from "../../Render Engine/Colour";

export interface IColourAnimationFrame extends IAnimationFrame<Colour> { }

export class ColourAnimationFrame extends AnimationFrame<Colour>
{
    constructor(request: IColourAnimationFrame)
    {
        super(request);
    }
}
