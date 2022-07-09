import { AnimationPlayer, Animation, Keyframe, lerpVector3, lerpColour4 } from "@fwge/animation"
import { Colour4, LinkedList, Vector3 } from "@fwge/common"
import { Entity, Transform } from "@fwge/core"
import { Material } from "@fwge/render"

export const basicAnimation = () =>
{ 
    const animationPlayer = new AnimationPlayer()
    const moveAnimation = new Animation()
    moveAnimation.loop = false

    moveAnimation.AddFrames('Position',
    {
        ValueGetter: (entity: Entity) => entity.GetComponent(Transform)!.Position,
        KeyFrames: new LinkedList(
            new Keyframe(1.0, new Vector3(-10, 0.5,-10), lerpVector3),
            new Keyframe(1.0, new Vector3( 10, 0.5,-10), lerpVector3),
            new Keyframe(1.0, new Vector3( 10, 0.5, 10), lerpVector3),
            new Keyframe(1.0, new Vector3(-10, 0.5, 10), lerpVector3),
            new Keyframe(0.0, new Vector3(-10, 0.5,-10), lerpVector3)
        )
    })
    moveAnimation.AddFrames('Colour',
    {
        ValueGetter: (entity: Entity) => entity.GetComponent(Material)!.Ambient,
        KeyFrames: new LinkedList(
            new Keyframe(1.0, new Colour4(255, 0.0, 0.0, 255), lerpColour4),
            new Keyframe(1.0, new Colour4(0.0, 255, 0.0, 255), lerpColour4),
            new Keyframe(1.0, new Colour4(0.0, 0.0, 255, 255), lerpColour4),
            new Keyframe(1.0, new Colour4(0.0, 255, 255, 255), lerpColour4),
            new Keyframe(0.0, new Colour4(255, 0.0, 0.0, 255), lerpColour4)
        )
    })
    animationPlayer.animations.set('Move', moveAnimation)
    return animationPlayer
}