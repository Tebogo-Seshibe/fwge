import { FixedLengthArray } from "@fwge/common";
import { BasicLitMaterial, Material, Mesh, MeshRenderer, Renderer, RenderMode, RenderType, Shader } from "@fwge/core";
import { ControllerState, KeyboardState, KeyState, MouseState } from "@fwge/input";
import { CubeCollider } from "@fwge/physics";
import { GameObject } from "./GameObject";

export class Platform extends GameObject
{
    material!: Material
    renderer!: Renderer<Mesh>
    cubeCollider!: CubeCollider

    override OnCreate(): void
    {
        super.OnCreate()

        this.material = new BasicLitMaterial(
        {
            shader: this.Scene.Game.GetAsset('Basic Shader 2', Shader)!,
            colour: [231/255, 94/255, 98/255],
            alpha: 1.0,
            renderType: RenderType.OPAQUE,
            projectShadows: false
        })
        this.material.Colour.Set(1.0, 1.0, 1.0)
        this.cubeCollider = new CubeCollider({ isStatic: true })
        this.renderer = new MeshRenderer(
        {
            asset: this.Scene.Game.GetAsset('Cube', Mesh)!,
            renderMode: RenderMode.FACE
        })

        this.AddComponent(this.material)
        this.AddComponent(this.cubeCollider)        
        this.AddComponent(this.renderer)

        this.transform.Scale.Set(100, 1, 100)
    }

    OnInput(delta: number, Keyboard: KeyboardState, _Mouse: MouseState, _Controllers: FixedLengthArray<ControllerState, 4>)
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