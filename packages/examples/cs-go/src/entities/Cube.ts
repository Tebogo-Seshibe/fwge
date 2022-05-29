import { FWGEComponent } from "@fwge/core"
import { Material, StaticMesh } from "@fwge/render"
import { GameObject } from "./GameObject"

export class Cube extends GameObject
{
    @FWGEComponent(StaticMesh, 'Cube')
    public mesh!: StaticMesh
    
    @FWGEComponent(Material, 'BasicMaterial')
    public material!: Material
}
