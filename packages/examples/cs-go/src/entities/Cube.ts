import { randBetween } from "@fwge/common"
import { IInputArgs, KeyState } from "@fwge/input"
import { Collider, CubeCollider } from "@fwge/physics"
import { Material, Mesh, MeshRenderer, Renderer, RenderMode, ShaderAsset, StaticMesh } from "@fwge/render"
import { GameObject } from "./GameObject"

export class Cube extends GameObject
{
    turnSpeed: number = randBetween(15, 275)
    material!: Material
    renderer!: Renderer<StaticMesh>
    collider: Collider = new CubeCollider()

    OnCreate(): void
    {
        super.OnCreate()
        
        const rand = randBetween(1,5)
        this.transform.Position.Set((Math.random() * 100) - 50, rand / 2, (Math.random() * 100) - 50)
        this.transform.Scale.Set(1, rand, 1)

        this.material = new Material(
        {
            ambient: [ Math.random(), Math.random(), Math.random(), 1 ],
            shader: this.Scene.Game.GetAsset('Basic Shader', ShaderAsset)!
        })
        //this.Scene.Game.GetComponent('CubeMaterial', Material)!

        this.renderer = new MeshRenderer(
        {
            asset: this.Scene.Game.GetAsset('OBJ Cube', Mesh)!,
            renderMode: RenderMode.FACE
        })
        
        this.AddComponent(this.material)
        this.AddComponent(this.collider)
        this.AddComponent(this.renderer)
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
