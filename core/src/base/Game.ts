import { CalcuateDelay, IDelay, setContext } from "@fwge/common"
import { System } from "../ecs"
import { Component } from "../ecs/Component"
import { Class, SceneId } from "../ecs/Registry"
import { Scene } from "./Scene"


export class Game
{
    private _scenes: Scene[] = []
    private _activeScene?: Scene
    private _currTick: number = -1
    private _prevTick: number = -1
    private _tickId?: number
    private _canvas?: HTMLCanvasElement
    // private _registry: Registry = new Registry()

    public SetCanvas(canvas: HTMLCanvasElement): void
    {
        const gl = canvas.getContext('webgl2', { alpha: true, antialias: true })
        if (!gl)
        {
            throw new Error('No WebGL context could be generated!')
        }

        this._canvas = canvas

        setContext(gl)
    }

    //#region Controls
    Start(): void
    {
        if (!this._canvas)
        {
            throw new Error('No HTMLCanvasElement provided')
        }

        if (this._scenes.length === 0)
        {
            console.warn('No scenes to run')
        }

        if (!this._activeScene)
        {
            this._activeScene = this._scenes.first()
        }

        this._prevTick = Date.now()
        this._currTick = Date.now()

        this._activeScene?.Init()
        this._activeScene?.Start()

        this._tickId = window.requestAnimationFrame(() => this.Update(0))
    }
    
    private Update(delta: number): void
    {
        this._activeScene?.Update(delta)
        
        this._prevTick = this._currTick
        this._currTick = Date.now()
        
        this._tickId = window.requestAnimationFrame(() => this.Update((this._currTick - this._prevTick) / 1000))
    }
    
    Stop(): void
    Stop(delay: IDelay): void
    Stop(arg: IDelay = {}): void
    {
        setTimeout(() =>
        {
            if (this._tickId !== undefined)
            {
                window.cancelAnimationFrame(this._tickId)
                this._activeScene?.Stop()
                this._tickId = undefined
            }
        }, CalcuateDelay(arg))
    }
    //#endregion

    //#region Scene
    CreateScene()
    {
        const scene = new Scene()
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

    static Save(game: Game): void
    {

    }

    static Load(): void
    {
        
    }
}
