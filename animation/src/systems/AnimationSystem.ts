import { clamp } from "@fwge/common"
import { System } from "@fwge/core"
import { Animation } from "../base"
import { AnimationPlayer } from "../components"

export class AnimationSystem extends System
{
    constructor()
    {
        super({ requiredComponents: [ AnimationPlayer ] })
    }

    Init(): void { }
    Start(): void { }
    Stop(): void { }

    Update(delta: number): void
    {
        for (const entity of this.entities)
        {
            const animationPlayer = entity.GetComponent(AnimationPlayer)!
            const animation = animationPlayer.CurrentAnimation

            if (animation)
            {
                animationPlayer.CurrentAnimation.lifetime += delta
                if (!animationPlayer.CurrentAnimation.Completed)
                {
                    this.updateAnimation(animationPlayer.CurrentAnimation, delta)
                }
                
                if (animation.lifetime >= animation.totalLifetime)
                {
                    animation.index = 0
                    animation.lifetime = 0
                }
            }
        }
    }

    private updateAnimation(animation: Animation, delta: number)
    {
        let index = animation.index
        let check = true

        for (const [type, frames] of animation.Keyframes)
        {
            const currFrame = frames[animation.index]
            const nextFrame = frames[animation.index + 1]
            const valueGetter = animation.ValueGetters.get(type)!

            currFrame.CurrentLifetime = clamp(currFrame.CurrentLifetime + delta, 0, currFrame.Length)
            currFrame.Transition(currFrame.CurrentLifetime / currFrame.Length, currFrame.Value, nextFrame.Value, valueGetter())

            if (check)
            {
                if (currFrame.CurrentLifetime + delta > currFrame.Length)
                {
                    index = animation.index + 1
                }
                check = false
            }
        }
        
        animation.index = index
    }
}
