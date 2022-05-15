import { GL, lerp, radian, remap, Vector3 } from "@fwge/common"
import { Class, Component, Game, Script, ScriptSystem, Transform } from "@fwge/core"
import { InputSystem, KeyState } from "@fwge/input"
import { TypeMappers } from "@fwge/io"
import { PhysicsSystem, RigidBody } from "@fwge/physics"
import { Camera, Colour4, Material, Mesh, MeshRenderSystem, ParticleSpawner, ParticleSystem, PointLight, StaticMesh } from "@fwge/render"
import { ColliderOutlineSystem } from "../../shared/ColliderOutlineSystem"
import { FPSController } from "../../shared/FPSController"
import { FrameCounter } from "../../shared/FrameCounter"
import { GameObject } from "../../shared/GameObject"
import { IsComponent } from "../../shared/IsComponent"
import { basicShader, canvas, cubeUVMaterial, init, sphere } from "./components"


TypeMappers.set('FPSController', FPSController)
TypeMappers.set('ColliderOutlineSystem', ColliderOutlineSystem)

export function physicsInput(game: Game, frameCounter: HTMLElement)
{
    init()

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
            min: -100,
            max: 100,
            step: 1,
            renderGrid: true,
            wireframe: false
        }))
        .UseSystem(new ParticleSystem())
        .UseSystem(new ColliderOutlineSystem())
        .UseSystem(new FrameCounter(frameCounter))


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
    // .AddComponent(new PointLight(
    // {
    //     colour: new Colour4(1, 1, 1, 1),
    //     intensity: 1,
    //     radius: 100,
    // }))

    const mesh = new StaticMesh({
        position: [
            [-0.5,  0.5, 0.0 ],
            [-0.5, -0.5, 0.0 ],
            [ 0.5, -0.5, 0.0 ],
            [ 0.5,  0.5, 0.0 ],
        ],
        normal: [
            [ 0, 0, -1 ],
            [ 0, 0, -1 ],
            [ 0, 0, -1 ],
            [ 0, 0, -1 ],
        ],
        colour: [
            [ 1.0, 1.0, 1.0, 1.0 ],
            [ 1.0, 1.0, 1.0, 1.0 ],
            [ 1.0, 1.0, 1.0, 1.0 ],
            [ 1.0, 1.0, 1.0, 1.0 ],
        ],
        uv: [
            [ 0.0, 1.0 ],
            [ 0.0, 0.0 ],
            [ 1.0, 0.0 ],
            [ 1.0, 1.0 ],
        ],
        index: [ 0, 1, 2, 0, 2, 3 ]
    })
    const mat = new Material({ imagemap: '/img/fire.png' })
    mat.Shader = basicShader

    const shrink = new ParticleSpawner(
    {
        size: 100 * 4,
        mesh: mesh, //sphere.GetComponent(Mesh)!,
        material: mat,
        particle:
        {
            loop: false,
            lifetime: 1,

            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0),
            scale: new Vector3(0.1),
            colour: new Colour4(0, 0, 0, 0),

            delay: (index: number, length: number) =>
            {
                return Math.ceil((index + 1) / 100) * 0.25
            },
            updatePosition: (_1: Vector3, outVec: Vector3, index: number, t: number) =>
            {
                const proportion = (index / 100) - Math.floor(index / 100)
                const x = Math.cos(radian(360 * proportion))
                const y = Math.sin(radian(360 * proportion))
                outVec.Set(lerp(t, x, 0), lerp(t, y, 0), 0)
            },
            updateRotation: (_in: Vector3, outVec: Vector3, index: number, _t: number) =>
            {
                const y = Camera.Main?.Owner?.Parent?.GetComponent(Transform)?.Rotation.Y ?? 0
                outVec.Set(0, (index % 3 === 0 ? 180 : 0) + y, index / 10 * 360)
            },
            updateScale: (_1: Vector3, outVec: Vector3, _2: number, t: number) =>
            {
                // outVec.Set(lerp(t, 0.25, 1.00))
            },
            updateColour: (_1: Colour4, outVec: Colour4, _3: number, t: number) =>
            {
                const t1 = remap(t, 0.00, 0.25, 0, 1)
                const t2 = remap(t, 0.25, 0.50, 0, 1)
                const t3 = remap(t, 0.50, 0.75, 0, 1)
                const t4 = remap(t, 0.75, 1.00, 0, 1)

                if (t < 0.25)
                {
                    outVec.Set(1, lerp(t1, 0, 1), lerp(t1, 0, 0), lerp(t1, 0, 0.75))
                }
                else if (t < 0.5)
                {
                    outVec.Set(1, 1, 1, lerp(t2, 0.75, 1.0))
                }
                else if (t < 0.75)
                {
                    outVec.Set(lerp(t3, 1, 0.5), lerp(t3, 1, 0.5), lerp(t3, 1, 0.5), lerp(t3, 1, 0.5))
                }
                else
                {
                    outVec.Set(0.5, 0.5, 0.5, lerp(t4, 0.5, 0.0))
                }
            }
        }
    })

    // const particles = new ParticleSpawner(
    // {
    //     size: 25,
    //     mesh: mesh,
    //     material: mat,
    //     particle:
    //     {
    //         loop: true,
    //         lifetime: 1,

    //         position: new Vector3(0, 0, 0),
    //         rotation: new Vector3(0),
    //         scale: new Vector3(0.25),
    //         colour: new Colour4(1, 0, 1, 1),

    //         delay: (index: number, length: number) =>
    //         {
    //             return index / length
    //         },
    //         updatePosition: (_1: Vector3, outVec: Vector3, _2: number, t: number) =>
    //         {
    //             outVec.Set(0, lerp(t, 0, 1), 0)
    //         },
    //         updateRotation: (_in: Vector3, outVec: Vector3, index: number, _t: number) =>
    //         {
    //             const y = Camera.Main?.Owner?.Parent?.GetComponent(Transform)?.Rotation.Y ?? 0
    //             outVec.Set(0, (index % 3 === 0 ? 180 : 0) + y, index / 10 * 360)
    //         },
    //         updateScale: (_1: Vector3, outVec: Vector3, _2: number, t: number) =>
    //         {
    //             outVec.Set(lerp(t, 0.25, 1.00))
    //         },
    //         updateColour: (_1: Colour4, outVec: Colour4, _3: number, t: number) =>
    //         {
    //             const t1 = remap(t, 0.00, 0.25, 0, 1)
    //             const t2 = remap(t, 0.25, 0.50, 0, 1)
    //             const t3 = remap(t, 0.50, 0.75, 0, 1)
    //             const t4 = remap(t, 0.75, 1.00, 0, 1)

    //             if (t < 0.25)
    //             {
    //                 outVec.Set(1, lerp(t1, 0, 1), lerp(t1, 0, 0), lerp(t1, 0.25, 0.75))
    //             }
    //             else if (t < 0.5)
    //             {
    //                 outVec.Set(1, 1, 1, lerp(t2, 0.75, 1.0))
    //             }
    //             else if (t < 0.75)
    //             {
    //                 outVec.Set(lerp(t3, 1, 0), lerp(t3, 1, 0), lerp(t3, 1, 0), lerp(t3, 1, 0.5))
    //             }
    //             else
    //             {
    //                 outVec.Set(0, 0, 0, lerp(t4, 0.5, 1.0))
    //             }
    //         }
    //     }
    // })

    // class Int32 extends Float32Array, Number{
    //     constructor() { super([0]) }
    // }

    interface ObjectArgs
    {
        requirements?: Array<Class<Component>>
    }
    function Objecst(config?: ObjectArgs): ClassDecorator
    {
        return <TFunction extends Function>(target: TFunction, ...rest: any[]): void =>
        {
            
        }
    }
    

    class ParticleSources extends GameObject
    {
        private x: number = 0

        @IsComponent(PointLight, { colour: new Colour4(1,0,0,1), radius: 2 })
        private pointLight!: PointLight

        @IsComponent(RigidBody)
        private rigidBody!: RigidBody

        @IsComponent(sphere.GetComponent(Mesh)!)
        private mesh!: Mesh

        @IsComponent(cubeUVMaterial)
        private material!: Material

        override OnCreate()
        {
            super.OnCreate()
            this.pointLight = new PointLight(
            {
                colour: new Colour4(1, 0, 0, 1),
                intensity: 1,
                radius: 2
            })
            this.transform.Position.Set(0, 2, 0)
            this.transform.Scale.Scale(3)
        }

        override Start(): void
        {
            console.log(this)
        }

        override Update(delta: number): void
        {         
            this.x += delta
            this.pointLight.Radius = lerp(Math.abs(Math.sin(this.x)), 10, 10.5)
        }
    }

    console.log(
        scene.CreateEntity(ParticleSources)
    )

    return scene
}
