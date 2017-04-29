/**
 * @name        Input
 * @description Input.module handles all user key and mouse inputs.
 * @module      FWGE.Game
 */
export class Input
{
    private static UP_K:    number = 0;
    private static PRESS_K: number = 128;
    private static DOWN_K:  number = 256;
    private static END_K:   number = 384;
    private static Keys:    Array<boolean> = new Array<boolean>();

    private static UP_M:    number = 0;
    private static CLICK_M: number = 3;
    private static DOWN_M:  number = 6;
    private static WHEEL_U: number = 9;
    private static WHEEL_D: number = 10;
    private static END_M:   number = 11;
    private static Mouse:   Array<boolean> = new Array<boolean>();

    private static _X:      number = 0;
    private static _Y:      number = 1;
    private static CURR_A:  number = 0;
    private static PREV_A:  number = 2;
    private static DELTA_A: number = 4;
    private static END_A:   number = 8;
    private static Axis:    Array<number | undefined> = new Array<number | undefined>();
    
    private static handle_event(e: MouseEvent | PointerEvent | KeyboardEvent): number
    {
        var key = e instanceof MouseEvent ? e.button :  e.which || 0;
        
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;

        return key;
    }

    constructor()
    {
        for (var i = 0; i < Input.PRESS_K; ++i)
            Input.Keys.push(true);

        for (var i = Input.PRESS_K; i < Input.END_K; ++i)
            Input.Keys.push(false);

        for (var i = 0; i < Input.CLICK_M; ++i)
            Input.Mouse.push(true);

        for (var i = Input.CLICK_M; i < Input.END_M; ++i)
            Input.Mouse.push(false);

        for (var i = 0; i < Input.END_A; ++i)
            Input.Axis.push(undefined);

        window.onkeyup = function onkeyup(e)
        {
            var key = Input.handle_event(e);

            Input.Keys[key + Input.UP_K]      = true;
            Input.Keys[key + Input.PRESS_K]   = false;
            Input.Keys[key + Input.DOWN_K]    = false;
        };
        window.onkeydown = function onkeydown(e)
        {
            var key = Input.handle_event(e);

            Input.Keys[key + Input.UP_K]      = false;
            Input.Keys[key + Input.PRESS_K]   = true;
            Input.Keys[key + Input.DOWN_K]    = true;
        };

        document.body.oncontextmenu = function oncontextmenu(e) { Input.handle_event(e); return false; };
        window.onmouseenter = function onmouseenter(e)
        {
            Input.Axis[Input._X + Input.PREV_A] = e.clientX;
            Input.Axis[Input._Y + Input.PREV_A] = e.clientY;
            
            Input.Axis[Input._X + Input.CURR_A] = e.clientX;
            Input.Axis[Input._Y + Input.CURR_A] = e.clientY;

            Input.Axis[Input._X + Input.DELTA_A] = 0;
            Input.Axis[Input._Y + Input.DELTA_A] = 0;
        };
        window.onmousemove = function onmousemove(e) 
        {
            if (!Input.Axis[Input._X + Input.CURR_A] || !Input.Axis[Input._Y + Input.CURR_A])
            {
                Input.Axis[Input._X + Input.CURR_A] = e.clientX;
                Input.Axis[Input._Y + Input.CURR_A] = e.clientY;
            }

            Input.Axis[Input._X + Input.PREV_A] = Input.Axis[Input._X + Input.CURR_A];
            Input.Axis[Input._Y + Input.PREV_A] = Input.Axis[Input._Y + Input.CURR_A];
            Input.Axis[Input._X + Input.CURR_A] = e.clientX;
            Input.Axis[Input._Y + Input.CURR_A] = e.clientY;

            Input.Axis[Input._X + Input.DELTA_A] = Input.Axis[Input._X + Input.CURR_A] - Input.Axis[Input._X + Input.PREV_A];
            Input.Axis[Input._Y + Input.DELTA_A] = Input.Axis[Input._Y + Input.CURR_A] - Input.Axis[Input._Y + Input.PREV_A];
        };
        window.onmouseleave = function onmouseleave(e)
        {
            Input.Axis[Input._X + Input.PREV_A] = undefined;
            Input.Axis[Input._Y + Input.PREV_A] = undefined;
            
            Input.Axis[Input._X + Input.CURR_A] = undefined;
            Input.Axis[Input._Y + Input.CURR_A] = undefined;

            Input.Axis[Input._X + Input.DELTA_A] = 0;
            Input.Axis[Input._Y + Input.DELTA_A] = 0;
        };
        window.onmouseup = function onmouseup(e)   
        {
            var key = Input.handle_event(e);

            Input.Mouse[key + Input.UP_M] = true;
            Input.Mouse[key + Input.CLICK_M] = false;
            Input.Mouse[key + Input.DOWN_M] = false;
        };
        window.onmousedown = function onmousedown(e) 
        {
            var key = Input.handle_event(e);

            Input.Mouse[key + Input.UP_M] = false;
            Input.Mouse[key + Input.CLICK_M] = true;
            Input.Mouse[key + Input.DOWN_M] = true;
        };
        window.onmousewheel = function onmousewheel(e)
        {
            Input.Mouse[e.deltaY < 0 ? Input.WHEEL_U : Input.WHEEL_D] = true;
        };
    }

    

    /**
     * @property    KEY_F1_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF1Up(): boolean
    {
        return Input.Keys[112 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F1_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF1Press(): boolean
    {
        return Input.Keys[112 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F1_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF1Down(): boolean
    {
        return Input.Keys[112 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F2_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF2Up(): boolean
    {
        return Input.Keys[113 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F2_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF2Press(): boolean
    {
        return Input.Keys[113 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F2_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF2Down(): boolean
    {
        return Input.Keys[113 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F3_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF3Up(): boolean
    {
        return Input.Keys[114 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F3_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF3Press(): boolean
    {
        return Input.Keys[114 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F3_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF3Down(): boolean
    {
        return Input.Keys[114 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F4_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF4Up(): boolean
    {
        return Input.Keys[115 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F4_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF4Press(): boolean
    {
        return Input.Keys[115 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F4_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF4Down(): boolean
    {
        return Input.Keys[115 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F5_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF5Up(): boolean
    {
        return Input.Keys[116 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F5_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF5Press(): boolean
    {
        return Input.Keys[116 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F5_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF5Down(): boolean
    {
        return Input.Keys[116 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F6_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF6Up(): boolean
    {
        return Input.Keys[117 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F6_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF6Press(): boolean
    {
        return Input.Keys[117 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F6_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF6Down(): boolean
    {
        return Input.Keys[117 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F7_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF7Up(): boolean
    {
        return Input.Keys[118 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F7_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF7Press(): boolean
    {
        return Input.Keys[118 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F7_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF7Down(): boolean
    {
        return Input.Keys[118 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F8_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF8Up(): boolean
    {
        return Input.Keys[119 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F8_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF8Press(): boolean
    {
        return Input.Keys[119 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F8_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF8Down(): boolean
    {
        return Input.Keys[119 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F9_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF9Up(): boolean
    {
        return Input.Keys[120 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F9_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF9Press(): boolean
    {
        return Input.Keys[120 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F9_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF9Down(): boolean
    {
        return Input.Keys[120 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F10_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF10Up(): boolean
    {
        return Input.Keys[121 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F10_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF10Press(): boolean
    {
        return Input.Keys[121 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F10_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF10Down(): boolean
    {
        return Input.Keys[121 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F11_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF11Up(): boolean
    {
        return Input.Keys[122 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F11_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF11Press(): boolean
    {
        return Input.Keys[122 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F11_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF11Down(): boolean
    {
        return Input.Keys[122 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F12_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF12Up(): boolean
    {
        return Input.Keys[123 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F12_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF12Press(): boolean
    {
        return Input.Keys[123 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F12_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF12Down(): boolean
    {
        return Input.Keys[123 + Input.DOWN_K];
    }


    
    /**
     * @property    KEY_0_UP: {Boolean} [read]
     * @description Some description
     */
    get Key0Up(): boolean
    {
        return Input.Keys[48 + Input.UP_K];
    }
    
    /**
     * @property    KEY_0_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key0Press(): boolean
    {
        return Input.Keys[48 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_0_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key0Down(): boolean
    {
        return Input.Keys[48 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_1_UP: {Boolean} [read]
     * @description Some description
     */
    get Key1Up(): boolean
    {
        return Input.Keys[49 + Input.UP_K];
    }
    
    /**
     * @property    KEY_1_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key1Press(): boolean
    {
        return Input.Keys[49 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_1_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key1Down(): boolean
    {
        return Input.Keys[49 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_2_UP: {Boolean} [read]
     * @description Some description
     */
    get Key2Up(): boolean
    {
        return Input.Keys[50 + Input.UP_K];
    }
    
    /**
     * @property    KEY_2_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key2Press(): boolean
    {
        return Input.Keys[50 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_2_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key2Down(): boolean
    {
        return Input.Keys[50 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_3_UP: {Boolean} [read]
     * @description Some description
     */
    get Key3Up(): boolean
    {
        return Input.Keys[51 + Input.UP_K];
    }
    
    /**
     * @property    KEY_3_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key3Press(): boolean
    {
        return Input.Keys[51 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_3_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key3Down(): boolean
    {
        return Input.Keys[51 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_4_UP: {Boolean} [read]
     * @description Some description
     */
    get Key4Up(): boolean
    {
        return Input.Keys[52 + Input.UP_K];
    }
    
    /**
     * @property    KEY_4_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key4Press(): boolean
    {
        return Input.Keys[52 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_4_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key4Down(): boolean
    {
        return Input.Keys[52 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_5_UP: {Boolean} [read]
     * @description Some description
     */
    get Key5Up(): boolean
    {
        return Input.Keys[53 + Input.UP_K];
    }
    
    /**
     * @property    KEY_5_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key5Press(): boolean
    {
        return Input.Keys[53 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_5_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key5Down(): boolean
    {
        return Input.Keys[53 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_6_UP: {Boolean} [read]
     * @description Some description
     */
    get Key6Up(): boolean
    {
        return Input.Keys[54 + Input.UP_K];
    }
    
    /**
     * @property    KEY_6_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key6Press(): boolean
    {
        return Input.Keys[54 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_6_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key6Down(): boolean
    {
        return Input.Keys[54 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_7_UP: {Boolean} [read]
     * @description Some description
     */
    get Key7Up(): boolean
    {
        return Input.Keys[55 + Input.UP_K];
    }
    
    /**
     * @property    KEY_7_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key7Press(): boolean
    {
        return Input.Keys[55 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_7_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key7Down(): boolean
    {
        return Input.Keys[55 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_8_UP: {Boolean} [read]
     * @description Some description
     */
    get Key8Up(): boolean
    {
        return Input.Keys[56 + Input.UP_K];
    }
    
    /**
     * @property    KEY_8_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key8Press(): boolean
    {
        return Input.Keys[56 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_8_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key8Down(): boolean
    {
        return Input.Keys[56 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_9_UP: {Boolean} [read]
     * @description Some description
     */
    get Key9Up(): boolean
    {
        return Input.Keys[57 + Input.UP_K];
    }
    
    /**
     * @property    KEY_9_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key9Press(): boolean
    {
        return Input.Keys[57 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_9_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key9Down(): boolean
    {
        return Input.Keys[57 + Input.DOWN_K];
    }


    
    /**
     * @property    NUMPAD_0_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad0Up(): boolean
    {
        return Input.Keys[96 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_0_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad0Press(): boolean
    {
            return Input.Keys[96 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_0_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad0Down(): boolean
    {
        return Input.Keys[96 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_1_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad1Up(): boolean
    {
        return Input.Keys[97 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_1_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad1Press(): boolean
    {
        return Input.Keys[97 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_1_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad1Down(): boolean
    {
        return Input.Keys[97 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_2_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad2Up(): boolean
    {
        return Input.Keys[98 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_2_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad2Press(): boolean
    {
        return Input.Keys[98 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_2_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad2Down(): boolean
    {
        return Input.Keys[98 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_3_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad3Up(): boolean
    {
        return Input.Keys[99 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_3_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad3Press(): boolean
    {
        return Input.Keys[99 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_3_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad3Down(): boolean
    {
        return Input.Keys[99 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_4_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad4Up(): boolean
    {
        return Input.Keys[100 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_4_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad4Press(): boolean
    {
        return Input.Keys[100 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_4_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad4Down(): boolean
    {
        return Input.Keys[100 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_5_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad5Up(): boolean
    {
        return Input.Keys[101 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_5_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad5Press(): boolean
    {
        return Input.Keys[101 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_5_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad5Down(): boolean
    {
        return Input.Keys[101 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_6_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad6Up(): boolean
    {
        return Input.Keys[102 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_6_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad6Press(): boolean
    {
        return Input.Keys[102 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_6_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad6Down(): boolean
    {
        return Input.Keys[102 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_7_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad7Up(): boolean
    {
        return Input.Keys[103 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_7_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad7Press(): boolean
    {
        return Input.Keys[103 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_7_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad7Down(): boolean
    {
        return Input.Keys[103 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_8_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad8Up(): boolean
    {
        return Input.Keys[104 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_8_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad8Press(): boolean
    {
        return Input.Keys[104 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_8_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad8Down(): boolean
    {
        return Input.Keys[104 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_9_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad9Up(): boolean
    {
        return Input.Keys[105 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_9_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad9Press(): boolean
    {
        return Input.Keys[105 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_9_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad9Down(): boolean
    {
        return Input.Keys[105 + Input.DOWN_K];
    }


    
    /**
     * @property    KEY_DIVIDE_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyDivideUp(): boolean
    {
        return Input.Keys[111 + Input.UP_K];
    }
    
    /**
     * @property    KEY_DIVIDE_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyDividePress(): boolean
    {
        return Input.Keys[111 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_DIVIDE_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyDivideDown(): boolean
    {
        return Input.Keys[111 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_MULTIPLY_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyMultiplyUp(): boolean
    {
        return Input.Keys[106 + Input.UP_K];
    }
    
    /**
     * @property    KEY_MULTIPLY_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyMultiplyPress(): boolean
    {
        return Input.Keys[106 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_MULTIPLY_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyMultiplyDown(): boolean
    {
        return Input.Keys[106 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_SUBTRACT_UP: {Boolean} [read]
     * @description Some description
     */
    get KeySubtractUp(): boolean
    {
        return Input.Keys[109 + Input.UP_K];
    }
    
    /**
     * @property    KEY_SUBTRACT_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeySubtractPress(): boolean
    {
        return Input.Keys[109 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_SUBTRACT_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeySubtractDown(): boolean
    {
        return Input.Keys[109 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_ADD_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyAddUp(): boolean
    {
        return Input.Keys[107 + Input.UP_K];
    }
    
    /**
     * @property    KEY_ADD_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyAddPress(): boolean
    {
        return Input.Keys[107 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_ADD_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyAddDown(): boolean
    {
        return Input.Keys[107 + Input.DOWN_K];
    }


    
    /**
     * @property    KEY_TAB_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyTabUp(): boolean
    {
        return Input.Keys[9 + Input.UP_K];
    }
    
    /**
     * @property    KEY_TAB_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyTabPress(): boolean
    {
        return Input.Keys[9 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_TAB_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyTabDown(): boolean
    {
        return Input.Keys[9 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_CAPS_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyCapsUp(): boolean
    {
        return Input.Keys[20 + Input.UP_K];
    }
    
    /**
     * @property    KEY_CAPS_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyCapsPress(): boolean
    {
        return Input.Keys[20 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_CAPS_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyCapsDown(): boolean
    {
        return Input.Keys[20 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_SHIFT_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyShiftUp(): boolean
    {
        return Input.Keys[16 + Input.UP_K];
    }
    
    /**
     * @property    KEY_SHIFT_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyShiftPress(): boolean
    {
        return Input.Keys[16 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_SHIFT_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyShiftDown(): boolean
    {
        return Input.Keys[16 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_CTRL_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyCtrlUp(): boolean
    {
        return Input.Keys[17 + Input.UP_K];
    }
    
    /**
     * @property    KEY_CTRL_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyCtrlPress(): boolean
    {
        return Input.Keys[17 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_CTRL_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyCtrlDown(): boolean
    {
        return Input.Keys[17 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_ALT_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyAltUp(): boolean
    {
        return Input.Keys[18 + Input.UP_K];
    }
    
    /**
     * @property    KEY_ALT_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyAltPress(): boolean
    {
        return Input.Keys[18 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_ALT_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyAltDown(): boolean
    {
        return Input.Keys[18 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_BACKSPACE_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyBackspaceUp(): boolean
    {
        return Input.Keys[8 + Input.UP_K];
    }
    
    /**
     * @property    KEY_BACKSPACE_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyBackspacePress(): boolean
    {
        return Input.Keys[8 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_BACKSPACE_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyBackspaceDown(): boolean
    {
        return Input.Keys[8 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_ENTER_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyEnterUp(): boolean
    {
        return Input.Keys[13 + Input.UP_K];
    }
    
    /**
     * @property    KEY_ENTER_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyEnterPress(): boolean
    {
        return Input.Keys[13 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_ENTER_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyEnterDown(): boolean
    {
        return Input.Keys[13 + Input.DOWN_K];
    }


    
    /**
     * @property    KEY_UP_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyUpUp(): boolean
    {
        return Input.Keys[38 + Input.UP_K];
    }
    
    /**
     * @property    KEY_UP_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyUpPress(): boolean
    {
        return Input.Keys[38 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_UP_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyUpDown(): boolean
    {
        return Input.Keys[38 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_LEFT_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyLeftUp(): boolean
    {
        return Input.Keys[37 + Input.UP_K];
    }
    
    /**
     * @property    KEY_LEFT_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyLeftPress(): boolean
    {
        return Input.Keys[37 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_LEFT_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyLeftDown(): boolean
    {
        return Input.Keys[37 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_RIGHT_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyRightUp(): boolean
    {
        return Input.Keys[39 + Input.UP_K];
    }
    
    /**
     * @property    KEY_RIGHT_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyRightPress(): boolean
    {
        return Input.Keys[39 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_RIGHT_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyRightDown(): boolean
    {
        return Input.Keys[39 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_DOWN_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyDownUp(): boolean
    {
        return Input.Keys[40 + Input.UP_K];
    }
    
    /**
     * @property    KEY_DOWN_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyDownPress(): boolean
    {
        return Input.Keys[40 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_DOWN_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyDownDown(): boolean
    {
        return Input.Keys[40 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_A_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyAUp(): boolean
    {
        return Input.Keys[65 + Input.UP_K];
    }
    
    /**
     * @property    KEY_A_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyAPress(): boolean
    {
        return Input.Keys[65 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_A_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyADown(): boolean
    {
        return Input.Keys[65 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_B_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyBUp(): boolean
    {
        return Input.Keys[66 + Input.UP_K];
    }
    
    /**
     * @property    KEY_B_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyBPress(): boolean
    {
        return Input.Keys[66 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_B_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyBDown(): boolean
    {
        return Input.Keys[66 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_C_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyCUp(): boolean
    {
        return Input.Keys[67 + Input.UP_K];
    }
    
    /**
     * @property    KEY_C_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyCPress(): boolean
    {
        return Input.Keys[67 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_C_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyCDown(): boolean
    {
        return Input.Keys[67 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_D_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyDUp(): boolean
    {
        return Input.Keys[68 + Input.UP_K];
    }
    
    /**
     * @property    KEY_D_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyDPress(): boolean
    {
        return Input.Keys[68 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_D_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyDDown(): boolean
    {
        return Input.Keys[68 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_E_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyEUp(): boolean
    {
        return Input.Keys[69 + Input.UP_K];
    }
    
    /**
     * @property    KEY_E_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyEPress(): boolean
    {
        return Input.Keys[69 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_E_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyEDown(): boolean
    {
        return Input.Keys[69 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyFUp(): boolean
    {
        return Input.Keys[70 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyFPress(): boolean
    {
        return Input.Keys[70 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyFDown(): boolean
    {
        return Input.Keys[70 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_G_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyGUp(): boolean
    {
        return Input.Keys[71 + Input.UP_K];
    }
    
    /**
     * @property    KEY_G_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyGPress(): boolean
    {
        return Input.Keys[71 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_G_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyGDown(): boolean
    {
        return Input.Keys[71 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_H_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyHUp(): boolean
    {
        return Input.Keys[72 + Input.UP_K];
    }
    
    /**
     * @property    KEY_H_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyHPress(): boolean
    {
        return Input.Keys[72 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_H_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyHDown(): boolean
    {
        return Input.Keys[72 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_I_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyIUp(): boolean
    {
        return Input.Keys[73 + Input.UP_K];
    }
    
    /**
     * @property    KEY_I_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyIPress(): boolean
    {
        return Input.Keys[73 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_I_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyIDown(): boolean
    {
        return Input.Keys[73 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_J_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyJUp(): boolean
    {
        return Input.Keys[74 + Input.UP_K];
    }
    
    /**
     * @property    KEY_J_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyJPress(): boolean
    {
        return Input.Keys[74 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_J_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyJDown(): boolean
    {
        return Input.Keys[74 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_K_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyKUp(): boolean
    {
        return Input.Keys[75 + Input.UP_K];
    }
    
    /**
     * @property    KEY_K_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyKPress(): boolean
    {
        return Input.Keys[75 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_K_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyKDown(): boolean
    {
        return Input.Keys[75 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_L_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyLUp(): boolean
    {
        return Input.Keys[76 + Input.UP_K];
    }
    
    /**
     * @property    KEY_L_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyLPress(): boolean
    {
        return Input.Keys[76 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_L_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyLDown(): boolean
    {
        return Input.Keys[76 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_M_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyMUp(): boolean
    {
        return Input.Keys[77 + Input.UP_K];
    }
    
    /**
     * @property    KEY_M_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyMPress(): boolean
    {
        return Input.Keys[77 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_M_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyMDown(): boolean
    {
        return Input.Keys[77 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_N_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyNUp(): boolean
    {
        return Input.Keys[78 + Input.UP_K];
    }
    
    /**
     * @property    KEY_N_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyNPress(): boolean
    {
        return Input.Keys[78 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_N_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyNDown(): boolean
    {
        return Input.Keys[78 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_O_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyOUp(): boolean
    {
        return Input.Keys[79 + Input.UP_K];
    }
    
    /**
     * @property    KEY_O_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyOPress(): boolean
    {
        return Input.Keys[79 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_O_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyODown(): boolean
    {
        return Input.Keys[79 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_P_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyPUp(): boolean
    {
        return Input.Keys[80 + Input.UP_K];
    }
    
    /**
     * @property    KEY_P_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyPPress(): boolean
    {
        return Input.Keys[80 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_P_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyPDown(): boolean
    {
        return Input.Keys[80 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_Q_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyQUp(): boolean
    {
        return Input.Keys[81 + Input.UP_K];
    }
    
    /**
     * @property    KEY_Q_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyQPress(): boolean
    {
        return Input.Keys[81 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_Q_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyQDown(): boolean
    {
        return Input.Keys[81 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_R_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyRUp(): boolean
    {
        return Input.Keys[82 + Input.UP_K];
    }
    
    /**
     * @property    KEY_R_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyRPress(): boolean
    {
        return Input.Keys[82 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_R_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyRDown(): boolean
    {
        return Input.Keys[82 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_S_UP: {Boolean} [read]
     * @description Some description
     */
    get KeySUp(): boolean
    {
        return Input.Keys[83 + Input.UP_K];
    }
    
    /**
     * @property    KEY_S_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeySPress(): boolean
    {
        return Input.Keys[83 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_S_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeySDown(): boolean
    {
        return Input.Keys[83 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_T_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyTUp(): boolean
    {
        return Input.Keys[84 + Input.UP_K];
    }
    
    /**
     * @property    KEY_T_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyTPress(): boolean
    {
        return Input.Keys[84 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_T_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyTDown(): boolean
    {
        return Input.Keys[84 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_U_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyUUp(): boolean
    {
        return Input.Keys[85 + Input.UP_K];
    }
    
    /**
     * @property    KEY_U_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyUPress(): boolean
    {
        return Input.Keys[85 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_U_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyUDown(): boolean
    {
        return Input.Keys[85 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_V_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyVUp(): boolean
    {
        return Input.Keys[86 + Input.UP_K];
    }
    
    /**
     * @property    KEY_V_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyVPress(): boolean
    {
        return Input.Keys[86 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_V_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyVDown(): boolean
    {
        return Input.Keys[86 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_W_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyWUp(): boolean
    {
        return Input.Keys[87 + Input.UP_K];
    }
    
    /**
     * @property    KEY_W_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyWPress(): boolean
    {
        return Input.Keys[87 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_W_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyWDown(): boolean
    {
        return Input.Keys[87 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_X_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyXUp(): boolean
    {
        return Input.Keys[88 + Input.UP_K];
    }
    
    /**
     * @property    KEY_X_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyXPress(): boolean
    {
        return Input.Keys[88 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_X_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyXDown(): boolean
    {
        return Input.Keys[88 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_Y_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyYUp(): boolean
    {
        return Input.Keys[89 + Input.UP_K];
    }
    
    /**
     * @property    KEY_Y_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyYPress(): boolean
    {
        return Input.Keys[89 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_Y_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyYDown(): boolean
    {
        return Input.Keys[89 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_Z_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyZUp(): boolean
    {
        return Input.Keys[90 + Input.UP_K];
    }
    
    /**
     * @property    KEY_Z_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyZPress(): boolean
    {
        return Input.Keys[90 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyZDown(): boolean
    {
        return Input.Keys[90 + Input.DOWN_K];
    }
    


    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseLeftUp(): boolean
    {
        return Input.Mouse[0 + Input.UP_M];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseLeftClick(): boolean
    {
        return Input.Mouse[0 + Input.CLICK_M];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseLeftDown(): boolean
    {
        return Input.Mouse[0 + Input.DOWN_M];
    }


    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseMiddleUp(): boolean
    {
        return Input.Mouse[1 + Input.UP_M];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseMiddleClick(): boolean
    {
        return Input.Mouse[1 + Input.CLICK_M];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseMiddleDown(): boolean
    {
        return Input.Mouse[1 + Input.DOWN_M];
    }


    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseRightUp(): boolean
    {
        return Input.Mouse[2 + Input.UP_M];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseRightClick(): boolean
    {
        return Input.Mouse[2 + Input.CLICK_M];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseRightDown(): boolean
    {
        return Input.Mouse[2 + Input.DOWN_M];
    }




    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseX(): number | undefined
    {
        return Input.Axis[Input._X + Input.CURR_A];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseY(): number | undefined
    {
        return Input.Axis[Input._Y + Input.CURR_A];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseDeltaX(): number | undefined
    {
        return Input.Axis[Input._X + Input.DELTA_A];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseDeltaY(): number | undefined
    {
        return Input.Axis[Input._Y + Input.DELTA_A];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseWheelUp(): boolean
    {
        return Input.Mouse[Input.WHEEL_U];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseWheelDown(): boolean
    {
        return Input.Mouse[Input.WHEEL_D];
    }


    public InputUpdate()
    {
        for (var i = Input.PRESS_K; i < Input.DOWN_K; ++i)
            if (Input.Keys[i])
                Input.Keys[i] = false;

        for (var i = Input.CLICK_M; i < Input.DOWN_M; ++i)
            if (Input.Mouse[i])
                Input.Mouse[i] = false;

        Input.Axis[Input._X + Input.DELTA_A] = 0;
        Input.Axis[Input._Y + Input.DELTA_A] = 0;
        Input.Mouse[Input.WHEEL_U] = false;
        Input.Mouse[Input.WHEEL_D] = false;
    }
}
