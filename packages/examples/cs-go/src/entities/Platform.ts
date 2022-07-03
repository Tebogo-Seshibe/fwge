import { IInputArgs, KeyState } from "@fwge/input"
import { CubeCollider } from "@fwge/physics"
import { Material, StaticMesh } from "@fwge/render"
import { GameObject } from "./GameObject"

export class Platform extends GameObject
{
    public mesh!: StaticMesh
    public material!: Material
    public cubeCollider!: CubeCollider

    override OnCreate(): void
    {
        super.OnCreate()

        this.mesh = this.Scene.Game.Components.get('Mesh')!.get('Cube') as StaticMesh
        this.material = this.Scene.Game.Components.get('Material')!.get('PlaneMaterial') as Material
        this.cubeCollider = new CubeCollider()

        this.AddComponent(this.mesh)
        this.AddComponent(this.material)
        this.AddComponent(this.cubeCollider)
    }
    
    override OnStart(): void
    {
        this.transform.Scale.Set(20, 0.2, 20)
        this.transform.Position.Y = -0.5
    }
    
    override OnInput({ Keyboard }: IInputArgs, delta: number): void
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
}
