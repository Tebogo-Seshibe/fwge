import { InputState } from './InputState'

export default class KeyboardInput
{
    //#region Fields
    private readonly TOTAL_KEYS: number = 128
    private keys: InputState[] = new Array<InputState>()
    //#endregion

    //#region Keys
    public get Keys(): InputState[]
    {
        return [...this.keys]
    }
    //#endregion

    //#region Character
    public get KeyTilde(): InputState
    {
        return this.keys[192]
    }

    public get Key0(): InputState
    {
        return this.keys[48]
    }
    
    public get Key1(): InputState
    {
        return this.keys[49]
    }
    
    public get Key2(): InputState
    {
        return this.keys[50]
    }
    
    public get Key3(): InputState
    {
        return this.keys[51]
    }
    
    public get Key4(): InputState
    {
        return this.keys[52]
    }
    
    public get Key5(): InputState
    {
        return this.keys[53]
    }
    
    public get Key6(): InputState
    {
        return this.keys[54]
    }
    
    public get Key7(): InputState
    {
        return this.keys[55]
    }
    
    public get Key8(): InputState
    {
        return this.keys[56]
    }
    
    public get Key9(): InputState
    {
        return this.keys[57]
    }

    public get KeyHyphen(): InputState
    {
        return this.keys[189]
    }
    
    public get KeyEquals(): InputState
    {
        return this.keys[187]
    }

    public get KeyA(): InputState
    {
        return this.keys[65]
    }
    
    public get KeyB(): InputState
    {
        return this.keys[66]
    }
    
    public get KeyC(): InputState
    {
        return this.keys[67]
    }
    
    public get KeyD(): InputState
    {
        return this.keys[68]
    }
    
    public get KeyE(): InputState
    {
        return this.keys[69]
    }
    
    public get KeyF(): InputState
    {
        return this.keys[70]
    }
    
    public get KeyG(): InputState
    {
        return this.keys[71]
    }
    
    public get KeyH(): InputState
    {
        return this.keys[72]
    }
    
    public get KeyI(): InputState
    {
        return this.keys[73]
    }
    
    public get KeyJ(): InputState
    {
        return this.keys[74]
    }
    
    public get KeyK(): InputState
    {
        return this.keys[75]
    }
    
    public get KeyL(): InputState
    {
        return this.keys[76]
    }
    
    public get KeyM(): InputState
    {
        return this.keys[77]
    }
    
    public get KeyN(): InputState
    {
        return this.keys[78]
    }
    
    public get KeyO(): InputState
    {
        return this.keys[79]
    }
    
    public get KeyP(): InputState
    {
        return this.keys[80]
    }
    
    public get KeyQ(): InputState
    {
        return this.keys[81]
    }
    
    public get KeyR(): InputState
    {
        return this.keys[82]
    }
    
    public get KeyS(): InputState
    {
        return this.keys[83]
    }
    
    public get KeyT(): InputState
    {
        return this.keys[84]
    }
    
    public get KeyU(): InputState
    {
        return this.keys[85]
    }
    
    public get KeyV(): InputState
    {
        return this.keys[86]
    }
    
    public get KeyW(): InputState
    {
        return this.keys[87]
    }
    
    public get KeyX(): InputState
    {
        return this.keys[88]
    }
    
    public get KeyY(): InputState
    {
        return this.keys[89]
    }
    
    public get KeyZ(): InputState
    {
        return this.keys[90]
    }
    
    public get KeyComma(): InputState
    {
        return this.keys[188]
    }
    
    public get KeyPeriod(): InputState
    {
        return this.keys[190]
    }
    
    public get KeySlash(): InputState
    {
        return this.keys[191]
    }

    public get KeySpace(): InputState
    {
        return this.keys[32]
    }
    //#endregion

    //#region Editing
    public get KeyBackspace(): InputState
    {
        return this.keys[8]
    }
    
    public get KeyEnter(): InputState
    {
        return this.keys[13]
    }
    
    public get KeyInsert(): InputState
    {
        return this.keys[45]
    }
    
    public get KeyDelete(): InputState
    {
        return this.keys[46]
    }
    //#endregion

    //#region Navigation
    public get KeyTab(): InputState
    {
        return this.keys[9]
    }
    
    public get KeyHome(): InputState
    {
        return this.keys[36]
    }
    
    public get KeyEnd(): InputState
    {
        return this.keys[35]
    }
    
    public get KeyPgUp(): InputState
    {
        return this.keys[33]
    }
    
    public get KeyPgDown(): InputState
    {
        return this.keys[34]
    }
    
    public get KeyUp(): InputState
    {
        return this.keys[38]
    }
    
    public get KeyDown(): InputState
    {
        return this.keys[40]
    }
    
    public get KeyLeft(): InputState
    {
        return this.keys[37]
    }
    
    public get KeyRight(): InputState
    {
        return this.keys[39]
    }
    //#endregion

    //#region Numpad
    public get Numpad0(): InputState
    {
        return this.keys[96]
    }
    
    public get Numpad1(): InputState
    {
        return this.keys[97]
    }
    
    public get Numpad2(): InputState
    {
        return this.keys[98]
    }
    
    public get Numpad3(): InputState
    {
        return this.keys[99]
    }
    
    public get Numpad4(): InputState
    {
        return this.keys[100]
    }
    
    public get Numpad5(): InputState
    {
        return this.keys[101]
    }
    
    public get Numpad6(): InputState
    {
        return this.keys[102]
    }
    
    public get Numpad7(): InputState
    {
        return this.keys[103]
    }
    
    public get Numpad8(): InputState
    {
        return this.keys[104]
    }
    
    public get Numpad9(): InputState
    {
        return this.keys[105]
    }
    //#endregion

    //#region Modifier
    public get KeyShift(): InputState
    {
        return this.keys[16]
    }
    
    public get KeyCtrl(): InputState
    {
        return this.keys[17]
    }
    
    public get KeyAlt(): InputState
    {
        return this.keys[18]
    }
    //#endregion

    //#region System
    public get KeyPauseBreak(): InputState
    {
        return this.keys[19]
    }

    public get KeyEsc(): InputState
    {
        return this.keys[27]
    }
    
    public get KeyStart(): InputState
    {
        return this.keys[91]
    }
    
    public get KeyContextMenu(): InputState
    {
        return this.keys[93]
    }
    //#endregion

    //#region Function
    public get KeyF1(): InputState
    {
        return this.keys[112]
    }
    
    public get KeyF2(): InputState
    {
        return this.keys[113]
    }
    
    public get KeyF3(): InputState
    {
        return this.keys[114]
    }
    
    public get KeyF4(): InputState
    {
        return this.keys[115]
    }
    
    public get KeyF5(): InputState
    {
        return this.keys[116]
    }
    
    public get KeyF6(): InputState
    {
        return this.keys[117]
    }
    
    public get KeyF7(): InputState
    {
        return this.keys[118]
    }
    
    public get KeyF8(): InputState
    {
        return this.keys[119]
    }
    
    public get KeyF9(): InputState
    {
        return this.keys[120]
    }
    
    public get KeyF10(): InputState
    {
        return this.keys[121]
    }
    
    public get KeyF11(): InputState
    {
        return this.keys[122]
    }
    
    public get KeyF12(): InputState
    {
        return this.keys[123]
    }
    //#endregion

    //#region Lock
    public get KeyCapsLock(): InputState
    {
        return this.keys[20]
    }

    public get KeyNumLock(): InputState
    {
        return this.keys[144]
    }

    public get KeyScrollLock(): InputState
    {
        return this.keys[145]
    }    
    //#endregion
    
    constructor()
    {
        for (var i = 0; i < this.TOTAL_KEYS; ++i)
        {
            this.keys.push(InputState.UP)
        }

        window.onkeyup = (e: KeyboardEvent) =>
        {
            this.keys[e.keyCode] = InputState.UP
            e.cancelBubble = true
        }
        
        window.onkeydown = (e: KeyboardEvent) =>
        {
            if (this.keys[e.keyCode] == InputState.CLICKED)
            {
                this.keys[e.keyCode] = InputState.DOWN
            }
            else
            {
                this.keys[e.keyCode] = InputState.PRESSED
            }
            e.cancelBubble = true
        }
    }
}