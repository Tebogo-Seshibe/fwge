import { FWGEComponent } from "@fwge/core"
import { Input, KeyState } from "@fwge/input"
import { CubeCollider } from "@fwge/physics"
import { Material, StaticMesh } from "@fwge/render"
import { GameObject } from "./GameObject"

export class Platform extends GameObject
{
    @FWGEComponent('Cube')
    public mesh!: StaticMesh 
    
    @FWGEComponent()
    public input!: Input

    @FWGEComponent('PlaneMaterial')
    public material!: Material

    @FWGEComponent(new CubeCollider())
    public cubeCollider!: CubeCollider

    Start(): void
    {
        this.transform.Scale.Set(20, 0.2, 20)
        this.transform.Position.Y = -0.5
        this.input = new Input(
        {
            onInput: ({ Keyboard }, delta) =>
            {
                if (Keyboard.KeyUp !== KeyState.UP)
                {
                    this.transform.Rotation.Y += delta * 5
                }

                if (Keyboard.KeyDown !== KeyState.UP)
                {
                    this.transform.Rotation.Y -= delta * 5
                }
            }  
        })
    }
}
