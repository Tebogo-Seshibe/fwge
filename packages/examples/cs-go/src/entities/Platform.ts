import { FWGEComponent } from "@fwge/core"
import { Input, KeyState } from "@fwge/input"
import { CubeCollider } from "@fwge/physics"
import { Material, StaticMesh } from "@fwge/render"
import { GameObject } from "./GameObject"

export class Platform extends GameObject
{
    @FWGEComponent(StaticMesh, 'Cube')
    public mesh!: StaticMesh 
    
    @FWGEComponent(Input)
    public input!: Input

    @FWGEComponent(Material, 'PlaneMaterial')
    public material!: Material

    @FWGEComponent(new CubeCollider())
    public cubeCollider!: CubeCollider

    Start(): void
    {
        // this.transform.Position.X = 20
        this.transform.Scale.Set(20.0, 0.2, 20.0)
        this.input = new Input(
        {
            onInput: ({Keyboard}, delta) =>
            {
                if (Keyboard.KeyUp !== KeyState.UP)
                {
                    this.transform.Rotation.Y += delta *5
                }
                if (Keyboard.KeyDown !== KeyState.UP)
                {
                    this.transform.Rotation.Y -= delta *5
                }
            }  
        })
    }
}
