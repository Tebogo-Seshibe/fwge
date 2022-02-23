import { TypeId } from "../ecs"
import { Component } from "../ecs/Component"
import { setContext } from "../utils/GL"
import { Library } from "./Library"
import { Prefab } from "./Prefab"
import { Class, Registry, SceneId } from "../ecs/Registry"
import { Scene } from "./Scene"

interface IGame
{
    height?: number
    width?: number
}

export class Game
{
    private scenes: Scene[] = []
    private libraries: Library<Component>[] = []
    private prefabs: Map<string, Prefab> = new Map()    
    private activeScene?: Scene
    private currTick: number = -1
    private prevTick: number = -1
    private tickId?: number

    constructor(canvas: HTMLCanvasElement)
    constructor(canvas: HTMLCanvasElement, config: IGame)
    constructor(canvas: HTMLCanvasElement, config: IGame = { })
    {
        const gl = canvas.getContext('webgl') as WebGLRenderingContext

        if (!gl)
        {
            throw new Error('Failed to create a webgl context')
        }
        
        setContext(gl)

        gl.canvas.height = config.height ?? 1080
        gl.canvas.width = config.width ?? 1920
    }

    Start(): void
    {
        if (this.scenes.length === 0)
        {
            throw new Error('No scenes to run')
        }

        if (!this.activeScene)
        {
            this.activeScene = this.scenes[0]
        }

        this.currTick = this.prevTick = Date.now()

        this.activeScene!.Init()
        this.activeScene!.Start()
        this.tickId = window.requestAnimationFrame(() => this.#Update(0))
    }
    
    #Update(delta: number): void
    {
        this.activeScene!.Update(delta)
        
        this.prevTick = this.currTick
        this.currTick = Date.now()
        this.tickId = window.requestAnimationFrame(() => this.#Update(this.currTick - this.prevTick))
    }
    
    Stop(): void
    Stop(delay: number): void
    Stop(delay: number = 0): void
    {        
        setTimeout(() =>
        {
            if (this.tickId !== undefined)
            {
                window.cancelAnimationFrame(this.tickId)
                this.activeScene!.Stop()

                this.tickId = undefined
            }
        }, delay)
    }
    
    CreateScene(): Scene
    {
        const scene = new Scene()
        this.scenes.push(scene)

        return scene
    }

    SetScene(index: SceneId): void
    SetScene(scene: Scene): void
    SetScene(arg: Scene | SceneId): void
    {
        if (arg instanceof Scene)
        {
            arg = this.scenes.indexOf(arg)
        }

        if (arg >= 0 && arg < this.scenes.length)
        {
            this.activeScene = this.GetScene(arg)
        }
    }

    GetScene(index: SceneId): Scene | undefined
    {
        return this.scenes.find(scene => scene.Id === index)
    }

    RemoveScene(index: SceneId): void
    RemoveScene(scene: Scene): void
    RemoveScene(arg: Scene | SceneId): void
    {
        if (arg instanceof Scene)
        {
            arg = this.scenes.indexOf(arg)
        }

        if (arg >= 0 && arg < this.scenes.length)
        {
            this.scenes.splice(arg, 1)
        }
    }
    
    RegisterPrefab(name: string): Prefab
    {
        const prefab = new Prefab()
        this.prefabs.set(name, prefab)

        return prefab
    }

    GetPrefab(name: string): Prefab
    {
        if (!this.prefabs.has(name))
        {
            throw new Error(`Prefab with name "${ name }" does not exist`);
        }

        return this.prefabs.get(name)!
    }

    RegisterComponents(...types: Class<Component>[]): void
    {
        for (const type of types)
        {
            Registry.registerComponentType(type)
        }
    }

    CreateLibraries(...types: Class<Component>[]): void
    {
        for (const type of types)
        {
            const libraryIndex = Registry.getComponentType(type)

            if (libraryIndex === -1)
            {
                throw new Error(`Component of type "${ type.name }" not registered`)
            }

            if (!this.libraries[libraryIndex])
            {
                this.libraries[libraryIndex] = new Library(type)
            }
        }
    }

    GetLibrary(typeId: TypeId): Library<Component>
    GetLibrary<T extends Component>(type: Class<T>): Library<T>
    GetLibrary<T extends Component>(type: TypeId | Class<T>): Library<T>
    {
        const libraryIndex =  typeof type === 'number'
            ? type
            : Registry.getComponentType(type)
        
        if (libraryIndex === -1)
        {
            throw new Error(`Component type not registered`)
        }

        const library = this.libraries[libraryIndex]

        if (!library)
        {
            throw new Error(`Library not created`)
        }
        
        return library as Library<T>
    }
}
