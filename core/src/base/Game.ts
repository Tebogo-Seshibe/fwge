import { IDelay, setContext } from "@fwge/common"
import { SharedComponent } from "../ecs"
import { Class, SceneId, TypeId } from "../ecs/Registry"
import { Scene } from "./Scene"

export abstract class Game
{
    //#region Fields
    private _library: Map<TypeId, Map<string, SharedComponent>> = new Map()
    private _scenesIds: Map<Class<Scene>, SceneId> = new Map()
    private _scenes: Map<SceneId, Scene> = new Map()
    private _activeScene: Scene | undefined = undefined

    private _currTick: number = -1
    private _prevTick: number = -1
    private _tickId: number | undefined = undefined

    private _init: boolean = false
    private _delayId: number | undefined = undefined
    //#endregion
    
    private init(canvas: HTMLCanvasElement)
    {
        const gl = canvas.getContext('webgl2', { alpha: true, antialias: true })
        if (!gl)
        {
            throw new Error('No WebGL context could be generated!')
        }
        setContext(gl)
    }

    public Init(): void
    {
        for (const [ , scene ] of this._scenes)
        {
            scene.Init()
        }
    }

    public Start(): void
    public Start(delay: IDelay): void
    public Start(delay: IDelay = { }): void
    {
        // this._delayId = window.setTimeout(() => this._start(), CalcuateDelay(delay))
        this._start()
    }
    
    public Stop(): void
    public Stop(delay: IDelay): void
    public Stop(delay: IDelay = { }): void
    {
        // window.setTimeout(() => this._stop(), CalcuateDelay(delay))
        this._stop()
    }

    //#region Private Methods
    private _start()
    {
        if (!this._activeScene)
        {
            this._tickId = window.requestAnimationFrame(() => this._start())
        }

        if (!this._init)
        {
            this.Init()
            this._init = true
        }

        this._prevTick = Date.now()
        this._currTick = Date.now()
        this._activeScene?.Start()

        this._tickId = window.requestAnimationFrame(() => this._update(0))
    }
    
    private _update(delta: number): void
    {
        this._activeScene?.Update(delta)
        
        this._prevTick = this._currTick
        this._currTick = Date.now()
        
        this._tickId = window.requestAnimationFrame(() => this._update((this._currTick - this._prevTick) / 1000))
    }
    
    private _stop()
    {        
        if (this._delayId !== undefined)
        {
            window.clearTimeout(this._delayId)
        }

        if (this._tickId !== undefined)
        {
            window.cancelAnimationFrame(this._tickId)
        }

        this._activeScene?.Stop()
        this._tickId = undefined
    }
    //#endregion

    public SetScene(sceneType: Class<Scene>): void
    public SetScene(sceneId: SceneId): void
    public SetScene(scene: Class<Scene> | SceneId): void
    {
        if (typeof scene !== 'number')
        {
            scene = this._scenesIds.get(scene) as SceneId
        }
        
        if (this._scenes.has(scene))
        {
            this.Stop()
            this._activeScene = this._scenes.get(scene)!
        }
    }

    public AddToLibrary<T extends SharedComponent>(name: string, component: T): void
    {
        const library = this._library.get(component.Type._typeId!) ?? new Map()
        library.set(name, component)
        this._library.set(component.Type._typeId!, library)
    }

    public GetFromLibrary<T extends SharedComponent>(type: Class<T>, name: string): SharedComponent | undefined
    {
        return this._library.get(type._typeId!)?.get(name)
    }
}
