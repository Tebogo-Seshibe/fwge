import { Transition } from "./transitions/Transition"

export class Keyframe<T>
{
    CurrentLifetime: number = 0
    
    constructor(
        public readonly Length: number,
        public readonly Value: T,
        public readonly Transition: Transition<T>
    ) { }
}
