import { FixedLengthArray, randBetween } from "@fwge/common";
import { BasicLitMaterial, Material, Mesh, MeshRenderer, RenderMode, RenderType, Renderer, Shader, StaticMesh } from "@fwge/core";
import { ControllerState, KeyState, KeyboardState, MouseState } from "@fwge/input";
import { GameObject } from "./GameObject";

export class Cube extends GameObject
{
    turnSpeed: number = randBetween(15, 275)
    material!: Material
    renderer!: Renderer<StaticMesh>
    // collider!: Collider

    Init(): void
    {
        super.Init()

        const rand = randBetween(2,5)
        this.transform.Position.Set((Math.random() * 100) - 50, randBetween(1, 10), (Math.random() * 100) - 50)
        this.transform.Scale.Set(rand, rand, rand)

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

        // this.collider = new SphereCollider({ radius: 0.5 })

        this.AddComponent(this.material)
        // this.AddComponent(this.collider)
        this.AddComponent(this.renderer)
    }

    override Update(delta: number)
    {
        this.transform.Rotation.X += delta * this.turnSpeed * 2
        this.transform.Rotation.Y += delta * this.turnSpeed
        this.transform.Rotation.Z += delta * this.turnSpeed / 2
    }

    override OnInput(delta: number, keyboard: KeyboardState, mouse: MouseState, controllers: Readonly<FixedLengthArray<ControllerState, 4>>)
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
