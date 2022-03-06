import { randBetween, Vector3 } from "@fwge/common"
import { Game, Script, ScriptSystem, System, Transform } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { Camera, Material, Mesh, RenderSystem, Shader } from "@fwge/render"
import { MovableEntity } from "./MovableEntity"

export function cameraControlScene(game: Game, fpsCounter: HTMLElement)
{
    const scene = game.CreateScene()
    const meshLibrary = game.GetLibrary(Mesh)
    const materialLibrary = game.GetLibrary(Material)
    const shaderLibrary = game.GetLibrary(Shader)
    const scriptLibrary = game.GetLibrary(Script)

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
        })

    scene.CreateEntity()
        .AddComponent(new Camera())
        .AddComponent(new Script(
        {
            start()
            {
                Camera.Main = this.GetComponent(Camera)!
            } 
        }))

    const parent = scene.CreateEntity(MovableEntity)
    
    for (let i = 0; i < 500; ++i)
    {
        parent.AddChild(
            scene.CreateEntity()
                .AddComponent(new Transform(
                {
                    position: new Vector3(randBetween(-10, 10),randBetween(-10, 10), randBetween(-10, 10)),
                    scale: new Vector3(randBetween(0.25, 1))
                }))
                .AddComponent(meshLibrary.Get('Indexed Cube'))
                .AddComponent(shaderLibrary.Get('Default'))
                .AddComponent(materialLibrary.Get('Default'))
                .AddComponent(scriptLibrary.Get('Spinner'))
            )
    }

    console.log(scene)
    console.log(parent)
    return scene
}
