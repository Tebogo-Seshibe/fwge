import { randBetween, Vector3 } from "@fwge/common"
import { FWGEComponent } from "@fwge/core"
import { Input, KeyState } from "@fwge/input"
import { CubeCollider } from "@fwge/physics"
import { Material, StaticMesh } from "@fwge/render"
import { GameObject } from "./GameObject"

export class Cube extends GameObject
{
    @FWGEComponent(StaticMesh, 'Cube')
    public mesh!: StaticMesh
    
    @FWGEComponent(Input)
    public input!: Input

    @FWGEComponent(Material, 'CubeMaterial')
    public material!: Material

    @FWGEComponent(CubeCollider)
    public collider!: CubeCollider

    OnCreate(): void
    {
        super.OnCreate()
        
        this.material.Ambient.Set(0.3, 0.6, 0.9, 1.0)
        this.collider = new CubeCollider(
        {
            isStatic: false,
            isTrigger: false,
            position: Vector3.ZERO,
        })

        this.transform.Position.Set(randBetween(0,10) - 5, 1.0, randBetween(0,10) - 5)
        
        this.input = new Input(
        {
            onInput: ({Keyboard}, delta) =>
            {
                if (Keyboard.KeyLeft !== KeyState.UP)
                {
                    this.transform.Position.Y += delta * 0.5
                }
                if (Keyboard.KeyRight !== KeyState.UP)
                {
                    this.transform.Position.Y -= delta * 0.5
                }
            }  
        })
    }
    
}
