import { randBetween, Vector3 } from "@fwge/common"
import { FWGEComponent } from "@fwge/core"
import { CubeCollider } from "@fwge/physics"
import { Material, StaticMesh } from "@fwge/render"
import { GameObject } from "./GameObject"

export class Platform extends GameObject
{
    @FWGEComponent(StaticMesh, 'Cube')
    public mesh!: StaticMesh 
    
    @FWGEComponent(Material, 'PlaneMaterial')
    public material!: Material

    @FWGEComponent(new CubeCollider({ isStatic: false, isTrigger: false, position: Vector3.ZERO }))
    public cubeCollider!: CubeCollider

    Start(): void {
        this.transform.Scale.Set(20.0,0.2,20.0)
    }
    
}
