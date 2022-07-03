import { randBetween } from "@fwge/common"
import { IInputArgs, KeyState } from "@fwge/input"
import { Collider, CubeCollider } from "@fwge/physics"
import { Material, Mesh, ShaderAsset, StaticMesh } from "@fwge/render"
import { GameObject } from "./GameObject"

export class Cube extends GameObject
{
    turnSpeed!: number
    mesh!: StaticMesh
    material!: Material
    collider: Collider = new CubeCollider()

    OnCreate(): void
    {
        super.OnCreate()

        this.mesh = this
            .Scene
            .Game
            .Components
            .get(Mesh.name)!
            .get('Cube')! as StaticMesh

        this.material = new Material(
        {
            ambient: [
                Math.random() * 255,
                Math.random() * 255,
                Math.random() * 255,
                255
            ],
            shader: this.Scene.Game.Assets.get(ShaderAsset.name)!.get('Basic Shader')! as ShaderAsset
        })
        this.transform.Position.Set((Math.random() * 20) - 10, 2.25, (Math.random() * 20) - 10)

        this.AddComponent(this.mesh)
        this.AddComponent(this.material)
        this.AddComponent(this.collider)

        this.transform.Scale.Set(1,5,1)
        this.turnSpeed = randBetween(15, 45)
    }
    
    override OnUpdate(delta: number)
    {
        this.transform.Rotation.Y += delta * this.turnSpeed
    }
    
    override OnInput({ Keyboard }: IInputArgs, delta: number): void
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
}
