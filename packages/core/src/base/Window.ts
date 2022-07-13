interface IWindow
{
    height?: number
    width?: number
    fullscreen?: boolean
}

export class Window
{
    MainPass: any = {}
    PostProcessPasses: any[] = []

    Height: number
    Width: number
    FullScreen: boolean

    constructor()
    constructor(window: IWindow)
    constructor(window: IWindow = { })
    {
        this.Height = window.height ?? 1080
        this.Width = window.width ?? 1920
        this.FullScreen = window.fullscreen ?? false
    }
}
