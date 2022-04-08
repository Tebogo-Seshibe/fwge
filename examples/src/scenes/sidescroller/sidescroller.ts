import { Game } from "@fwge/core"

export function sidescrollerScene(game: Game, fpsCounter: HTMLElement)
{
    const scene = game.CreateScene()

    // const meshLibrary = game.GetLibrary(Mesh)
    // const materialLibrary = game.GetLibrary(Material)
    // const shaderLibrary = game.GetLibrary(Shader)

    // scene.UseSystem(InputSystem)
    //     .UseSystem(ScriptSystem)
    //     .UseSystem(RenderSystem)
    //     .UseSystem(FrameCounter, fpsCounter)

    // scene.CreateEntity(CameraController)
    // scene.CreateEntity(CharacterController, 
    // {
    //     mesh: meshLibrary.Get('Indexed Cube'),
    //     material: materialLibrary.Get('Default'),
    //     shader: shaderLibrary.Get('Default')
    // })
    
    return scene
}

