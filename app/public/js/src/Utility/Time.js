class TimeKeep {
    constructor(period) {
        this.Period = 1000 / period;
        this.Reset();
    }
    Reset() {
        this.Ready = false;
        this.Then = this.Now = Date.now();
        this.Delta = 0;
    }
    Update() {
        this.Then = this.Now;
        this.Now = Date.now();
        if (this.Ready) {
            this.Delta = this.Now - this.Then;
        }
        else {
            this.Delta += this.Now - this.Then;
        }
        if (this.Delta > this.Period) {
            this.Ready = true;
        }
        else {
            this.Ready = false;
        }
    }
}
export default class Time {
    static Init(render, physics) {
        Time.Render = new TimeKeep(render);
        Time.Physics = new TimeKeep(physics);
    }
    static Update() {
        Time.Render.Update();
        Time.Physics.Update();
    }
}
//# sourceMappingURL=Time.js.map