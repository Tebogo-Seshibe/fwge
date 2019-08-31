import { Animations } from '../Animation/Animation';
import { Cameras } from '../Camera/Camera';
import { GameObjects } from '../GameObject';
import { ParticleSystems } from '../Particle System/ParticleSystem';
import { InitRender, UpdateRender } from '../Render/Renderer';
import Time from './Time';
import Colour4 from '../Render/Colour4';
import Input from '../Input/Input';

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
    private static AnimationFrame: number = -1
       
    public static Init({ canvas, renderUpdate = 60, physicsUpdate = 30, clear = [0, 0, 0, 1] }: IFWGE): void
    {
        if (!canvas)
        {
            throw new Error('Field {canvas: HTMLCanvasElement} is required')
        }

        GL = canvas.getContext('webgl2') as WebGLRenderingContext

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
        if (Control.AnimationFrame !== -1)
        {
            window.cancelAnimationFrame(Control.AnimationFrame)
        }

        Time.Render.Reset()
        Time.Physics.Reset()
        Control.Run()
    }
    
    public static Stop(): void
    {
        if (Control.AnimationFrame !== -1)
        {
            window.cancelAnimationFrame(Control.AnimationFrame)
        }
    }
    
    private static Run(): void
    {
        Control.AnimationFrame = window.requestAnimationFrame(Control.Run)

        Time.Update()
        //Input.Update()

        for (let particleSystem of ParticleSystems)
        {
            particleSystem.Update()
        }
        
        for (let gameObject of GameObjects)
        {
            gameObject.Update()
        }

        for (let animation of Animations)
        {
            animation.Update()
        }
        // PhysicsEngine.Update();

        for (let camera of Cameras)
        {
            camera.Update()
        }

        if (Time.Render.Ready)
        {
            UpdateRender()
        }
    }
}
