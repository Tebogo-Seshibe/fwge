import { GL, IDelay, setContext } from "@fwge/common"
import { SharedComponent } from "../ecs"
import { Class, SceneId } from "../ecs/Registry"
import { Asset } from "./Asset"
import { Scene } from "./Scene"

export interface LibraryEntry<T>
{
    name: string
    create: () => T
}

export interface IGame
{
    height?: number
    width?: number
    canvas?: HTMLCanvasElement | (() => HTMLCanvasElement)
    assets?: Array<LibraryEntry<Asset>>
    components?: Array<LibraryEntry<SharedComponent>>
    scenes?: Class<Scene>[]
}

export class Game
{
    readonly Assets: Map<string, Map<string, Asset>> = new Map()
    readonly Components: Map<string, Map<string, SharedComponent>> = new Map()
    readonly Scenes: Map<SceneId, Scene> = new Map()
    
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
            height: config?.height ?? 1080,
            width: config?.width ?? 1920,
            canvas: config?.canvas ?? function() { return document.querySelector<HTMLCanvasElement>('canvas')! },
            scenes: config?.scenes ?? [],
            components: config?.components ?? [],
            assets: config?.assets ?? [],
        }

        config.canvas = config.canvas instanceof HTMLCanvasElement
            ? config.canvas!
            : config.canvas!();

        if (!config.canvas)
        {
            throw new Error('No canvas element found')
        }

        this.ResetContext(config.canvas)

        GL.canvas.width = config.width!
        GL.canvas.height = config.height!
        
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
    }
    
    ResetContext(canvas: HTMLCanvasElement)
    {
        const gl = canvas.getContext('webgl2', { alpha: true, antialias: true });
        if (!gl)
        {
            throw new Error('No WebGL context could be generated!');
        }
        setContext(gl);

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
        // this._delayId = window.setTimeout(() => this._start.apply(this), CalcuateDelay(delay))
        this.#start()
    }
    
    Stop(): void
    Stop(delay: IDelay): void
    Stop(delay: IDelay = { }): void
    {
        // window.setTimeout(() => this._stop.apply(this), CalcuateDelay(delay))
        this.#stop()
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
            // throw new Error('No scene set')
            this.#tickId = window.requestAnimationFrame(() => this.#start())
        }

        this.#activeScene!.Init()
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
    SetScene(scene: Class<Scene> | SceneId): void
    {
        if (typeof scene !== 'number')
        {
            scene = this.#scenesIds.get(scene) as SceneId
        }
        
        if (this.Scenes.has(scene))
        {
            if (this.#activeScene)
            {
                this.Stop()
            }

            this.#activeScene = this.Scenes.get(scene)!
        }
    }

    GetComponent<T extends SharedComponent>(name: string, type: Class<T>): T | undefined
    {
        return this.Components.get(type.name)?.get(name) as T
    }

    GetAsset<T extends Asset>(name: string, type: Class<T>): T | undefined
    {
        return this.Assets.get(type.name)?.get(name) as T
    }
}
