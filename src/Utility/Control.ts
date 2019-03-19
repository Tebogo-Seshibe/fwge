import Time from './Time'
import { GameObjects } from '../GameObject'
import Renderer from '../Render/Renderer'

export default class Control
{
    public static Running: boolean = false
    private static AnimationFrame: number = -1

    public static Init(renderUpdate: number, physicsUpdate: number): void
    {
        Time.RenderUpdate = renderUpdate
        Time.PhysicsUpdate = physicsUpdate

        Renderer.Init()
    }
    
    public static Start(): void
    {
        if (Control.AnimationFrame !== -1)
        {
            window.cancelAnimationFrame(Control.AnimationFrame)
        }

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
        // Camera.Update()

        for (let gameObject of GameObjects)
        {
            gameObject.Update()
        }

        // Input.Update()

        // PhysicsEngine.Update();
        Renderer.Update()
    }
}
