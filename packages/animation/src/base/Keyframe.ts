import { Transition } from "./transitions/Transition"

export class Keyframe<T>
{
    CurrentLifetime: number = 0
    
    constructor(
        readonly Length: number,
        readonly Value: T,
        readonly Transition: Transition<T>
    ) { }
}
