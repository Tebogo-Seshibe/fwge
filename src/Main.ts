import { Animations } from './Animation/Animation';
import { GameObjects } from './Logic/Object/GameObject';
import Input from './Logic/Input/Input';
import { ParticleSystems } from './Logic/Particle System/ParticleSystem';
import Time from './Logic/Utility/Time';
import PhysicsEngine, { UpdatePhysics } from './Physics/PhysicsEngine';
import Colour3 from './Render/Colour/Colour3';
import Colour4 from './Render/Colour/Colour4';
import RenderEngine from './Render/Render';
import { InitRender, UpdateRender } from './Render/Renderer';
import { InitShaders } from './Render/Shaders';

export let GL: WebGLRenderingContext
    
export class IMain
{
    canvas: HTMLCanvasElement
    render?: number
    physics?: number
    clear?: Colour4 | Colour3 | number[]
    height: number
    width: number
}

export default class Main
{
    // region Engines
    private input: Input
    private time: Time
    private render: RenderEngine
    private physics: PhysicsEngine
    // endregion

    // region Local Fields
    private height: number
    private width: number
    private renderUpdate: number
    private physicsUpdate: number
    
    private running: boolean = false
    private animationFrame: number = -1
    // endregion
    
    public get Height(): number
    {
        return this.height
    }

    public set Height(height: number)
    {
        this.height = Math.clamp(height, 0, Number.MAX_SAFE_INTEGER)
    }
    
    public get Width(): number
    {
        return this.width
    }

    public set Width(width: number)
    {
        this.width = Math.clamp(width, 0, Number.MAX_SAFE_INTEGER)
    }

    public get RenderUpdate(): number
    {
        return this.renderUpdate
    }

    public set RenderUpdate(renderUpdate: number)
    {
        this.renderUpdate = Math.clamp(renderUpdate, 0, Number.MAX_SAFE_INTEGER)
        this.time.Init(this.renderUpdate, this.physicsUpdate)
    }

    public get PhysicsUpdate(): number
    {
        return this.physicsUpdate
    }

    public set PhysicsUpdate(physicsUpdate: number)
    {
        this.physicsUpdate = Math.clamp(physicsUpdate, 0, Number.MAX_SAFE_INTEGER)
        this.time.Init(this.physicsUpdate, this.physicsUpdate)
    }
     
    public get GL(): WebGLRenderingContext
    {
        return GL
    }


    public constructor()
    {
        this.input = new Input
        this.time = new Time
        this.render = new RenderEngine
        this.physics = new PhysicsEngine
    }

    public Init({ canvas, render = 60, physics = 30, clear = [0, 0, 0, 1], height = 1080, width = 1920 }: IMain): void
    {
        GL = canvas.getContext('webgl') as WebGLRenderingContext
        
        if (!GL)
        {
            throw new Error('Webgl context could not be initialized.')
        }
    
        this.Height = canvas.height = height
        this.Width = canvas.width = width
        
        GL.clearColor(clear[0], clear[1], clear[2], clear[3])
        
        this.input.Init(canvas)
        this.time.Init(render, physics)
        InitRender()
        InitShaders()
    }
    
    public Start(): void
    {
        if (this.animationFrame !== -1)
        {
            window.cancelAnimationFrame(this.animationFrame)
        }

        this.render.Reset()
        this.physics.Reset()
        this.GameLoop()
    }
    
    public Stop(): void
    {
        if (this.animationFrame !== -1)
        {
            window.cancelAnimationFrame(this.animationFrame)
        }
    }

    private Update(): void
    {

    }
    
    private GameLoop(): void
    {
        this.animationFrame = window.requestAnimationFrame(this.GameLoop)
        
        // Time
        this.time.Update()
        
        // Game
        for (let gameObject of GameObjects)
        {
            gameObject.Update(this.time.Render.Delta)
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
        if (this.time.Physics.Ready)
        {
            UpdatePhysics(this.time.Physics.Delta)
        }
        
        // Render
        if (this.time.Render.Ready)
        {
            UpdateRender(this.time.Render.Delta)
        }

        this.input.Reset()
    }
}
