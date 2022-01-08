import { Component } from "./Component"
import { Library } from "./Library"
import { Prefab } from "./Prefab"
import { Class, Registry, SceneId } from "./Registry"
import { Scene } from "./Scene"

export let GL: WebGLRenderingContext

export function glUseProgram(progamId: WebGLProgram | null)
{
    (GL as WebGLRenderingContext).useProgram(progamId)
}

export class Game
{
    private _libraries: Library<Component>[] = []
    private _prefabs: Map<string, Prefab> = new Map()

    private _scenes: Scene[] = []
    private _activeScene?: Scene
    
    private _currTick: number = -1
    private _prevTick: number = -1
    private _tickId?: number

    constructor(canvas: HTMLCanvasElement)
    {
        GL = canvas.getContext('webgl') as WebGLRenderingContext

        if (!GL)
        {
            throw new Error('Failed to create a webgl context')
        }
    }

    //#region Control
    public Start(): void
    {
        if (this._scenes.length === 0)
        {
            throw new Error('No scenes to run')
        }

        if (!this._activeScene)
        {
            this._activeScene = this._scenes[0]
        }

        this._currTick = this._prevTick = Date.now()

        this._activeScene!.Init()
        this._activeScene!.Start()
        this._tickId = window.requestAnimationFrame(() => this.Update(0))
    }
    
    private Update(delta: number): void
    {
        this._activeScene!.Update(delta)
        
        this._prevTick = this._currTick
        this._currTick = Date.now()
        this._tickId = window.requestAnimationFrame(() => this.Update(this._currTick - this._prevTick))
    }
    
    public Stop(delay: number = 0): void
    {        
        setTimeout(() =>
        {
            if (this._tickId !== undefined)
            {
                window.cancelAnimationFrame(this._tickId)
                this._activeScene!.Stop()

                this._tickId = undefined
            }
        }, delay)
    }
    //#endregion

    //#region Scene
    public CreateScene(): Scene
    {
        const scene = new Scene(this._scenes.length)
        this._scenes.push(scene)

        return scene
    }

    public SetScene(index: SceneId): void
    public SetScene(scene: Scene): void
    public SetScene(arg: Scene | SceneId): void
    {
        if (arg instanceof Scene)
        {
            arg = this._scenes.indexOf(arg)
        }

        if (arg >= 0 && arg < this._scenes.length)
        {
            this._activeScene = this._scenes[arg]
        }
    }

    public GetScene(index: SceneId): Scene | undefined
    {
        return this._scenes[index]
    }

    public RemoveScene(index: SceneId): void
    public RemoveScene(scene: Scene): void
    public RemoveScene(arg: Scene | SceneId): void
    {
        if (arg instanceof Scene)
        {
            arg = this._scenes.indexOf(arg)
        }

        if (arg >= 0 && arg < this._scenes.length)
        {
            this._scenes.splice(arg, 1)
        }
    }
    
    public RegisterPrefab(name: string): Prefab
    {
        const prefab = new Prefab()
        this._prefabs.set(name, prefab)

        return prefab
    }

    public GetPrefab(name: string): Prefab
    {
        if (!this._prefabs.has(name))
        {
            throw new Error(`Prefab with name "${ name }" does not exist`);
        }

        return this._prefabs.get(name)!
    }
    //#endregion

    //#region Library
    public RegisterComponents(...types: Class<Component>[]): void
    {
        for (const type of types)
        {
            if (Registry.getComponentTypeId(type) === -1)
            {
                Registry.setComponentTypeId(type)
            }
        }
    }

    public CreateLibraries(...types: Class<Component>[]): void
    {
        for (const type of types)
        {
            const libraryIndex = Registry.getComponentTypeId(type)
            if (libraryIndex === -1)
            {
                throw new Error(`Component of type "${ type.name }" not registered`)
            }

            if (!this._libraries[libraryIndex])
            {
                this._libraries[libraryIndex] = new Library(type)
            }
        }
    }

    public GetLibrary<T extends Component>(type: Class<T>): Library<T>
    {
        const libraryIndex = Registry.getComponentTypeId(type)
        if (libraryIndex === -1)
        {
            throw new Error(`Component of type "${ type.name }" not registered`)
        }

        const library = this._libraries[libraryIndex]
        if (!library)
        {
            throw new Error(`Library of type "${ type.name }" not created`)
        }
        
        return library as Library<T>
    }
    //#endregion
}
