import { cubicBezier, GL, lerp, quadraticBezier, Vector3 } from "@fwge/common"
import { Game, Script, ScriptSystem, Transform } from "@fwge/core"
import { InputSystem, KeyState } from "@fwge/input"
import { PhysicsSystem } from "@fwge/physics"
import { Camera, Colour4, Material, Mesh, MeshRenderSystem, ParticleSpawner, ParticleSystem, PointLight } from "@fwge/render"
import { ColliderOutlineSystem } from "../../shared/ColliderOutlineSystem"
import { FPSController } from "../../shared/FPSController"
import { canvas, init, spherePrefab, sponza } from "./components"

export function physicsInput(game: Game)
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
    scene.UseSystem(new InputSystem())
        .UseSystem(new ScriptSystem())
        .UseSystem(new PhysicsSystem())
        .UseSystem(new MeshRenderSystem(
        {
            renderGrid: true,
            min: -100,
            max: 100,
            step: 1,
            wireframe: false
        }))
        .UseSystem(new ParticleSystem())
        .UseSystem(new ColliderOutlineSystem())

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
        radius: 50,

    }))

    
    spherePrefab.GetComponent(Material)!.Alpha = 0.5
    const particles = new ParticleSpawner(
    {
        size: 50,
        mesh: spherePrefab.GetComponent(Mesh),
        material: spherePrefab.GetComponent(Material),
        particle:
        {
            loop: true,
            lifetime: 1,
            
            
            scale: new Vector3(0.1),
            colour: new Colour4(1, 1, 1, 1),

            delay: (index: number, length: number) =>
            {
                return index / length
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
            updateScale: (_1: Vector3, outVec: Vector3, _3: number, t: number) =>
            {
                
                outVec.Set(
                    quadraticBezier(t, 0.25, 1.00, 0.00),
                    quadraticBezier(t, 0.25, 1.00, 0.00),
                    quadraticBezier(t, 0.25, 1.00, 0.00),
                )
            },
            updateColour: (_1: Colour4, outVec: Colour4, _3: number, t: number) =>
            {
                outVec.Set(
                    lerp(t, 1.0, 1.0),
                    lerp(t, 0.0, 1.0),
                    lerp(t, 0.0, 0.0),
                    lerp(t, 1.0, 1.0)
                )
            }
        }
    })

    sponza.Instance(scene)
        .GetComponent(Transform)!.Scale.Scale(3)

    // const sponzaEntity = scene.CreateEntity()
    //     .AddComponent(new Transform({ scale: [ 3, 3, 3 ]}))
    //     .AddComponent(particles)
    // for (const [obj, mtl] of sponza.pairs)
    // {
    //     sponzaEntity.AddChild(scene.CreateEntity()
    //         .AddComponent(new Transform())
    //         .AddComponent(sponza.obj[obj])
    //         .AddComponent(sponza.mtl[mtl])
    //     )
    // }

    return scene
}
