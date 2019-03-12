import Updateable from '../Interfaces/Updateable'

export default class Time implements Updateable
{
    private _now: number
    private _then: number

    public RenderUpdate: number
    public PhysicsUpdate: number


    get Delta(): number
    {
        if (this._now && this._then)
        {
            return (this._now - this._then)
        }

        return 0
    }
    
    get RenderDelta(): number
    {
        return this.Delta / this.RenderUpdate
    }
    
    get PhysicsDelta(): number
    {
        return this.Delta / this.PhysicsUpdate
    }
    
    get Now(): Date
    {
        return new Date(Date.now())
    }
    
    Update(): void
    {
        if (!this._now)
        {
            this._now = Date.now()
        }
        
        this._then = this._now
        this._now = Date.now()
    }
}