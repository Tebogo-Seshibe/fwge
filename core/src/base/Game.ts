import { setContext } from "@fwge/common"
import { Component, SharedComponent } from "../ecs/Component"
import { Class, Registry, SceneId } from "../ecs/Registry"
import { Library } from "./Library"
import { Prefab } from "./Prefab"
import { Scene } from "./Scene"

interface IGame
{
    canvas: HTMLCanvasElement
    components: Class<Component>[]
    libraries: Class<SharedComponent>[]
}

export class Game
{
    private scenes: Scene[] = []
    private libraries: Map<Class<SharedComponent>, Library<SharedComponent>> = new Map()
    private prefabs: Map<string, Prefab> = new Map()
    private activeScene?: Scene
    private currTick: number = -1
    private prevTick: number = -1
    private tickId?: number
    private canvas: HTMLCanvasElement
    private registry: Registry = new Registry()

    constructor(args: IGame)
    {
        const gl = args.canvas.getContext('webgl')
        if (!gl)
        {
            throw new Error('No WebGL context could be generated!')
        }

        this.canvas = args.canvas
        setContext(gl)

        for (const type of args.components)
        {
            this.registry.registerComponentType(type)
        }

        for (const type of args.libraries)
        {
            this.CreateLibrary(type)
        }
    }

    //#region Controls
    Start(): void
    {
        if (this.scenes.length === 0)
        {
            console.warn('No scenes to run')
        }

        if (!this.activeScene)
        {
            this.activeScene = this.scenes.first()
        }

        this.currTick = this.prevTick = Date.now()

        this.activeScene?.Init()
        this.activeScene?.Start()
        this.tickId = window.requestAnimationFrame(() => this.Update(0))
    }
    
    private Update(delta: number): void
    {
        this.activeScene?.Update(delta)
        
        this.prevTick = this.currTick
        this.currTick = Date.now()
        this.tickId = window.requestAnimationFrame(() => this.Update(this.currTick - this.prevTick))
    }
    
    Stop(): void
    Stop(delay: { hours?: number, minutes?: number, seconds?: number, milliseconds?: number }): void
    Stop(arg: { hours?: number, minutes?: number, seconds?: number, milliseconds?: number } = {}): void
    {        
        const delay = (arg.hours ?? 0) * 3_600_000
            + (arg.minutes ?? 0) * 60_000
            + (arg.seconds ?? 0) * 1_000
            + (arg.milliseconds ?? 0)

        setTimeout(() =>
        {
            if (this.tickId !== undefined)
            {
                window.cancelAnimationFrame(this.tickId)
                this.activeScene?.Stop()

                this.tickId = undefined
            }
        }, delay)
    }
    //#endregion

    //#region Scene
    CreateScene()
    {
        const scene = new Scene(this.registry)
        this.scenes.push(scene)
        scene.SetContext(this.canvas)

        return scene
    }

    GetScene(sceneId: SceneId): Scene | undefined
    {
        return this.scenes.find(scene => scene.Id === sceneId)
    }

    RemoveScene(index: SceneId): void
    RemoveScene(scene: Scene): void
    RemoveScene(arg: Scene | SceneId): void
    {
        const sceneId = typeof arg === 'number'
            ? arg
            : arg.Id

        this.scenes = this.scenes.filter(scene =>
        {
            const isRemove = scene.Id !== sceneId
            if (isRemove)
            {
                scene.SetContext()
            }
            return isRemove
        })
    }

    SetActiveScene(index: SceneId): void
    SetActiveScene(scene: Scene): void
    SetActiveScene(arg: Scene | SceneId): void
    {        
        const scene = typeof arg === 'number'
            ? this.scenes.find(x => x.Id === arg)
            : this.scenes.find(x => x.Id === arg.Id)

        if (scene)
        {
            this.activeScene = scene
        }
    }
    //#endregion

    //#region Library
    CreateLibrary<T extends SharedComponent>(type: Class<T>): Library<T>
    {
        if (!this.libraries.has(type))
        {
            this.libraries.set(type, new Library(type, this.registry))
        }

        return this.libraries.get(type) as Library<T>
    }

    GetLibrary<T extends SharedComponent>(type: Class<T>): Library<T>
    {
        const library = this.libraries.get(type)

        if (!library)
        {
            throw new Error(`Library not created`)
        }
        
        return library as Library<T>
    }
    //#endregion
    
    //#region Prefab
    CreatePrefab(name: string): Prefab
    {
        if (this.prefabs.has(name))
        {
            throw new Error(`Name ${ name } already exists`)
        }

        const prefab = new Prefab()
        this.prefabs.set(name, prefab)
        return prefab
    }

    GetPrefab(name: string): Prefab | undefined
    {
        return this.prefabs.get(name)
    }
    //#endregion

    static Save(game: Game): void
    {

    }

    static Load(): void
    {
        
    }
}
