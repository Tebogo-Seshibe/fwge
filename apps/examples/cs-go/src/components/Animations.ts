import { Animation, AnimationPlayer, Keyframe, lerpColour3, lerpVector3 } from "@fwge/animation";
import { Colour3, LinkedList, Vector3 } from "@fwge/common";
import { Material, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
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
        ValueGetter: (entity: Entity) => entity.GetComponent(Material)!.Colour,
        KeyFrames: new LinkedList(
            new Keyframe(1.0, new Colour3(1.0, 0.0, 0.0), lerpColour3),
            new Keyframe(1.0, new Colour3(0.0, 1.0, 0.0), lerpColour3),
            new Keyframe(1.0, new Colour3(0.0, 0.0, 1.0), lerpColour3),
            new Keyframe(1.0, new Colour3(0.0, 1.0, 1.0), lerpColour3),
            new Keyframe(0.0, new Colour3(1.0, 0.0, 0.0), lerpColour3)
        )
    })
    animationPlayer.animations.set('Move', moveAnimation)
    return animationPlayer
}