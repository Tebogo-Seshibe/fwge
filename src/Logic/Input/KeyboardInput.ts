import { KeyboardState } from './InputState';

export default class KeyboardInput
{
    //#region Fields
    private readonly TOTAL_KEYS: number = 128
    private keys: KeyboardState[] = []
    //#endregion

    //#region Keys
    public get Keys(): KeyboardState[]
    {
        return [...this.keys]
    }
    //#endregion

    //#region Character
    public get KeyTilde(): KeyboardState
    {
        return this.keys[192]
    }

    public get Key0(): KeyboardState
    {
        return this.keys[48]
    }
    
    public get Key1(): KeyboardState
    {
        return this.keys[49]
    }
    
    public get Key2(): KeyboardState
    {
        return this.keys[50]
    }
    
    public get Key3(): KeyboardState
    {
        return this.keys[51]
    }
    
    public get Key4(): KeyboardState
    {
        return this.keys[52]
    }
    
    public get Key5(): KeyboardState
    {
        return this.keys[53]
    }
    
    public get Key6(): KeyboardState
    {
        return this.keys[54]
    }
    
    public get Key7(): KeyboardState
    {
        return this.keys[55]
    }
    
    public get Key8(): KeyboardState
    {
        return this.keys[56]
    }
    
    public get Key9(): KeyboardState
    {
        return this.keys[57]
    }

    public get KeyHyphen(): KeyboardState
    {
        return this.keys[189]
    }
    
    public get KeyEquals(): KeyboardState
    {
        return this.keys[187]
    }

    public get KeyA(): KeyboardState
    {
        return this.keys[65]
    }
    
    public get KeyB(): KeyboardState
    {
        return this.keys[66]
    }
    
    public get KeyC(): KeyboardState
    {
        return this.keys[67]
    }
    
    public get KeyD(): KeyboardState
    {
        return this.keys[68]
    }
    
    public get KeyE(): KeyboardState
    {
        return this.keys[69]
    }
    
    public get KeyF(): KeyboardState
    {
        return this.keys[70]
    }
    
    public get KeyG(): KeyboardState
    {
        return this.keys[71]
    }
    
    public get KeyH(): KeyboardState
    {
        return this.keys[72]
    }
    
    public get KeyI(): KeyboardState
    {
        return this.keys[73]
    }
    
    public get KeyJ(): KeyboardState
    {
        return this.keys[74]
    }
    
    public get KeyK(): KeyboardState
    {
        return this.keys[75]
    }
    
    public get KeyL(): KeyboardState
    {
        return this.keys[76]
    }
    
    public get KeyM(): KeyboardState
    {
        return this.keys[77]
    }
    
    public get KeyN(): KeyboardState
    {
        return this.keys[78]
    }
    
    public get KeyO(): KeyboardState
    {
        return this.keys[79]
    }
    
    public get KeyP(): KeyboardState
    {
        return this.keys[80]
    }
    
    public get KeyQ(): KeyboardState
    {
        return this.keys[81]
    }
    
    public get KeyR(): KeyboardState
    {
        return this.keys[82]
    }
    
    public get KeyS(): KeyboardState
    {
        return this.keys[83]
    }
    
    public get KeyT(): KeyboardState
    {
        return this.keys[84]
    }
    
    public get KeyU(): KeyboardState
    {
        return this.keys[85]
    }
    
    public get KeyV(): KeyboardState
    {
        return this.keys[86]
    }
    
    public get KeyW(): KeyboardState
    {
        return this.keys[87]
    }
    
    public get KeyX(): KeyboardState
    {
        return this.keys[88]
    }
    
    public get KeyY(): KeyboardState
    {
        return this.keys[89]
    }
    
    public get KeyZ(): KeyboardState
    {
        return this.keys[90]
    }
    
    public get KeyComma(): KeyboardState
    {
        return this.keys[188]
    }
    
    public get KeyPeriod(): KeyboardState
    {
        return this.keys[190]
    }
    
    public get KeySlash(): KeyboardState
    {
        return this.keys[191]
    }

    public get KeySpace(): KeyboardState
    {
        return this.keys[32]
    }
    //#endregion

    //#region Editing
    public get KeyBackspace(): KeyboardState
    {
        return this.keys[8]
    }
    
    public get KeyEnter(): KeyboardState
    {
        return this.keys[13]
    }
    
    public get KeyInsert(): KeyboardState
    {
        return this.keys[45]
    }
    
    public get KeyDelete(): KeyboardState
    {
        return this.keys[46]
    }
    //#endregion

    //#region Navigation
    public get KeyTab(): KeyboardState
    {
        return this.keys[9]
    }
    
    public get KeyHome(): KeyboardState
    {
        return this.keys[36]
    }
    
    public get KeyEnd(): KeyboardState
    {
        return this.keys[35]
    }
    
    public get KeyPgUp(): KeyboardState
    {
        return this.keys[33]
    }
    
    public get KeyPgDown(): KeyboardState
    {
        return this.keys[34]
    }
    
    public get KeyUp(): KeyboardState
    {
        return this.keys[38]
    }
    
    public get KeyDown(): KeyboardState
    {
        return this.keys[40]
    }
    
    public get KeyLeft(): KeyboardState
    {
        return this.keys[37]
    }
    
    public get KeyRight(): KeyboardState
    {
        return this.keys[39]
    }
    //#endregion

    //#region Numpad
    public get Numpad0(): KeyboardState
    {
        return this.keys[96]
    }
    
    public get Numpad1(): KeyboardState
    {
        return this.keys[97]
    }
    
    public get Numpad2(): KeyboardState
    {
        return this.keys[98]
    }
    
    public get Numpad3(): KeyboardState
    {
        return this.keys[99]
    }
    
    public get Numpad4(): KeyboardState
    {
        return this.keys[100]
    }
    
    public get Numpad5(): KeyboardState
    {
        return this.keys[101]
    }
    
    public get Numpad6(): KeyboardState
    {
        return this.keys[102]
    }
    
    public get Numpad7(): KeyboardState
    {
        return this.keys[103]
    }
    
    public get Numpad8(): KeyboardState
    {
        return this.keys[104]
    }
    
    public get Numpad9(): KeyboardState
    {
        return this.keys[105]
    }
    //#endregion

    //#region Modifier
    public get KeyShift(): KeyboardState
    {
        return this.keys[16]
    }
    
    public get KeyCtrl(): KeyboardState
    {
        return this.keys[17]
    }
    
    public get KeyAlt(): KeyboardState
    {
        return this.keys[18]
    }
    //#endregion

    //#region System
    public get KeyPauseBreak(): KeyboardState
    {
        return this.keys[19]
    }

    public get KeyEsc(): KeyboardState
    {
        return this.keys[27]
    }
    
    public get KeyStart(): KeyboardState
    {
        return this.keys[91]
    }
    
    public get KeyContextMenu(): KeyboardState
    {
        return this.keys[93]
    }
    //#endregion

    //#region Function
    public get KeyF1(): KeyboardState
    {
        return this.keys[112]
    }
    
    public get KeyF2(): KeyboardState
    {
        return this.keys[113]
    }
    
    public get KeyF3(): KeyboardState
    {
        return this.keys[114]
    }
    
    public get KeyF4(): KeyboardState
    {
        return this.keys[115]
    }
    
    public get KeyF5(): KeyboardState
    {
        return this.keys[116]
    }
    
    public get KeyF6(): KeyboardState
    {
        return this.keys[117]
    }
    
    public get KeyF7(): KeyboardState
    {
        return this.keys[118]
    }
    
    public get KeyF8(): KeyboardState
    {
        return this.keys[119]
    }
    
    public get KeyF9(): KeyboardState
    {
        return this.keys[120]
    }
    
    public get KeyF10(): KeyboardState
    {
        return this.keys[121]
    }
    
    public get KeyF11(): KeyboardState
    {
        return this.keys[122]
    }
    
    public get KeyF12(): KeyboardState
    {
        return this.keys[123]
    }
    //#endregion

    //#region Lock
    public get KeyCapsLock(): KeyboardState
    {
        return this.keys[20]
    }

    public get KeyNumLock(): KeyboardState
    {
        return this.keys[144]
    }

    public get KeyScrollLock(): KeyboardState
    {
        return this.keys[145]
    }    
    //#endregion
    
    constructor()
    {
        for (var i = 0; i < this.TOTAL_KEYS; ++i)
        {
            this.keys.push(KeyboardState.UP)
        }

        window.onkeyup = (e: KeyboardEvent) =>
        {
            this.keys[e.keyCode] = KeyboardState.UP
            e.cancelBubble = true
        }
        
        window.onkeydown = (e: KeyboardEvent) =>
        {
            if (this.keys[e.keyCode] == KeyboardState.PRESSED)
            {
                this.keys[e.keyCode] = KeyboardState.DOWN
            }
            else
            {
                this.keys[e.keyCode] = KeyboardState.PRESSED
            }
            e.cancelBubble = true
        }
    }
}