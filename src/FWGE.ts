import { Animations } from './Logic/Animation/Animation';
import Colour3 from './Logic/Colour/Colour3';
import Colour4 from './Logic/Colour/Colour4';
import { GameObjects } from './Logic/GameObject';
import Input from './Logic/Input/Input';
import { ParticleSystems } from './Logic/Particle System/ParticleSystem';
import Time from './Logic/Utility/Time';
import { UpdatePhysics } from './Physics/PhysicsEngine';
import { InitRender, UpdateRender } from './Render/Renderer';

export let GL: WebGLRenderingContext

export class IFWGE
{
    canvas: HTMLCanvasElement
    render?: number
    physics?: number
    clear?: Colour4 | Colour3 | Float32Array | number[]
    height: number
    width: number
}

export default class FWGE
{
    public static Running: boolean = false
    private static animationFrame: number = -1
    
    private renderUpdate: number
    public get RenderUpdate(): number
    {
        return this.renderUpdate
    }
    public set RenderUpdate(renderUpdate: number)
    {
        this.renderUpdate = renderUpdate
        Time.Init(this.renderUpdate, this.physicsUpdate)
    }

    private physicsUpdate: number
    public get PhysicsUpdate(): number
    {
        return this.physicsUpdate
    }
    public set PhysicsUpdate(physicsUpdate: number)
    {
        this.physicsUpdate = physicsUpdate
        Time.Init(this.physicsUpdate, this.physicsUpdate)
    }
     
    public static get GL(): WebGLRenderingContext
    {
        return GL
    }

    public static Height: number
    public static Width: number

    public static Init({ canvas, render = 60, physics = 30, clear = [0, 0, 0, 1], height = 1080, width = 1920 }: IFWGE): void
    {
        if (!canvas)
        {
            throw new Error('Field {canvas: HTMLCanvasElement} is required')
        }

        GL = canvas.getContext('webgl') as WebGLRenderingContext
        
        if (!GL)
        {
            throw new Error('Webgl context could not be initialized.')
        }
    
        this.Height = canvas.height = height
        this.Width = canvas.width = width
        
        GL.clearColor(clear[0], clear[1], clear[2], clear[3])

        Input.Init(canvas)
        Time.Init(render, physics)
        InitRender()
    }
    
    public static Start(): void
    {
        if (FWGE.animationFrame !== -1)
        {
            window.cancelAnimationFrame(FWGE.animationFrame)
        }

        Time.Render.Reset()
        Time.Physics.Reset()
        FWGE.GameLoop()
    }
    
    public static Stop(): void
    {
        if (FWGE.animationFrame !== -1)
        {
            window.cancelAnimationFrame(FWGE.animationFrame)
        }
    }
    
    private static GameLoop(): void
    {
        FWGE.animationFrame = window.requestAnimationFrame(FWGE.GameLoop)
        
        // Time
        Time.Update()
        
        // Game
        for (let gameObject of GameObjects)
        {
            gameObject.Update()
        }
        
        for (let animation of Animations)
        {
            animation.Update()
        }
        
        for (let particleSystem of ParticleSystems)
        {
            particleSystem.Update()
        }
        
        // Physics
        if (Time.Physics.Ready)
        {
            UpdatePhysics()
        }
        
        // Render
        if (Time.Render.Ready)
        {
            UpdateRender()
        }
    }
}
