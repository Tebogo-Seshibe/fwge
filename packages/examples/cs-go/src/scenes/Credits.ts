import { AnimationSystem } from "@fwge/animation"
import { FWGEScene, Scene } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { MeshRenderSystem } from "@fwge/render"

@FWGEScene(
{
    entities: [],
    systems: [
        InputSystem,
        MeshRenderSystem,
        AnimationSystem,
    ]
})
export class Credits extends Scene { }
