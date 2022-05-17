import { Keyframe } from "./Keyframe"
import { ValueGetter } from "./transitions"
import { LinkedList } from "@fwge/common"

export interface IAnimation
{
    lifetime: number
    loop: boolean
    keyframes: any[]
}

export interface AnimationFrame<T>
{
    KeyFrames: LinkedList<Keyframe<T>>
    ValueGetter: ValueGetter<T>
}

export class Animation
{
    index: number = 0
    lifetime: number = 0
    totalLifetime: number = 0
    loop: boolean = false

    AnimationFrames: Map<string, AnimationFrame<any>> = new Map()
    CurrentKeyFrame: Map<string, Keyframe<any>> = new Map()

    AddFrames<T>(field: string, frames: AnimationFrame<T>)
    {
        this.AnimationFrames.set(field, frames)
    }

    get Completed(): boolean
    {
        return this.CurrentKeyFrame.size === 0 && !this.loop
    }
}