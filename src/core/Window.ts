interface IWindow
{
    height: number
    width: number
    fullscreen: boolean
}

export class Window
{
    MainPass: any
    PostProcessPasses: any[] = []

    constructor()
    constructor(window: IWindow)
    constructor(window: IWindow =
    {
        height: 1080,
        width: 1920,
        fullscreen: false
    })
    {

    }
}