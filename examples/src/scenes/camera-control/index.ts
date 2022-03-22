import { randBetween, Vector3 } from "@fwge/common"
import { Game, ScriptSystem, System, Transform } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { Material, Mesh, RenderSystem, Shader } from "@fwge/render"
import { Cube } from "./Cube"
import { FPSController } from "./FPSController"
import { Light } from "./Light"

export function cameraControlScene(game: Game, fpsCounter: HTMLElement)
{
    const scene = game.CreateScene()
    const meshLibrary = game.GetLibrary(Mesh)
    const materialLibrary = game.GetLibrary(Material)
    const shaderLibrary = game.GetLibrary(Shader)

    scene.RegisterSystems(
        InputSystem,
        ScriptSystem,
        RenderSystem,
        class FrameCounter extends System
        {
            override Update(delta: number): void
            {
                fpsCounter.innerText = Math.round(1000 / delta) + 'fps'
            }
        }
    )
    scene.CreateEntity(Light)
    scene.CreateEntity(FPSController)
    const parent = scene.CreateEntity().AddComponent(new Transform())
    for (var i = 0; i < 500;  ++i)
    {
        const child = scene.CreateEntity(Cube,
        {
            mesh: meshLibrary.Get('Indexed Cube'),
            shader: shaderLibrary.Get('Default'),
            material: materialLibrary.Get('Default'),
            transform: new Transform(
            {
                position: new Vector3(
                    randBetween(-10, 10),
                    randBetween(-5, 5),
                    randBetween(-5, -25)
                )
            })
        })
        parent.AddChild(child)
    }
    console.log(parent)
    return scene
}
