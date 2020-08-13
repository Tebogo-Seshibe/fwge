import Updateable from '../Interfaces/Updateable';
import IEngine from '../Engine/IEngine';

export class TimeKeep implements Updateable
{
    private now: number
    private then: number

    private delta: number
    private period: number
    private ready: boolean

    constructor(period: number)
    {
        this.period = 1000 / period
        this.Reset()
    }

    public Reset(): void
    {
        this.ready = false
        this.then = this.now = Date.now()
        this.delta = 0
    }

    public Update(): void
    {
        this.then = this.now
        this.now = Date.now()

        if (this.ready)
        {
            this.delta = this.now - this.then
        }
        else
        {
            this.delta += this.now - this.then
        }
        
        if (this.delta > this.period)
        {
            this.ready = true
        }
        else
        {
            this.ready = false
        }
    }


    public get Delta(): number
    {
        return this.delta
    }

    public get Ready(): boolean
    {
        return this.ready
    }
}

export default class Time implements IEngine
{
    public Render: TimeKeep
    public Physics: TimeKeep

    public Init(render: number, physics: number)
    {
        this.Render = new TimeKeep(render)
        this.Physics = new TimeKeep(physics)
    }

    public Update(): void
    {
        this.Render.Update()
        this.Physics.Update()
    }

    public Reset(): void
    {
        this.Render.Reset()
        this.Physics.Reset()
    }
}
