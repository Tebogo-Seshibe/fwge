import { InputState } from './InputState'

export default class KeyboardInput
{
    public static Keys: Array<InputState> = new Array(128)

    //#region qwerty
    public static get KeyA(): InputState
    {
        return KeyboardInput.Keys[65]
    }
    //#endregion

    //#region 1-0
    public static get Key0(): InputState
    {
        return KeyboardInput.Keys[48]
    }
    //#endregion

    //#region numpad
    public static get Numpad0(): InputState
    {
        return KeyboardInput.Keys[96]
    }
    //#endregion
    
    public static SetElement(element: HTMLElement): void
    {
        element.onkeyup = (e: KeyboardEvent) =>
        {
            KeyboardInput.Keys[e.keyCode] = InputState.UP
        }

        element.onkeydown = (e: KeyboardEvent) =>
        {
            if (KeyboardInput.Keys[e.keyCode] == InputState.CLICKED)
            {
                KeyboardInput.Keys[e.keyCode] = InputState.DOWN
            }
            else
            {
                KeyboardInput.Keys[e.keyCode] = InputState.PRESSED
            }
        }
    }
}