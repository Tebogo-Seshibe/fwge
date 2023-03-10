import { Vector3 } from "@fwge/common"
import { Mesh, MeshRenderer, Renderer, RenderMode, Scene, StaticMesh } from "@fwge/core"
import { GameObject } from "./GameObject"

export class CelestialBody extends GameObject
{
    orbit: number = 1
    turnSpeed!: number
    renderer!: Renderer<StaticMesh>
    parent?: GameObject

    constructor(scene: Scene, tilt: Vector3, radius: number, rotationSpeed: number, orbit: number, parent?: GameObject)
    {
        super(scene)

        this.orbit = orbit
        this.turnSpeed = rotationSpeed
        this.parent = parent
        this.transform.Scale.Set(radius, radius, radius)
        this.transform.Rotation.Set(tilt)
    }

    override OnCreate()
    {
        this.renderer = new MeshRenderer(
        {
            asset: this.Scene.Game.GetAsset('OBJ Sphere', Mesh)!,
            renderMode: RenderMode.FACE
        })
        this.AddComponent(this.renderer)
    }
    
    override OnUpdate(delta: number)
    {
        // if (this.parent)
        // {
        //     this.transform.RotateAround(this.parent.transform, [0,1,0], this.orbit * delta * 10)
        // }
        // else
        // {
        //     this.transform.RotateAroundAxis(0,1,0, this.orbit * delta * 10)
        // }
        this.transform.Rotation.Y += delta * this.turnSpeed * 10
    }
}
