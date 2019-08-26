import Updateable from '../Interfaces/Updateable';

class TimeKeep implements Updateable
{
    private Now: number
    private Then: number

    public Delta: number
    public Period: number
    public Ready: boolean

    constructor(period: number)
    {
        this.Period = 1000 / period
        this.Reset()
    }

    public Reset(): void
    {
        this.Ready = false
        this.Then = this.Now = Date.now()
        this.Delta = 0
    }

    public Update(): void
    {
        this.Then = this.Now
        this.Now = Date.now()

        if (this.Ready)
        {
            this.Delta = this.Now - this.Then
        }
        else
        {
            this.Delta += this.Now - this.Then
        }
        
        if (this.Delta > this.Period)
        {
            this.Ready = true
        }
        else
        {
            this.Ready = false
        }
    }
}

export default class Time
{
    public static Render: TimeKeep
    public static Physics: TimeKeep

    static Init(render: number, physics: number)
    {
        Time.Render = new TimeKeep(render)
        Time.Physics = new TimeKeep(physics)
    }

    static Update(): void
    {
        Time.Render.Update()
        Time.Physics.Update()
    }
}