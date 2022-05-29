import { AnimationSystem } from "@fwge/animation"
import { FWGEScene, Scene } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { MeshRenderSystem } from "@fwge/render"
import { FullScreen } from "../entities/FullScreen"

@FWGEScene(
{
    entities: [
        FullScreen
    ],
    systems: [
        InputSystem,
        MeshRenderSystem,
        AnimationSystem,
    ]
})
export class LoadingScreen extends Scene { }
