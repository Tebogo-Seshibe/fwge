import { Game, ScriptSystem, System } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { Material, Mesh, RenderSystem, Shader } from "@fwge/render"
import { CameraController } from "./CameraController"
import { CharacterController } from "./CharacterController"

export function sidescrollerScene(game: Game, fpsCounter: HTMLElement)
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
        })

    scene.CreateEntity(CameraController)
    scene.CreateEntity(CharacterController, 
    {
        mesh: meshLibrary.Get('Indexed Cube'),
        material: materialLibrary.Get('Default'),
        shader: shaderLibrary.Get('Default')
    })
    
    return scene
}

