import { setContext } from "@fwge/common"
import { Component, SharedComponent } from "../ecs/Component"
import { Class, Registry, SceneId } from "../ecs/Registry"
import { Library } from "./Library"
import { Prefab } from "./Prefab"
import { Scene } from "./Scene"

interface IGame
{
    canvas?: HTMLCanvasElement
    components: Class<Component>[]
    libraries: Class<SharedComponent>[]
}

export class Game
{
    private _scenes: Scene[] = []
    private _libraries: Map<Class<SharedComponent>, Library<SharedComponent>> = new Map()
    private _prefabs: Map<string, Prefab> = new Map()
    private _activeScene?: Scene
    private _currTick: number = -1
    private _prevTick: number = -1
    private _tickId?: number
    private _canvas: HTMLCanvasElement
    private _registry: Registry = new Registry()

    constructor(args: IGame)
    {
        if (!args.canvas)
        {
            args.canvas = document.createElement('canvas')
            document.body.appendChild(args.canvas)
        }
            
        const gl = args.canvas.getContext('webgl2')
        if (!gl)
        {
            throw new Error('No WebGL context could be generated!')
        }

        this._canvas = args.canvas
        setContext(gl)

        for (const type of args.components)
        {
            this._registry.registerComponentType(type)
        }

        for (const type of args.libraries)
        {
            this.CreateLibrary(type)
        }
    }

    //#region Controls
    Start(): void
    {
        if (this._scenes.length === 0)
        {
            console.warn('No scenes to run')
        }

        if (!this._activeScene)
        {
            this._activeScene = this._scenes.first()
        }

        this._currTick = this._prevTick = performance.now()

        this._activeScene?.Init()
        this._activeScene?.Start()
        this._tickId = window.requestAnimationFrame(() => this.Update(0))
    }
    
    private Update(delta: number): void
    {
        this._activeScene?.Update(delta)
        
        this._prevTick = this._currTick
        this._currTick = performance.now()
        this._tickId = window.requestAnimationFrame(() => this.Update(this._currTick - this._prevTick))
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
            if (this._tickId !== undefined)
            {
                window.cancelAnimationFrame(this._tickId)
                this._activeScene?.Stop()

                this._tickId = undefined
            }
        }, delay)
    }
    //#endregion

    //#region Scene
    CreateScene()
    {
        const scene = new Scene(this._registry)
        this._scenes.push(scene)
        scene.SetContext(this._canvas)

        return scene
    }

    GetScene(sceneId: SceneId): Scene | undefined
    {
        return this._scenes.find(scene => scene.Id === sceneId)
    }

    RemoveScene(index: SceneId): void
    RemoveScene(scene: Scene): void
    RemoveScene(arg: Scene | SceneId): void
    {
        const sceneId = typeof arg === 'number'
            ? arg
            : arg.Id

        this._scenes = this._scenes.filter(scene =>
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
            ? this._scenes.find(x => x.Id === arg)
            : this._scenes.find(x => x.Id === arg.Id)

        if (scene)
        {
            this._activeScene = scene
        }
    }
    //#endregion

    //#region Library
    CreateLibrary<T extends SharedComponent>(type: Class<T>): Library<T>
    {
        if (!this._libraries.has(type))
        {
            this._libraries.set(type, new Library(type, this._registry))
        }

        return this._libraries.get(type) as Library<T>
    }

    GetLibrary<T extends SharedComponent>(type: Class<T>): Library<T>
    {
        const library = this._libraries.get(type)

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
        if (this._prefabs.has(name))
        {
            throw new Error(`Name ${ name } already exists`)
        }

        const prefab = new Prefab()
        this._prefabs.set(name, prefab)
        return prefab
    }

    GetPrefab(name: string): Prefab | undefined
    {
        return this._prefabs.get(name)
    }
    //#endregion

    static Save(game: Game): void
    {

    }

    static Load(): void
    {
        
    }
}
