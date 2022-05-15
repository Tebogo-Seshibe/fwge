import { lerp, Vector3 } from "../../../core/node_modules/@fwge/common/lib"
import { Keyframe } from "./Keyframe"
import { ValueGetter } from "./Transition"

export interface IAnimation
{
    lifetime: number
    loop: boolean
    keyframes: any[]
}

export class Animation
{
    index: number = 0
    lifetime: number = 0
    loop: boolean = false
    keyframes: Map<string, Keyframe<any>[]> = new Map()
    Keyframes: Map<string, Keyframe<any>[]> = new Map()
    ValueGetters: Map<string, ValueGetter<any>> = new Map()

    get totalLifetime(): number
    {
        const k = this.Keyframes.get('Position')!
        return k.reduce((p, c) => p + c.Length, 0)
    }

    get Completed(): boolean
    {
        return this.lifetime >= this.totalLifetime && !this.loop
    }
}