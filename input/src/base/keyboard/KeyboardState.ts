import { KeyState } from "../InputState"

export class  KeyboardState
{
    public readonly KeyTilde: KeyState
    public readonly Key0: KeyState
    public readonly Key1: KeyState
    public readonly Key2: KeyState
    public readonly Key3: KeyState
    public readonly Key4: KeyState
    public readonly Key5: KeyState
    public readonly Key6: KeyState
    public readonly Key7: KeyState
    public readonly Key8: KeyState
    public readonly Key9: KeyState
    public readonly KeyHyphen: KeyState
    public readonly KeyEquals: KeyState
    public readonly KeyA: KeyState
    public readonly KeyB: KeyState
    public readonly KeyC: KeyState
    public readonly KeyD: KeyState
    public readonly KeyE: KeyState
    public readonly KeyF: KeyState
    public readonly KeyG: KeyState
    public readonly KeyH: KeyState
    public readonly KeyI: KeyState
    public readonly KeyJ: KeyState
    public readonly KeyK: KeyState
    public readonly KeyL: KeyState
    public readonly KeyM: KeyState
    public readonly KeyN: KeyState
    public readonly KeyO: KeyState
    public readonly KeyP: KeyState
    public readonly KeyQ: KeyState
    public readonly KeyR: KeyState
    public readonly KeyS: KeyState
    public readonly KeyT: KeyState
    public readonly KeyU: KeyState
    public readonly KeyV: KeyState
    public readonly KeyW: KeyState
    public readonly KeyX: KeyState
    public readonly KeyY: KeyState
    public readonly KeyZ: KeyState
    public readonly KeyComma: KeyState
    public readonly KeyPeriod: KeyState
    public readonly KeySlash: KeyState
    public readonly KeySpace: KeyState
    public readonly KeyBackspace: KeyState
    public readonly KeyEnter: KeyState
    public readonly KeyInsert: KeyState
    public readonly KeyDelete: KeyState
    public readonly KeyTab: KeyState
    public readonly KeyHome: KeyState
    public readonly KeyEnd: KeyState
    public readonly KeyPgUp: KeyState
    public readonly KeyPgDown: KeyState
    public readonly KeyUp: KeyState
    public readonly KeyDown: KeyState
    public readonly KeyLeft: KeyState
    public readonly KeyRight: KeyState
    public readonly Numpad0: KeyState
    public readonly Numpad1: KeyState
    public readonly Numpad2: KeyState
    public readonly Numpad3: KeyState
    public readonly Numpad4: KeyState
    public readonly Numpad5: KeyState
    public readonly Numpad6: KeyState
    public readonly Numpad7: KeyState
    public readonly Numpad8: KeyState
    public readonly Numpad9: KeyState
    public readonly KeyShift: KeyState
    public readonly KeyCtrl: KeyState
    public readonly KeyAlt: KeyState
    public readonly KeyPauseBreak: KeyState
    public readonly KeyEsc: KeyState
    public readonly KeyStart: KeyState
    public readonly KeyContextMenu: KeyState
    public readonly KeyF1: KeyState
    public readonly KeyF2: KeyState
    public readonly KeyF3: KeyState
    public readonly KeyF4: KeyState
    public readonly KeyF5: KeyState
    public readonly KeyF6: KeyState
    public readonly KeyF7: KeyState
    public readonly KeyF8: KeyState
    public readonly KeyF9: KeyState
    public readonly KeyF10: KeyState
    public readonly KeyF11: KeyState
    public readonly KeyF12: KeyState
    public readonly KeyCapsLock: KeyState
    public readonly KeyNumLock: KeyState
    public readonly KeyScrollLock: KeyState

    constructor(keys: KeyState[])
    {
        this.KeyTilde = keys[192]
        this.Key0 = keys[48]
        this.Key1 = keys[49]
        this.Key2 = keys[50]
        this.Key3 = keys[51]
        this.Key4 = keys[52]
        this.Key5 = keys[53]
        this.Key6 = keys[54]
        this.Key7 = keys[55]
        this.Key8 = keys[56]
        this.Key9 = keys[57]
        this.KeyHyphen = keys[189]
        this.KeyEquals = keys[187]
        this.KeyA = keys[65]
        this.KeyB = keys[66]
        this.KeyC = keys[67]
        this.KeyD = keys[68]
        this.KeyE = keys[69]
        this.KeyF = keys[70]
        this.KeyG = keys[71]
        this.KeyH = keys[72]
        this.KeyI = keys[73]
        this.KeyJ = keys[74]
        this.KeyK = keys[75]
        this.KeyL = keys[76]
        this.KeyM = keys[77]
        this.KeyN = keys[78]
        this.KeyO = keys[79]
        this.KeyP = keys[80]
        this.KeyQ = keys[81]
        this.KeyR = keys[82]
        this.KeyS = keys[83]
        this.KeyT = keys[84]
        this.KeyU = keys[85]
        this.KeyV = keys[86]
        this.KeyW = keys[87]
        this.KeyX = keys[88]
        this.KeyY = keys[89]
        this.KeyZ = keys[90]
        this.KeyComma = keys[188]
        this.KeyPeriod = keys[190]
        this.KeySlash = keys[191]
        this.KeySpace = keys[32]
        this.KeyBackspace = keys[8]
        this.KeyEnter = keys[13]
        this.KeyInsert = keys[45]
        this.KeyDelete = keys[46]
        this.KeyTab = keys[9]
        this.KeyHome = keys[36]
        this.KeyEnd = keys[35]
        this.KeyPgUp = keys[33]
        this.KeyPgDown = keys[34]
        this.KeyUp = keys[38]
        this.KeyDown = keys[40]
        this.KeyLeft = keys[37]
        this.KeyRight = keys[39]
        this.Numpad0 = keys[96]
        this.Numpad1 = keys[97]
        this.Numpad2 = keys[98]
        this.Numpad3 = keys[99]
        this.Numpad4 = keys[100]
        this.Numpad5 = keys[101]
        this.Numpad6 = keys[102]
        this.Numpad7 = keys[103]
        this.Numpad8 = keys[104]
        this.Numpad9 = keys[105]
        this.KeyShift = keys[16]
        this.KeyCtrl = keys[17]
        this.KeyAlt = keys[18]
        this.KeyPauseBreak = keys[19]
        this.KeyEsc = keys[27]
        this.KeyStart = keys[91]
        this.KeyContextMenu = keys[93]
        this.KeyF1 = keys[112]
        this.KeyF2 = keys[113]
        this.KeyF3 = keys[114]
        this.KeyF4 = keys[115]
        this.KeyF5 = keys[116]
        this.KeyF6 = keys[117]
        this.KeyF7 = keys[118]
        this.KeyF8 = keys[119]
        this.KeyF9 = keys[120]
        this.KeyF10 = keys[121]
        this.KeyF11 = keys[122]
        this.KeyF12 = keys[123]
        this.KeyCapsLock = keys[20]
        this.KeyNumLock = keys[144]
        this.KeyScrollLock = keys[145]
    }    
}
