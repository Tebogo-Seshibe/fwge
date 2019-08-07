import { InputState } from './InputState'

export default class KeyboardInput
{
    private readonly TOTAL_KEYS: number = 128
    public Keys: InputState[] = new Array<InputState>()

    //#region Character
    public get KeyTilde(): InputState
    {
        return this.Keys[192]
    }

    public get Key0(): InputState
    {
        return this.Keys[48]
    }
    
    public get Key1(): InputState
    {
        return this.Keys[49]
    }
    
    public get Key2(): InputState
    {
        return this.Keys[50]
    }
    
    public get Key3(): InputState
    {
        return this.Keys[51]
    }
    
    public get Key4(): InputState
    {
        return this.Keys[52]
    }
    
    public get Key5(): InputState
    {
        return this.Keys[53]
    }
    
    public get Key6(): InputState
    {
        return this.Keys[54]
    }
    
    public get Key7(): InputState
    {
        return this.Keys[55]
    }
    
    public get Key8(): InputState
    {
        return this.Keys[56]
    }
    
    public get Key9(): InputState
    {
        return this.Keys[57]
    }

    public get KeyHyphen(): InputState
    {
        return this.Keys[189]
    }
    
    public get KeyEquals(): InputState
    {
        return this.Keys[187]
    }

    public get KeyA(): InputState
    {
        return this.Keys[65]
    }
    
    public get KeyB(): InputState
    {
        return this.Keys[66]
    }
    
    public get KeyC(): InputState
    {
        return this.Keys[67]
    }
    
    public get KeyD(): InputState
    {
        return this.Keys[68]
    }
    
    public get KeyE(): InputState
    {
        return this.Keys[69]
    }
    
    public get KeyF(): InputState
    {
        return this.Keys[70]
    }
    
    public get KeyG(): InputState
    {
        return this.Keys[71]
    }
    
    public get KeyH(): InputState
    {
        return this.Keys[72]
    }
    
    public get KeyI(): InputState
    {
        return this.Keys[73]
    }
    
    public get KeyJ(): InputState
    {
        return this.Keys[74]
    }
    
    public get KeyK(): InputState
    {
        return this.Keys[75]
    }
    
    public get KeyL(): InputState
    {
        return this.Keys[76]
    }
    
    public get KeyM(): InputState
    {
        return this.Keys[77]
    }
    
    public get KeyN(): InputState
    {
        return this.Keys[78]
    }
    
    public get KeyO(): InputState
    {
        return this.Keys[79]
    }
    
    public get KeyP(): InputState
    {
        return this.Keys[80]
    }
    
    public get KeyQ(): InputState
    {
        return this.Keys[81]
    }
    
    public get KeyR(): InputState
    {
        return this.Keys[82]
    }
    
    public get KeyS(): InputState
    {
        return this.Keys[83]
    }
    
    public get KeyT(): InputState
    {
        return this.Keys[84]
    }
    
    public get KeyU(): InputState
    {
        return this.Keys[85]
    }
    
    public get KeyV(): InputState
    {
        return this.Keys[86]
    }
    
    public get KeyW(): InputState
    {
        return this.Keys[87]
    }
    
    public get KeyX(): InputState
    {
        return this.Keys[88]
    }
    
    public get KeyY(): InputState
    {
        return this.Keys[89]
    }
    
    public get KeyZ(): InputState
    {
        return this.Keys[90]
    }
    
    public get KeyComma(): InputState
    {
        return this.Keys[188]
    }
    
    public get KeyPeriod(): InputState
    {
        return this.Keys[190]
    }
    
    public get KeySlash(): InputState
    {
        return this.Keys[191]
    }

    public get KeySpace(): InputState
    {
        return this.Keys[32]
    }
    //#endregion

    //#region Editing
    public get KeyBackspace(): InputState
    {
        return this.Keys[8]
    }
    
    public get KeyEnter(): InputState
    {
        return this.Keys[13]
    }
    
    public get KeyInsert(): InputState
    {
        return this.Keys[45]
    }
    
    public get KeyDelete(): InputState
    {
        return this.Keys[46]
    }
    //#endregion

    //#region Navigation
    public get KeyTab(): InputState
    {
        return this.Keys[9]
    }
    
    public get KeyHome(): InputState
    {
        return this.Keys[36]
    }
    
    public get KeyEnd(): InputState
    {
        return this.Keys[35]
    }
    
    public get KeyPgUp(): InputState
    {
        return this.Keys[33]
    }
    
    public get KeyPgDown(): InputState
    {
        return this.Keys[34]
    }
    
    public get KeyUp(): InputState
    {
        return this.Keys[38]
    }
    
    public get KeyDown(): InputState
    {
        return this.Keys[40]
    }
    
    public get KeyLeft(): InputState
    {
        return this.Keys[37]
    }
    
    public get KeyRight(): InputState
    {
        return this.Keys[39]
    }
    //#endregion

    //#region Numpad
    public get Numpad0(): InputState
    {
        return this.Keys[96]
    }
    
    public get Numpad1(): InputState
    {
        return this.Keys[97]
    }
    
    public get Numpad2(): InputState
    {
        return this.Keys[98]
    }
    
    public get Numpad3(): InputState
    {
        return this.Keys[99]
    }
    
    public get Numpad4(): InputState
    {
        return this.Keys[100]
    }
    
    public get Numpad5(): InputState
    {
        return this.Keys[101]
    }
    
    public get Numpad6(): InputState
    {
        return this.Keys[102]
    }
    
    public get Numpad7(): InputState
    {
        return this.Keys[103]
    }
    
    public get Numpad8(): InputState
    {
        return this.Keys[104]
    }
    
    public get Numpad9(): InputState
    {
        return this.Keys[105]
    }
    //#endregion

    //#region Modifier
    public get KeyShift(): InputState
    {
        return this.Keys[16]
    }
    
    public get KeyCtrl(): InputState
    {
        return this.Keys[17]
    }
    
    public get KeyAlt(): InputState
    {
        return this.Keys[18]
    }
    //#endregion

    //#region System
    public get KeyPauseBreak(): InputState
    {
        return this.Keys[19]
    }

    public get KeyEsc(): InputState
    {
        return this.Keys[27]
    }
    
    public get KeyStart(): InputState
    {
        return this.Keys[91]
    }
    
    public get KeyContextMenu(): InputState
    {
        return this.Keys[93]
    }
    //#endregion

    //#region Function
    public get KeyF1(): InputState
    {
        return this.Keys[112]
    }
    
    public get KeyF2(): InputState
    {
        return this.Keys[113]
    }
    
    public get KeyF3(): InputState
    {
        return this.Keys[114]
    }
    
    public get KeyF4(): InputState
    {
        return this.Keys[115]
    }
    
    public get KeyF5(): InputState
    {
        return this.Keys[116]
    }
    
    public get KeyF6(): InputState
    {
        return this.Keys[117]
    }
    
    public get KeyF7(): InputState
    {
        return this.Keys[118]
    }
    
    public get KeyF8(): InputState
    {
        return this.Keys[119]
    }
    
    public get KeyF9(): InputState
    {
        return this.Keys[120]
    }
    
    public get KeyF10(): InputState
    {
        return this.Keys[121]
    }
    
    public get KeyF11(): InputState
    {
        return this.Keys[122]
    }
    
    public get KeyF12(): InputState
    {
        return this.Keys[123]
    }
    //#endregion

    //#region Lock
    public get KeyCapsLock(): InputState
    {
        return this.Keys[20]
    }

    public get KeyNumLock(): InputState
    {
        return this.Keys[144]
    }

    public get KeyScrollLock(): InputState
    {
        return this.Keys[145]
    }    
    //#endregion
    
    constructor()
    {
        for (var i = 0; i < this.TOTAL_KEYS; ++i)
        {
            this.Keys.push(InputState.UP)
        }

        window.onkeyup = (e: KeyboardEvent) =>
        {
            this.Keys[e.keyCode] = InputState.UP
        }

        window.onkeydown = (e: KeyboardEvent) =>
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