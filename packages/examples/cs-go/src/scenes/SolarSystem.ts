import { Vector3 } from "@fwge/common"
import { BasicLitMaterial, Game, OrthographicCamera, RenderSystem, RenderWindow, Scene, ScriptSystem, Shader, Tag, Transform } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { FPSController } from "../entities"
import { CelestialBody } from "../entities/CelestialBody"
import { FullScreen } from "../entities/FullScreen"
import { HorizontalBlur } from "../post-process/Blur/HorizontalBlur"
import { VerticalBlur } from "../post-process/Blur/VerticalBlur"
import { Invert } from "../post-process/Invert"
import { FPSCounterSystem } from "../systems/FPSCounterSystem"

export class SolarSystem extends Scene
{
    fpsCounterDiv!: HTMLDivElement
    constructor(game: Game)
    {
        super(game, {
            windows: [
                new RenderWindow({
                    resolution: [2560, 1440],
                }),
                new RenderWindow({
                    pipeline: [
                            new HorizontalBlur(2560 / 2, 1440 / 2, RenderWindow.MainPassName, 'HorizontalBlur'),
                            new VerticalBlur(2560 / 4, 1440 / 4, 'HorizontalBlur', 'VerticalBlur'),
                            new Invert(2560, 1440, RenderWindow.MainPassName, 'Invert')
                        ],
                    offset: [-0.88, 0.68],
                    scale: [0.2,0.2],
                    resolution: [2560, 1440],
                    camera: new OrthographicCamera()
                }),
            ],
            entities: [
                FullScreen,
                FPSController
            ],
            systems: [
                InputSystem,
                ScriptSystem,
                RenderSystem,
                FPSCounterSystem
            ]
        })
    }

    override Init(): void
    {
        const shader = this.Game.GetAsset('Basic Shader', Shader)!
        this.fpsCounterDiv = document.querySelector<HTMLDivElement>('#fpsCounter')!

        this.CreateEntity(CelestialBody, new Vector3(0, 0, 0), 20, 1, 0)
            .AddComponent(new BasicLitMaterial({ shader, imagemap: '/img/8k_sun.jpg' }))
            .AddComponent(new Tag('Sun'))

        const mercury = this.CreateEntity(CelestialBody, new Vector3(0, 0, 0), 5, -2.5, 1.5)
            .AddComponent(new BasicLitMaterial({ shader, imagemap: '/img/8k_mercury.jpg', }))
            .AddComponent(new Tag('Mecury'))

        const venus = this.CreateEntity(CelestialBody, new Vector3(0, 0, 0), 9.8, -2.5, 0.75)
            .AddComponent(new BasicLitMaterial({ shader, imagemap: '/img/4k_venus_atmosphere.jpg', }))
            .AddComponent(new Tag('Venus'))

        const earth = this.CreateEntity(CelestialBody, new Vector3(0, 0, -17), 10, -2.5, 1)
            .AddComponent(new BasicLitMaterial({ shader, imagemap: '/img/8k_earth_daymap.jpg' }))
            .AddComponent(new Tag('Earth'))
        const mooon = this.CreateEntity(CelestialBody, new Vector3(0, 0, -17), 0.25, -2.5, 1)
            .AddComponent(new BasicLitMaterial({ shader, imagemap: '/img/8k_moon.jpg' }))
            .AddComponent(new Tag('Moon'))

        const mars = this.CreateEntity(CelestialBody, new Vector3(0, 0, -17), 7, -2.5, 0.45)
            .AddComponent(new BasicLitMaterial({ shader, imagemap: '/img/8k_mars.jpg' }))
            .AddComponent(new Tag('Mars'))

        mercury.GetComponent(Transform)!.Position.X = 15
        venus.GetComponent(Transform)!.Position.X = 25
        earth.GetComponent(Transform)!.Position.X = 40
        earth.AddChild(mooon)
        mooon.GetComponent(Transform)!.Position.X = 0.75
        mars.GetComponent(Transform)!.Position.X = 55
        super.Init()
    }

    Update(delta: number): void
    {
        super.Update(delta)
        
        const fps = Math.round(delta === 0 ? 0 : 1 / delta)
        this.fpsCounterDiv.innerText = (fps < 10 ? '  ' + fps : fps < 100 ? ' ' + fps : fps ) + 'fps'
    }
}
