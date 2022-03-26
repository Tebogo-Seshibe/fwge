import { radian, randBetween, Vector3 } from "@fwge/common"
import { Class, Component, Game, Script, ScriptSystem, System, Transform } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { Camera, Colour4, Material, Mesh, RenderSystem, Shader } from "@fwge/render"
import { FrameCounter } from "../../shared/FrameCounter"
import { Cube } from "./Cube"
import { FPSController } from "./FPSController"
import { Light } from "./Light"

export function cameraControlScene(game: Game, fpsCounter: HTMLElement)
{
    const scene = game.CreateScene()
    const meshLibrary = game.GetLibrary(Mesh)
    const materialLibrary = game.GetLibrary(Material)
    const shaderLibrary = game.GetLibrary(Shader)
    const scriptLibrary = game.GetLibrary(Script)

    scene.UseSystem(InputSystem)
      .UseSystem(ScriptSystem)
      .UseSystem(RenderSystem)
      .UseSystem(FrameCounter, fpsCounter)
    // scene.CreateEntity(Light, new Colour4(1.0, 0.0, 0.0, 1.0), radian(0))
    // scene.CreateEntity(Light, new Colour4(0.0, 1.0, 0.0, 1.0), radian(90))
    // scene.CreateEntity(Light, new Colour4(0.0, 0.0, 1.0, 1.0), radian(180))
    // scene.CreateEntity(Light, new Colour4(1.0, 0.0, 1.0, 1.0), radian(270))
    scene.CreateEntity(Light, new Colour4(1.0, 1.0, 1.0, 1.0), radian(0))
    scene.CreateEntity(Light, new Colour4(1.0, 1.0, 1.0, 1.0), radian(90))
    scene.CreateEntity(Light, new Colour4(1.0, 1.0, 1.0, 1.0), radian(180))
    scene.CreateEntity(Light, new Colour4(1.0, 1.0, 1.0, 1.0), radian(270))
    scene.CreateEntity(FPSController)
    const parent = scene.CreateEntity().AddComponent(new Transform())
    for (var i = 0; i < 5000;  ++i)
    {
        const child = scene.CreateEntity(Cube,
        {
            mesh: meshLibrary.Get('Indexed Cube'),
            shader: shaderLibrary.Get('Default'),
            script: scriptLibrary.Get('Rotator'),
            material: materialLibrary.Get('Default'),
            transform: new Transform(
            {
                position: new Vector3(
                    randBetween(-10, 10),
                    randBetween(-5, 5),
                    randBetween(-5, -25)
                )
            }),
        })
        parent.AddChild(child)
    }
    console.log(parent)
    return scene
}
