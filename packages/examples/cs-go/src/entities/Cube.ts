import { randBetween, Vector3 } from "@fwge/common"
import { FWGEComponent } from "@fwge/core"
import { CubeCollider, SphereCollider } from "@fwge/physics"
import { Material, StaticMesh } from "@fwge/render"
import { GameObject } from "./GameObject"

export class Cube extends GameObject
{
    @FWGEComponent(StaticMesh, 'Cube')
    public mesh!: StaticMesh
    
    @FWGEComponent(Material, 'CubeMaterial')
    public material!: Material

    // @FWGEComponent(SphereCollider)
    // public sphereCollider!: SphereCollider

    @FWGEComponent(CubeCollider)
    public cubeCollider!: CubeCollider

    OnCreate(): void {
        super.OnCreate()
        
        this.material.Ambient.Set(0.3,0.6,0.9,1.0)
        // this.sphereCollider = new SphereCollider({ isStatic: false, radius: 0.5, isTrigger: false, position: Vector3.ZERO })
        this.cubeCollider = new CubeCollider(
        {
            isStatic: false,
            isTrigger: false,
            position: Vector3.ZERO,
            onCollision: function(other)
            {
                console.log(this.Id, other.Id)
            }
        })
        this.transform.Position.Y = 1.5
        this.transform.Position.X = randBetween(0, 10) -  5
        this.transform.Position.Z = randBetween(0, 10) -  5
    }
    
}
