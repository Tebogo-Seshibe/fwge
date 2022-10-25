import { CalcuateDelay, createContext, GL, IDelay, UUID } from "@fwge/common"
import { SharedComponent } from "../ecs"
import { Class, SceneId } from "../ecs/Registry"
import { Asset } from "./Asset"
import { Prefab } from "./Prefab"
import { Scene } from "./Scene"

export interface LibraryEntry<T>
{
    name: string
    create: () => T
}

export interface IGame
{
    debug?: boolean
    height: number
    width: number
    canvas: HTMLCanvasElement | (() => HTMLCanvasElement)
    scenes: Class<Scene>[]
    startupScene: Class<Scene>

    assets?: Array<LibraryEntry<Asset>>
    components?: Array<LibraryEntry<SharedComponent>>
    prefabs?: Array<LibraryEntry<Prefab>>
}

export class Game
{
    public readonly UUID: UUID = UUID.Create()
    readonly Height: number
    readonly Width: number
    readonly Scenes: Map<SceneId, Scene> = new Map()    
    readonly Assets: Map<string, Map<string, Asset>> = new Map()
    readonly Components: Map<string, Map<string, SharedComponent>> = new Map()
    readonly Prefabs: Map<string, Map<string, Prefab>> = new Map()
    
    //#region Private Fields
    #scenesIds: Map<Class<Scene>, SceneId> = new Map()
    #activeScene: Scene | undefined = undefined
    #currTick: number = -1
    #prevTick: number = -1
    #tickId: number | undefined = undefined
    #delayId: number | undefined = undefined
    #running: boolean = false
    //#endregion    

    constructor()
    constructor(config: IGame)
    constructor(config?: IGame)
    {
        config = {
            ...config!,
            debug: config?.debug === undefined ? false : config.debug,
            components: config?.components ?? [],
            assets: config?.assets ?? []
        }

        config.canvas = config.canvas instanceof HTMLCanvasElement
            ? config.canvas!
            : config.canvas!()

        if (!config.canvas)
        {
            throw new Error('No canvas element found')
        }

        this.ResetContext(config.canvas, config.debug!)

        GL.canvas.width = config.width
        GL.canvas.height = config.height

        this.Width = config.width
        this.Height = config.height
        
        for (const { name, create } of config.prefabs!)
        {
            const asset = create()
            const library = this.Prefabs.get(asset.Type.name) ?? new Map()
            library.set(name, asset)
            this.Prefabs.set(asset.Type.name, library)
        }
        
        for (const { name, create } of config.assets!)
        {
            const asset = create()
            const library = this.Assets.get(asset.Type.name) ?? new Map()
            library.set(name, asset)
            this.Assets.set(asset.Type.name, library)
        }

        for (const { name, create } of config.components!)
        {
            const component = create()
            const library = this.Components.get(component.Type.name) ?? new Map()
            library.set(name, component)
            this.Components.set(component.Type.name, library)
        }
        
        for (const SceneConstructor of config.scenes!)
        {
            const newScene = new SceneConstructor(this);
            this.Scenes.set(newScene.Id, newScene);
            this.#scenesIds.set(SceneConstructor, newScene.Id);
            
            newScene.Init()
        }

        this.SetScene(config.startupScene)
    }
    
    ResetContext(canvas: HTMLCanvasElement, debug: boolean)
    {
        createContext(canvas, debug)

        canvas.addEventListener('resize', () => {
            const rect = canvas.getBoundingClientRect()
            canvas.height = rect.height
            canvas.width = rect.width
        })
    }

    Start(): void
    Start(delay: IDelay): void
    Start(delay: IDelay = { }): void
    {
        window.setTimeout(() => this.#start(), CalcuateDelay(delay))
    }
    
    Stop(): void
    Stop(delay: IDelay): void
    Stop(delay: IDelay = { }): void
    {
        window.setTimeout(() => this.#stop(), CalcuateDelay(delay))
    }

    //#region Private Methods
    #start()
    {
        if (this.#running)
        {
            return 
        }

        if (!this.#activeScene)
        {
            this.#tickId = window.setTimeout(() => this.#start())
        }

        this.#prevTick = Date.now()
        this.#currTick = Date.now()
        this.#activeScene!.Start()

        this.#tickId = window.requestAnimationFrame(() => this.#update(0))
    }
    
    #update(delta: number): void
    {
        this.#activeScene!.Update(delta)
        
        this.#prevTick = this.#currTick
        this.#currTick = Date.now()
        
        this.#tickId = window.requestAnimationFrame(() => this.#update((this.#currTick - this.#prevTick) / 1000))
    }
    
    #stop()
    {
        this.#running = false

        if (this.#delayId !== undefined)
        {
            window.clearTimeout(this.#delayId)
        }

        if (this.#tickId !== undefined)
        {
            window.cancelAnimationFrame(this.#tickId)
        }

        this.#activeScene?.Stop()
        this.#tickId = undefined
    }
    //#endregion

    AddScene(scene: Scene): void
    {
        this.Scenes.set(scene.Id, scene)
    }

    GetScene(sceneType: Class<Scene>): Scene | undefined
    GetScene(sceneId: SceneId): Scene | undefined
    GetScene(scene: Class<Scene> | SceneId): Scene | undefined
    {
        if (typeof scene !== 'number')
        {
            scene = this.#scenesIds.get(scene) as SceneId
        }
        
        return this.Scenes.get(scene)
    }

    SetScene(sceneType: Class<Scene>): void
    SetScene(sceneId: SceneId): void
    SetScene(sceneId: Class<Scene> | SceneId): void
    {
        if (typeof sceneId !== 'number')
        {
            sceneId = this.#scenesIds.get(sceneId) as SceneId
        }
        const newScene = this.Scenes.get(sceneId)

        if (!newScene || (this.#activeScene && this.#activeScene.Id === newScene.Id))
        {
            return
        }
        this.#activeScene = newScene
    }

    GetComponent<T extends SharedComponent>(name: string, type: Class<T>): T | undefined
    {
        return this.Components.get(type.name)?.get(name) as T
    }

    GetAsset<T extends Asset>(name: string, type: Class<T>): T | undefined
    {
        return this.Assets.get(type.name)?.get(name) as T
    }

    GetPrefab<T extends Prefab>(name: string, type: Class<T>): T | undefined
    {
        return this.Prefabs.get(type.name)?.get(name) as T
    }
}
