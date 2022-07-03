import { Entity, FWGEComponent, FWGEGame, FWGEScene, Game, Scene, Transform } from '@fwge/core'
import { MeshRenderSystem } from '@fwge/render'

export class EditorCamera extends Entity
{
    @FWGEComponent()
    transform: Transform = new Transform()
}

@FWGEScene({
    entities: [EditorCamera],
    systems: [
        MeshRenderSystem,
    ]
})
export class EditorScene extends Scene
{

}

@FWGEGame({
    scenes: [ EditorScene ],
    library: []
})
export class EditorGame extends Game
{

}