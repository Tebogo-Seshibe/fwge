export default class Time
{
    private static _now: number
    private static _then: number

    public static RenderUpdate: number
    public static PhysicsUpdate: number


    static get Delta(): number
    {
        return (Time._now && Time._then) ? (Time._now - Time._then) : 0
    }
    
    static get RenderDelta(): number
    {
        return Time.Delta / Time.RenderUpdate
    }
    
    static get PhysicsDelta(): number
    {
        return Time.Delta / Time.PhysicsUpdate
    }
    
    static get Now(): Date
    {
        return new Date(Date.now())
    }
    
    static Update(): void
    {
        if (!Time._now)
        {
            Time._now = Date.now()
        }
        
        Time._then = Time._now
        Time._now = Date.now()
    }
}