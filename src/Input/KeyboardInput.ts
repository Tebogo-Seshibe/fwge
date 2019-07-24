import { InputState } from './InputState'

export default class KeyboardInput
{
    public Keys: InputState[] = new Array<InputState>(128)

    //#region qwerty
    public get KeyA(): InputState
    {
        return this.Keys[65]
    }
    //#endregion

    //#region 1-0
    public get Key0(): InputState
    {
        return this.Keys[48]
    }
    //#endregion

    //#region numpad
    public get Numpad0(): InputState
    {
        return this.Keys[96]
    }
    //#endregion
    
    constructor(element: HTMLCanvasElement)
    {
        this.Keys.forEach((_, index) => this.Keys[index] = InputState.UP)

        element.onkeyup = (e: KeyboardEvent) =>
        {
            this.Keys[e.keyCode] = InputState.UP
        }

        element.onkeydown = (e: KeyboardEvent) =>
        {
            if (this.Keys[e.keyCode] == InputState.CLICKED)
            {
                this.Keys[e.keyCode] = InputState.DOWN
            }
            else
            {
                this.Keys[e.keyCode] = InputState.PRESSED
            }
        }
    }
}