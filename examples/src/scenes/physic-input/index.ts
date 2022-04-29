import { cubicBezier, GL, Vector3 } from "@fwge/common"
import { Game, Script, ScriptSystem, Transform } from "@fwge/core"
import { InputSystem, KeyState } from "@fwge/input"
import { PhysicsSystem } from "@fwge/physics"
import { Camera, Colour4, MeshRenderSystem, ParticleSpawner, ParticleSystem, PointLight } from "@fwge/render"
import { ColliderOutlineSystem } from "../../shared/ColliderOutlineSystem"
import { FPSController } from "../../shared/FPSController"
import { FrameCounter } from "../../shared/FrameCounter"
import { canvas, init, sphere, sponza } from "./components"

export function physicsInput(game: Game, fpsCounter: HTMLElement)
{
    init()

    GL.enable(GL.DEPTH_TEST)
    GL.enable(GL.BLEND)
    GL.enable(GL.CULL_FACE)
    GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA)

    GL.canvas.width = 1920
    GL.canvas.height = 1080
    GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)

    let fullscreen: boolean = false
    let mouseLocked: boolean = false

    const scene = game.CreateScene()
    scene.UseSystem(InputSystem)
        .UseSystem(ScriptSystem)
        .UseSystem(PhysicsSystem)
        .UseSystem(MeshRenderSystem,
        {
            renderGrid: true,
            min: -100,
            max: 100,
            step: 1,
            wireframe: false
        })
        .UseSystem(ParticleSystem)
        .UseSystem(ColliderOutlineSystem)
        .UseSystem(FrameCounter, fpsCounter)

    const player = scene.CreateEntity(FPSController,
    {
        camera: new Camera({ fieldOfView: 50 }),
        movementSpeed: 10,
        turnSpeed: 100,
        eyeLevel: new Vector3(0, 1.8, 0),
        onInput: ({ Keyboard }) => 
        {
            if (Keyboard.KeyF5 === KeyState.DOWN)
            {
                window.location.reload()
            }


            if (Keyboard.KeyF === KeyState.PRESSED)
            {
                if (!fullscreen)
                {
                    canvas.requestFullscreen()
                }
                else
                {
                    document.exitFullscreen()
                }

                fullscreen = !fullscreen
            }

            if (Keyboard.KeyG === KeyState.PRESSED)
            {
                if (!mouseLocked)
                {
                    canvas.requestPointerLock()
                }
                else
                {
                    document.exitPointerLock()
                }

                mouseLocked = !mouseLocked
            }

        }
    })
    player.AddComponent(new Script(
    {
        start()
        {
            player.transform.Position.Set(0, 0, 5)
            Camera.Main = player.camera
        },
        update()
        {
            Camera.Main!.AspectRatio = canvas.clientWidth / canvas.clientHeight
        }
    }))
    .AddComponent(new PointLight(
    {
        colour: new Colour4(1, 1, 1, 1),
        intensity: 1,
        radius: 10,

    }))

    const particles = new ParticleSpawner(
    {
        size: 5000,
        mesh: sphere.obj[""],
        material: sphere.mtl["None"],
        particle:
        {
            loop: true,
            lifetime: 1,
            
            
            scale: new Vector3(0.1),
            colour: new Colour4(1),

            delay: (index: number, _: number) =>
            {
                return index / 125
            },
            updatePosition: (_1: Vector3, outVec: Vector3, _2: number, t: number) =>
            {                
                outVec.Set(
                    cubicBezier(t, -1, -1,  1,  1),
                    1 + cubicBezier(t, -1,  1,  1, -1),
                    cubicBezier(t,  0,  0,  0,  0)
                )
            },
            updateRotation: (_1: Vector3, _2: Vector3, _3: number, _4: number) =>
            {
                
            },
            updateScale: (_1: Vector3, _2: Vector3, _3: number, _4: number) =>
            {
                
                // outVec.Set(quadraticBezier(t, 0.25, 1.00, 0.00))
                //     quadraticBezier(t, 0.25, 1.00, 0.00),
                //     quadraticBezier(t, 0.25, 1.00, 0.00),
                //     quadraticBezier(t, 0.25, 1.00, 0.00),
                // )
            },
            updateColour: (_1: Colour4, _2: Colour4, _3: number, _4: number) =>
            {
                // outVec.Set(
                //     quadraticBezier(t, 1.0, 1.0, 0.2),
                //     quadraticBezier(t, 0.0, 1.0, 0.2),
                //     quadraticBezier(t, 0.0, 0.0, 0.2),
                //     quadraticBezier(t, 1.0, 1.0, 0.0)
                // )
            }
        }
    })
    
    const sponzaEntity = scene.CreateEntity()
        .AddComponent(new Transform({ scale: [ 3, 3, 3 ]}))
        .AddComponent(particles)
    for (const [obj, mtl] of sponza.pairs)
    {
        sponzaEntity.AddChild(scene.CreateEntity()
            .AddComponent(new Transform())
            .AddComponent(sponza.obj[obj])
            .AddComponent(sponza.mtl[mtl])
        )
    }

    return scene
}
