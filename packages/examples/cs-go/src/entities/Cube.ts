import { randBetween } from "@fwge/common"
import { BasicLitMaterial, Material, Mesh, MeshRenderer, Renderer, RenderMode, RenderType, Shader, StaticMesh } from "@fwge/core"
import { IInputArgs, KeyState } from "@fwge/input"
import { Collider, SphereCollider } from "@fwge/physics"
import { GameObject } from "./GameObject"

export class Cube extends GameObject
{
    turnSpeed: number = randBetween(15, 275)
    material!: Material
    renderer!: Renderer<StaticMesh>
    collider!: Collider

    OnCreate(): void
    {
        super.OnCreate()

        const rand = randBetween(2,5)
        this.transform.Position.Set((Math.random() * 100) - 50, randBetween(1, 10), (Math.random() * 100) - 50)
        this.transform.Scale.Set(rand)

        // this.transform.Scale.Set(5)
        // this.transform.Position.Set(0, 5, 0)
        this.material = new BasicLitMaterial(
        {
            shininess: 32,
            colour: [ Math.random(), Math.random(), Math.random() ],
            shader: this.Scene.Game.GetAsset('Basic Shader', Shader)!,
            renderType: RenderType.TRANSPARENT,
            alpha: 0.5
        })

        this.renderer = new MeshRenderer(
        {
            asset: this.Scene.Game.GetAsset('OBJ Sphere', Mesh)!,
            renderMode: RenderMode.FACE
        })

        this.collider = new SphereCollider({ radius: 0.5 })

        this.AddComponent(this.material)
        this.AddComponent(this.collider)
        this.AddComponent(this.renderer)
    }

    override OnUpdate(delta: number)
    {
        this.transform.Rotation.X += delta * this.turnSpeed * 2
        this.transform.Rotation.Y += delta * this.turnSpeed
        this.transform.Rotation.Z += delta * this.turnSpeed / 2
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
