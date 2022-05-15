import { Transition } from "./Transition"

export class Keyframe<T>
{
    CurrentLifetime: number = 0
    
    constructor(
        public readonly Value: T,
        public readonly Length: number,
        public readonly Transition: Transition<T>
    ) { }
}
