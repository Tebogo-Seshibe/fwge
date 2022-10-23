import { BasicLitMaterial, Material, Mesh, MeshRenderer, Renderer, RenderMode, RenderType, Shader } from "@fwge/core"
import { IInputArgs, KeyState } from "@fwge/input"
import { CubeCollider } from "@fwge/physics"
import { GameObject } from "./GameObject"

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
            shader: this.Scene.Game.GetAsset('Basic Shader', Shader)!,
            colour: [231/255, 94/255, 98/255],
            alpha: 1.0,
            renderType: RenderType.OPAQUE
        })
        this.material.Colour.Set(1.0)
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
        this.transform.Position.Y = -1
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