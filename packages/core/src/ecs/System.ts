import { Scene } from "../base/Scene";

interface ISystem
{
    async?: boolean;
    tickRate?: number;
}

export class System
{
    readonly tickRate: number;
    readonly async: boolean;

    public name: string;
    protected prevTick: number = -1;
    protected currTick: number = -1;
    protected tickId: number = -1;
    private _scene: Scene;

    public get Scene(): Scene
    {
        return this._scene;
    }

    public set Scene(newScene: Scene)
    {
        this._scene = newScene;
    }

    constructor(scene: Scene, config: ISystem)
    {
        this.name = new.target.name;
        this._scene = scene;
        this.async = config?.async ?? false;
        this.tickRate = config?.tickRate ?? 60;
    }

    public Init(): void { }
    public Start(): void { }
    // @ts-ignore
    public Update(delta: number): void { }
    public Stop(): void { }

    public onStart()
    {
        if (this.async)
        {
            this.prevTick = Date.now();
            this.currTick = Date.now();
            window.setInterval(this.onUpdate.bind(this), this.tickRate);
        }

        this.Start();
    }

    protected onUpdate()
    {
        this.prevTick = this.currTick;
        this.currTick = Date.now();

        this.Update((this.currTick - this.prevTick) / 1000);
    }

    public onStop()
    {
        if (this.async)
        {
            this.prevTick = -1;
            this.currTick = -1;
            window.clearInterval(this.tickId);
        }

        this.Stop();
    }
    //#endregion
}
