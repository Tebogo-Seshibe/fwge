import { Game, ScriptSystem, System } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { Material, Mesh, RenderSystem, Shader } from "@fwge/render"
import { FrameCounter } from "../../shared/FrameCounter"
import { CameraController } from "./CameraController"
import { CharacterController } from "./CharacterController"

export function sidescrollerScene(game: Game, fpsCounter: HTMLElement)
{
    const scene = game.CreateScene()

    const meshLibrary = game.GetLibrary(Mesh)
    const materialLibrary = game.GetLibrary(Material)
    const shaderLibrary = game.GetLibrary(Shader)

    scene.UseSystem(InputSystem)
        .UseSystem(ScriptSystem)
        .UseSystem(RenderSystem)
        .UseSystem(FrameCounter, fpsCounter)

    scene.CreateEntity(CameraController)
    scene.CreateEntity(CharacterController, 
    {
        mesh: meshLibrary.Get('Indexed Cube'),
        material: materialLibrary.Get('Default'),
        shader: shaderLibrary.Get('Default')
    })
    
    return scene
}

