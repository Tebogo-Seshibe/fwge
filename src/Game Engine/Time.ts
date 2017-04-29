/**
 * @name        Time
 * @description This is the running clock that keeps track of elapsed time
 *              between render frames.
 * @module      FWGE.Game
 */
export class Time
{
    private now:    number | undefined;
    private then:   number | undefined;
    
    /**
     * @property    Delta: {Number} [read]
     * @description Some description
     */
    get Delta(): number
    {
        if (this.now && this.then)
            return (this.now - this.then) / 60;
        return 0;
    }

    /**
     * @property    DeltaTime: {Number} [read]
     * @description Some description
     */
    get DeltaTime(): number
    {
        if (this.now && this.then)
            return this.now - this.then;
        return 0;
    }

    /**
     * @property    Now: {Date} [read]
     * @description Some description
     */
    get Now(): Date
    {
        return new Date(Date.now());
    }

    /**
     * @property    TimeUpdate: {undefined}
     * @description Some description
     */
    Update(): void
    {
        if (!this.now && !this.then)
            this.now = this.then = Date.now();
        else
        {
            this.then = this.now;
            this.now = Date.now();
        }
    }

    Reset(): void
    {
        this.now = this.then = undefined;
    }
}

