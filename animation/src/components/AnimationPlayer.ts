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
    {
        this.activeAnimation = this.animations.get(name)
    }

    Stop(): void
    {
        this.activeAnimation = undefined
    }
}
