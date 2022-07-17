import { IInputArgs, KeyState } from "@fwge/input"
import { CubeCollider } from "@fwge/physics"
import { Material, Mesh, MeshRenderer, Renderer, StaticMesh } from "@fwge/render"
import { GameObject } from "./GameObject"

export class Platform extends GameObject
{
    material!: Material
    renderer!: Renderer<Mesh>
    cubeCollider!: CubeCollider

    override OnCreate(): void
    {
        super.OnCreate()

        this.material = this.Scene.Game.Components.get('Material')!.get('PlaneMaterial') as Material
        this.cubeCollider = new CubeCollider()
        this.renderer = new MeshRenderer(
        {
            asset: this.Scene.Game.Components.get('Mesh')!.get('Cube') as StaticMesh
        })

        this.AddComponent(this.material)
        this.AddComponent(this.cubeCollider)        
        this.AddComponent(this.renderer)

        this.transform.Scale.Set(100, 0.2, 100)
        this.transform.Position.Y = -0.1
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
