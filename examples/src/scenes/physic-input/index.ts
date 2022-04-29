import { Equation, GL, lerp, radian, Vector2, Vector3 } from "@fwge/common"
import { Game, Scene, Script, ScriptSystem, System, Transform } from "@fwge/core"
import { InputSystem, KeyState } from "@fwge/input"
import { MeshCollider, PhysicsSystem } from "@fwge/physics"
import { Camera, Colour4, MeshRenderSystem, ParticleSpawner, ParticleSystem, PointLight } from "@fwge/render"
import { ColliderOutlineSystem } from "../../shared/ColliderOutlineSystem"
import { FPSController } from "../../shared/FPSController"
import { FrameCounter } from "../../shared/FrameCounter"
import { base, canvas, cubeMesh, init, planeMaterial, planeMesh, prefabs, simpleCubeMeshOutline, simpleCubeMeshVerts, sphere, spinnerScript, sponza } from "./components"

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
    const pointLight = scene.CreateEntity()
    .AddComponent(new Transform({ position: [0,1,0] } ))
    // .AddComponent(
    //     new PointLight(
    //     {
    //         colour: new Colour4(1,1,1,1),
    //         intensity: 1,
    //         radius: 5,

    //     })
    // )
    const sponzaEntity = scene.CreateEntity()

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
        



        
    player.transform.Position.Set(0, 0.5, 5)
    player.AddComponent(new Script(
    {
        start()
        {
            Camera.Main = player.camera
        },
        update()
        {
            Camera.Main!.AspectRatio = canvas.clientWidth / canvas.clientHeight
        }
    }))
    .AddComponent(
        new PointLight(
        {
            colour: new Colour4(1,1,1,1),
            intensity: 1,
            radius: 10,

        })
    )
    // .AddChild(pointLight)


    let line: Equation = (x: number) => x
    let x2: Equation = (x: number) => x**2
    let quadraticBezier: Equation = (t: number, a: number, b: number, c: number) =>
    {
        const ab = lerp(a, b, t)
        const bc = lerp(b, c, t)
        return lerp(ab, bc, t)
    }    
    let cubicBezier: Equation = (t: number, a: number, b: number, c: number, d: number) =>
    {
        const ab = lerp(a, b, t)
        const bc = lerp(b, c, t)
        const cd = lerp(c, d, t)

        return quadraticBezier(ab, bc, cd, t)
    }
    
    const particles = new ParticleSpawner(
    {
        size: 100,
        mesh: sphere.obj[""],
        material: sphere.mtl["None"],
        particle:
        {
            loop: true,
            lifetime: 1,
            
            
            scale: new Vector3(1),
            colour: new Colour4(1),

            delay: (index: number, length: number) =>
            {
                return (index / length)
            },
            updatePosition: (t: number, _: Vector3, index: number) =>
            {                
                return new Vector3(0, lerp(0, 3, t), 0)
            },
            updateRotation: (t: number, _: Vector3, index: number) =>
            {
                return _
            },
            updateScale: (t: number, _: Vector3, index: number) =>
            {
                return new Vector3(quadraticBezier(t, 0.25, 1.00, 0.00))
                //     quadraticBezier(t, 0.25, 1.00, 0.00),
                //     quadraticBezier(t, 0.25, 1.00, 0.00),
                //     quadraticBezier(t, 0.25, 1.00, 0.00),
                // )
            },
            updateColour: (t: number, _: Colour4, index: number) =>
            {
                return new Colour4(
                    quadraticBezier(t, 1.0, 1.0, 0.2),
                    quadraticBezier(t, 0.0, 1.0, 0.2),
                    quadraticBezier(t, 0.0, 0.0, 0.2),
                    quadraticBezier(t, 1.0, 1.0, 0.0)
                )
            }
        }
    })

    sponzaEntity
    .AddComponent(new Transform())
        .AddComponent(particles)
    sponzaEntity.AddComponent(new Transform({ scale: [ 3, 3, 3 ]}))
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
