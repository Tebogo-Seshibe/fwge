import Updateable from '../Interfaces/Updateable'

export default class Control implements Updateable
{
    public Running: boolean = false
    private AnimationFrame: number = -1

    constructor()
    {
    }
    
    private Run(): void
    {
        this.AnimationFrame = window.requestAnimationFrame(this.Run)

        this.Update();

        /*if (this.Running)
        {
            PhysicsEngine.Update();
            RenderEngine.Update();
        }*/
    }

    public Update(): void
    {
        /*Time.Update();
        Camera.Update();

        var i = GameObject.Objects.length;
        while (--i >= 0)
            GameObject.Objects[i].ObjectUpdate();

        Input.InputUpdate();*/
    }
        
    Start(): void
    {
        if(!this.Running)
            this.Running = true;

        if (this.AnimationFrame === -1)
            this.Run();
    }
    
    Pause(): void
    {
        if (!this.Running)
            this.Running = false;
    }
    
    Stop(): void
    {
        if (this.Running)
            this.Running = false;

        if (this.AnimationFrame !== -1)
        {
            window.cancelAnimationFrame(this.AnimationFrame);
            this.AnimationFrame = -1;
        }

        //Time.Reset();
    }
}
