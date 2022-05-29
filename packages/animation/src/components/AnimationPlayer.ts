import { CalcuateDelay, IDelay } from "@fwge/common"
import { SharedComponent } from "@fwge/core"
import { Animation } from "../base"

export class AnimationPlayer extends SharedComponent
{
    activeAnimation?: Animation
    animations: Map<string, Animation> = new Map()

    get CurrentAnimation(): Animation | undefined
    {
        return this.activeAnimation
    }

    constructor()
    {
        super(AnimationPlayer)
    }

    Play(name: string): void
    Play(name: string, delay: IDelay): void
    Play(name: string, delay: IDelay = {}): void
    {
        setTimeout(() =>
        {
            const animation = this.animations.get(name)

            if (animation)
            {
                animation.CurrentKeyFrame = new Map()
                for (const [key, { KeyFrames }] of animation.AnimationFrames)
                {
                    animation.CurrentKeyFrame.set(key, KeyFrames.Get(0)!)
                }
            }

            this.activeAnimation = animation
        }, CalcuateDelay(delay))
    }

    Stop(): void
    Stop(delay: IDelay): void
    Stop(delay: IDelay = {}): void
    {
        setTimeout(() =>
        {
            if (this.activeAnimation)
            {
                this.activeAnimation.CurrentKeyFrame = new Map()
                this.activeAnimation = undefined
            }
        }, CalcuateDelay(delay))
    }
}
