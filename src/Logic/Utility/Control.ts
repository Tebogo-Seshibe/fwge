import { Animations } from '../../Render/Animation/Animation';
import Colour4 from '../../Render/Colour/Colour4';
import { ParticleSystems } from '../../Render/Particle System/ParticleSystem';
import { InitRender, UpdateRender } from '../../Render/Renderer';
import { GameObjects } from '../GameObject';
import Input from '../Input/Input';
import Time from './Time';

export let GL: WebGLRenderingContext

export class  IFWGE
{
    canvas: HTMLCanvasElement
    renderUpdate?: number
    physicsUpdate?: number
    clear?: Colour4 | Float32Array | number[]
}

export default class Control
{
    public static Running: boolean = false
    private static animationFrame: number = -1
       
    public static Init({ canvas, renderUpdate = 60, physicsUpdate = 30, clear = [0, 0, 0, 1] }: IFWGE): void
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
        
        GL.clearColor(clear[0], clear[1], clear[2], clear[3])

        Input.Init(canvas)
        Time.Init(renderUpdate, physicsUpdate)
        InitRender()
    }
    
    public static Start(): void
    {
        if (Control.animationFrame !== -1)
        {
            window.cancelAnimationFrame(Control.animationFrame)
        }

        Time.Render.Reset()
        Time.Physics.Reset()
        Control.Run()
    }
    
    public static Stop(): void
    {
        if (Control.animationFrame !== -1)
        {
            window.cancelAnimationFrame(Control.animationFrame)
        }
    }
    
    private static Run(): void
    {
        Control.animationFrame = window.requestAnimationFrame(Control.Run)
        
        // Time
        Time.Update()
        
        // Input
        // Events Hanle thiss
        
        // Game
        for (let gameObject of GameObjects)
        {
            gameObject.Update()
        }
        
        for (let particleSystem of ParticleSystems)
        {
            particleSystem.Update()
        }
        
        for (let animation of Animations)
        {
            animation.Update()
        }
        
        // PhysicsEngine.Update();
        
        // Render
        if (Time.Render.Ready)
        {
            UpdateRender()
        }
    }
}
