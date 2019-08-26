import { Animations } from '../Animation/Animation';
import { Cameras } from '../Camera/Camera';
import { GameObjects } from '../GameObject';
import { ParticleSystems } from '../ParticleSystem';
import { InitRender, UpdateRender } from '../Render/Renderer';
import Time from './Time';

export default class Control
{
    public static Running: boolean = false
    private static AnimationFrame: number = -1

    public static Init(renderUpdate: number, physicsUpdate: number): void
    {
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
