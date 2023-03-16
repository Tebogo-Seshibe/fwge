import { Entity, Scene, System, view } from "@fwge/core"
import { Animation, Keyframe } from "../base"
import { AnimationPlayer } from "../components"

export class AnimationSystem extends System
{
    Init(): void { 
        this.entityIds.concat(view([ AnimationPlayer ]));
    }

    Start(): void { }
    Stop(): void { }

    Update(delta: number): void
    {
        for (const entityId of this.entityIds)
        {
            const entity = this.Scene.GetEntity(entityId)!
            const animationPlayer = entity.GetComponent(AnimationPlayer)!
            const animation = animationPlayer.CurrentAnimation

            if (animation && !animation.Completed)
            {
                this.updateAnimation(entity, animation, delta)
            }
        }
    }

    private updateAnimation(owner: Entity, animation: Animation, delta: number)
    {
        const removeList: string[] = []
        const next: Map<string, Keyframe<any>> = new Map()

        for (const [type, currFrame] of animation.CurrentKeyFrame)
        {
            const { KeyFrames, ValueGetter } = animation.AnimationFrames.get(type)!
            const currIndex = KeyFrames.Find(currFrame)
            const nextIndex = currIndex + 1 === KeyFrames.Count ? 0 : currIndex + 1
            const nextFrame = KeyFrames.Get(nextIndex)!

            if (currIndex + 1 === KeyFrames.Count)
            {
                if (!animation.loop)
                {
                    removeList.push(type)
                }
                else
                {
                    nextFrame.CurrentLifetime = delta
                    next.set(type, nextFrame)
                }

                continue
            }            
            
            currFrame.CurrentLifetime += delta
            
            if (currFrame.CurrentLifetime >= currFrame.Length)
            {
                const offset = currFrame.CurrentLifetime - currFrame.Length

                currFrame.CurrentLifetime = 0 
                currFrame.Transition(1, currFrame.Value, nextFrame.Value, ValueGetter(owner))
                
                nextFrame.CurrentLifetime = offset                
                next.set(type, nextFrame)
            }
            else
            {
                currFrame.Transition(currFrame.CurrentLifetime / currFrame.Length, currFrame.Value, nextFrame.Value, ValueGetter(owner))
            }
        }

        removeList.forEach(remove => animation.CurrentKeyFrame.delete(remove))
        next.forEach((keyframe, name) => animation.CurrentKeyFrame.set(name, keyframe))
    }
}

let check = false