import { IDelay, CalcuateDelay } from "@fwge/common"
import { Scene, SharedComponent } from "@fwge/core"

interface IAudioPlayer
{
    source: string
}

export class AudioPlayer extends SharedComponent
{
    private _audio?: HTMLAudioElement = new Audio()

    public set Source(source: string)
    {
        this.Pause()
        this._audio = new Audio(source)
    }

    constructor()
    constructor(args: IAudioPlayer)
    constructor(args?: IAudioPlayer)
    {
        super()

        if (args)
        {       
            this.Source = args.source
        }
    }

    public Play(): void
    public Play(delay: IDelay): void
    public Play(delay: IDelay = {}): void
    {
        setTimeout(() => 
        {
            if (!this._audio)
                return

            this._audio!.play()
        },
        CalcuateDelay(delay))
    }

    public Pause(): void
    public Pause(delay: IDelay): void
    public Pause(delay: IDelay = {}): void
    {
        setTimeout(() => 
        {
            if (!this._audio)
                return

            this._audio!.pause()
        },
        CalcuateDelay(delay))
    }
}
