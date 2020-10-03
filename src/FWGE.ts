import { OBJConverter } from './Converter/index'
import LogicEngine from './Engine/LogicEngine'
import PhysicsEngine from './Engine/PhysicsEngine'
import RenderEngine from './Engine/RenderEngine'
import { Input } from './Input/index'
import { clamp } from './Maths/Math'
import Item from './Object/Item'
import { Colour3, Colour4 } from './Render/index'
import { Time } from './Utility/index'

let height: number = 1080
let width: number = 1920
let renderUpdate: number = 60
let physicsUpdate: number = 60
let animationFrame: number = -1

interface IFWGE
{
    canvas: HTMLCanvasElement
    render?: number
    physics?: number
    clear?: Colour4 | Colour3 | number[]
    height: number
    width: number
}

export const names: Map<string, Item> = new Map<string, Item>()
export const tags: Map<string, Item[]> = new Map<string, Item[]>()
export let GL: WebGLRenderingContext = undefined

export default class FWGE
{
    //#region Components
    public readonly OBJConverter: OBJConverter = new OBJConverter
    public readonly Input: Input = new Input
    public readonly Time: Time = new Time
    //#endregion

    //#region Engines
    private RenderEngine: RenderEngine = new RenderEngine
    private LogicEngine: LogicEngine = new LogicEngine
    private PhysicsEngine: PhysicsEngine = new PhysicsEngine
    //#endregion
    
    //#region Public Properties
    public get Height(): number
    {
        return height
    }

    public set Height(height: number)
    {
        height = clamp(height, 0, Number.MAX_SAFE_INTEGER)
    }
    
    public get Width(): number
    {
        return width
    }

    public set Width(width: number)
    {
        width = clamp(width, 0, Number.MAX_SAFE_INTEGER)
    }

    public get RenderUpdate(): number
    {
        return renderUpdate
    }

    public set RenderUpdate(renderUpdate: number)
    {
        renderUpdate = clamp(renderUpdate, 0, Number.MAX_SAFE_INTEGER)
        this.Time.Init(renderUpdate, physicsUpdate)
    }

    public get PhysicsUpdate(): number
    {
        return physicsUpdate
    }

    public set PhysicsUpdate(physicsUpdate: number)
    {
        physicsUpdate = clamp(physicsUpdate, 0, Number.MAX_SAFE_INTEGER)
        this.Time.Init(physicsUpdate, physicsUpdate)
    }
     
    public get GL(): WebGLRenderingContext
    {
        return GL
    }
    //#endregion

    //#region Main Methods
    public Init({ canvas, render = 60, physics = 60, clear = [0, 0, 0, 1], height = 1080, width = 1920 }: IFWGE): boolean
    {
        GL = canvas.getContext('webgl') as WebGLRenderingContext
        
        if (GL === undefined || GL === null)
        {
            return false
        }

        GL.clearColor(clear[0], clear[1], clear[2], clear[3])
    
        this.Input.Init(canvas)
        this.Time.Init(render, physics)

        this.Height = canvas.height = height
        this.Width = canvas.width = width
        
        this.LogicEngine.Init()
        this.PhysicsEngine.Init()
        this.RenderEngine.Init(GL)

        return true
    }
    
    public Start(): void
    {
        if (animationFrame !== -1)
        {
            window.cancelAnimationFrame(animationFrame)
        }

        this.LogicEngine.Reset()
        this.PhysicsEngine.Reset()
        this.RenderEngine.Reset()
        
        this.Update()
    }
    
    public Stop(): void
    {
        if (animationFrame !== -1)
        {
            window.cancelAnimationFrame(animationFrame)
        }
    }

    private Update(): void
    {
        animationFrame = window.requestAnimationFrame(() => this.Update())
        

        this.Time.Update()
        this.LogicEngine.Update(this.Time.Render)
        this.PhysicsEngine.Update(this.Time.Physics)
        this.RenderEngine.Update()
    }
    //#endregion
}
