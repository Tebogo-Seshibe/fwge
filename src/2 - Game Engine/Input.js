/**
 * @name        Input
 * @module      FWGE.Game
 * @description This module handles all user key and mouse inputs.
 */

/**
 * @param   {HTMLCanvasElement} canvas
 */

window.Input = (function()
{
    function Input()
    {
        const _UP_K     = 0;
        const _PRESS_K  = 128;
        const _DOWN_K   = 256;
        const _END_K    = 384;
        let _Keys       = new Array(_END_K);

        const _UP_M     = 0;
        const _CLICK_M  = 3;
        const _DOWN_M   = 6;
        const _WHEEL_U  = 9;
        const _WHEEL_D  = 10;
        const _END_M    = 11;
        let _Mouse      = new Array(_END_M);

        const _X        = 0;
        const _Y        = 1;
        const _CURR_A   = 0;
        const _PREV_A   = 2;
        const _DELTA_A  = 4;
        const _END_A    = 8;
        let _Axis       = new Array(_END_A);
        
        function _handle_event(e)
        {
            var key = e instanceof MouseEvent ? e.button :  e.which || 0;
            
            e.preventDefault();
            e.stopPropagation();
            e.cancelBubble = true;

            return key;
        }

        for (var i = 0; i < _PRESS_K; ++i)
            _Keys[i] = true;

        for (var i = _PRESS_K; i < _END_K; ++i)
            _Keys[i] = false;

        for (var i = 0; i < _CLICK_M; ++i)
            _Mouse[i] = true;

        for (var i = _CLICK_M; i < _END_M; ++i)
            _Mouse[i] = false;

        for (var i = 0; i < _END_A; ++i)
            _Axis[i] = undefined;
        
        Object.defineProperties(this,
        {
            /**
             * @property    {KEY_F1_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF1Up: { get: function get() { return _Keys[112 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F1_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF1Press: { get: function get() { return _Keys[112 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F1_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF1Down: { get: function get() { return _Keys[112 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_F2_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF2Up: { get: function get() { return _Keys[113 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F2_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF2Press: { get: function get() { return _Keys[113 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F2_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF2Down: { get: function get() { return _Keys[113 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_F3_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF3Up: { get: function get() { return _Keys[114 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F3_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF3Press: { get: function get() { return _Keys[114 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F3_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF3Down: { get: function get() { return _Keys[114 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_F4_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF4Up: { get: function get() { return _Keys[115 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F4_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF4Press: { get: function get() { return _Keys[115 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F4_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF4Down: { get: function get() { return _Keys[115 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_F5_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF5Up: { get: function get() { return _Keys[116 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F5_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF5Press: { get: function get() { return _Keys[116 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F5_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF5Down: { get: function get() { return _Keys[116 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_F6_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF6Up: { get: function get() { return _Keys[117 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F6_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF6Press: { get: function get() { return _Keys[117 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F6_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF6Down: { get: function get() { return _Keys[117 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_F7_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF7Up: { get: function get() { return _Keys[118 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F7_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF7Press: { get: function get() { return _Keys[118 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F7_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF7Down: { get: function get() { return _Keys[118 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_F8_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF8Up: { get: function get() { return _Keys[119 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F8_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF8Press: { get: function get() { return _Keys[119 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F8_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF8Down: { get: function get() { return _Keys[119 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_F9_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF9Up: { get: function get() { return _Keys[120 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F9_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF9Press: { get: function get() { return _Keys[120 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F9_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF9Down: { get: function get() { return _Keys[120 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_F10_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF10Up: { get: function get() { return _Keys[121 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F10_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF10Press: { get: function get() { return _Keys[121 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F10_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF10Down: { get: function get() { return _Keys[121 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_F11_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF11Up: { get: function get() { return _Keys[122 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F11_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF11Press: { get: function get() { return _Keys[122 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F11_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF11Down: { get: function get() { return _Keys[122 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_F12_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF12Up: { get: function get() { return _Keys[123 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F12_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF12Press: { get: function get() { return _Keys[123 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F12_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyF12Down: { get: function get() { return _Keys[123 + _DOWN_K]; }, configurable: false, enumerable: true },


        
            /**
             * @property    {KEY_0_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Key0Up: { get: function get() { return _Keys[48 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_0_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Key0Press: { get: function get() { return _Keys[48 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_0_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Key0Down: { get: function get() { return _Keys[48 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_1_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Key1Up: { get: function get() { return _Keys[49 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_1_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Key1Press: { get: function get() { return _Keys[49 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_1_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Key1Down: { get: function get() { return _Keys[49 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_2_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Key2Up: { get: function get() { return _Keys[50 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_2_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Key2Press: { get: function get() { return _Keys[50 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_2_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Key2Down: { get: function get() { return _Keys[50 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_3_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Key3Up: { get: function get() { return _Keys[51 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_3_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Key3Press: { get: function get() { return _Keys[51 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_3_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Key3Down: { get: function get() { return _Keys[51 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_4_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Key4Up: { get: function get() { return _Keys[52 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_4_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Key4Press: { get: function get() { return _Keys[52 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_4_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Key4Down: { get: function get() { return _Keys[52 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_5_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Key5Up: { get: function get() { return _Keys[53 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_5_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Key5Press: { get: function get() { return _Keys[53 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_5_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Key5Down: { get: function get() { return _Keys[53 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_6_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Key6Up: { get: function get() { return _Keys[54 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_6_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Key6Press: { get: function get() { return _Keys[54 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_6_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Key6Down: { get: function get() { return _Keys[54 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_7_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Key7Up: { get: function get() { return _Keys[55 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_7_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Key7Press: { get: function get() { return _Keys[55 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_7_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Key7Down: { get: function get() { return _Keys[55 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_8_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Key8Up: { get: function get() { return _Keys[56 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_8_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Key8Press: { get: function get() { return _Keys[56 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_8_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Key8Down: { get: function get() { return _Keys[56 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_9_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Key9Up: { get: function get() { return _Keys[57 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_9_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Key9Press: { get: function get() { return _Keys[57 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_9_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Key9Down: { get: function get() { return _Keys[57 + _DOWN_K]; }, configurable: false, enumerable: true },


        
            /**
             * @property    {NUMPAD_0_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad0Up: { get: function get() { return _Keys[96 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_0_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad0Press: { get: function get() { return _Keys[96 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_0_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad0Down: { get: function get() { return _Keys[96 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {NUMPAD_1_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad1Up: { get: function get() { return _Keys[97 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_1_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad1Press: { get: function get() { return _Keys[97 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_1_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad1Down: { get: function get() { return _Keys[97 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {NUMPAD_2_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad2Up: { get: function get() { return _Keys[98 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_2_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad2Press: { get: function get() { return _Keys[98 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_2_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad2Down: { get: function get() { return _Keys[98 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {NUMPAD_3_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad3Up: { get: function get() { return _Keys[99 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_3_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad3Press: { get: function get() { return _Keys[99 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_3_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad3Down: { get: function get() { return _Keys[99 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {NUMPAD_4_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad4Up: { get: function get() { return _Keys[100 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_4_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad4Press: { get: function get() { return _Keys[100 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_4_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad4Down: { get: function get() { return _Keys[100 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {NUMPAD_5_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad5Up: { get: function get() { return _Keys[101 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_5_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad5Press: { get: function get() { return _Keys[101 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_5_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad5Down: { get: function get() { return _Keys[101 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {NUMPAD_6_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad6Up: { get: function get() { return _Keys[102 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_6_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad6Press: { get: function get() { return _Keys[102 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_6_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad6Down: { get: function get() { return _Keys[102 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {NUMPAD_7_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad7Up: { get: function get() { return _Keys[103 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_7_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad7Press: { get: function get() { return _Keys[103 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_7_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad7Down: { get: function get() { return _Keys[103 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {NUMPAD_8_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad8Up: { get: function get() { return _Keys[104 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_8_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad8Press: { get: function get() { return _Keys[104 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_8_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad8Down: { get: function get() { return _Keys[104 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {NUMPAD_9_UP}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad9Up: { get: function get() { return _Keys[105 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_9_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad9Press: { get: function get() { return _Keys[105 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {NUMPAD_9_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            Numpad9Down: { get: function get() { return _Keys[105 + _DOWN_K]; }, configurable: false, enumerable: true },


        
            /**
             * @property    {KEY_DIVIDE_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyDivideUp: { get: function get() { return _Keys[111 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_DIVIDE_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyDividePress: { get: function get() { return _Keys[111 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_DIVIDE_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyDivideDown: { get: function get() { return _Keys[111 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_MULTIPLY_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyMultiplyUp: { get: function get() { return _Keys[106 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_MULTIPLY_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyMultiplyPress: { get: function get() { return _Keys[106 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_MULTIPLY_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyMultiplyDown: { get: function get() { return _Keys[106 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_SUBTRACT_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeySubtractUp: { get: function get() { return _Keys[109 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_SUBTRACT_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeySubtractPress: { get: function get() { return _Keys[109 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_SUBTRACT_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeySubtractDown: { get: function get() { return _Keys[109 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_ADD_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyAddUp: { get: function get() { return _Keys[107 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_ADD_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyAddPress: { get: function get() { return _Keys[107 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_ADD_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyAddDown: { get: function get() { return _Keys[107 + _DOWN_K]; }, configurable: false, enumerable: true },


        
            /**
             * @property    {KEY_TAB_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyTabUp: { get: function get() { return _Keys[9 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_TAB_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyTabPress: { get: function get() { return _Keys[9 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_TAB_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyTabDown: { get: function get() { return _Keys[9 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_CAPS_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyCapsUp: { get: function get() { return _Keys[20 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_CAPS_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyCapsPress: { get: function get() { return _Keys[20 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_CAPS_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyCapsDown: { get: function get() { return _Keys[20 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_SHIFT_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyShiftUp: { get: function get() { return _Keys[16 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_SHIFT_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyShiftPress: { get: function get() { return _Keys[16 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_SHIFT_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyShiftDown: { get: function get() { return _Keys[16 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_CTRL_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyCtrlUp: { get: function get() { return _Keys[17 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_CTRL_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyCtrlPress: { get: function get() { return _Keys[17 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_CTRL_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyCtrlDown: { get: function get() { return _Keys[17 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_ALT_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyAltUp: { get: function get() { return _Keys[18 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_ALT_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyAltPress: { get: function get() { return _Keys[18 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_ALT_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyAltDown: { get: function get() { return _Keys[18 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_BACKSPACE_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyBackspaceUp: { get: function get() { return _Keys[8 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_BACKSPACE_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyBackspacePress: { get: function get() { return _Keys[8 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_BACKSPACE_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyBackspaceDown: { get: function get() { return _Keys[8 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_ENTER_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyEnterUp: { get: function get() { return _Keys[13 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_ENTER_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyEnterPress: { get: function get() { return _Keys[13 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_ENTER_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyEnterDown: { get: function get() { return _Keys[13 + _DOWN_K]; }, configurable: false, enumerable: true },


        
            /**
             * @property    {KEY_UP_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyUpUp: { get: function get() { return _Keys[38 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_UP_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyUpPress: { get: function get() { return _Keys[38 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_UP_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyUpDown: { get: function get() { return _Keys[38 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_LEFT_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyLeftUp: { get: function get() { return _Keys[37 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_LEFT_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyLeftPress: { get: function get() { return _Keys[37 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_LEFT_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyLeftDown: { get: function get() { return _Keys[37 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_RIGHT_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyRightUp: { get: function get() { return _Keys[39 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_RIGHT_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyRightPress: { get: function get() { return _Keys[39 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_RIGHT_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyRightDown: { get: function get() { return _Keys[39 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_DOWN_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyDownUp: { get: function get() { return _Keys[40 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_DOWN_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyDownPress: { get: function get() { return _Keys[40 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_DOWN_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyDownDown: { get: function get() { return _Keys[40 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_A_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyAUp: { get: function get() { return _Keys[65 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_A_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyAPress: { get: function get() { return _Keys[65 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_A_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyADown: { get: function get() { return _Keys[65 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_B_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyBUp: { get: function get() { return _Keys[66 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_B_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyBPress: { get: function get() { return _Keys[66 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_B_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyBDown: { get: function get() { return _Keys[66 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_C_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyCUp: { get: function get() { return _Keys[67 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_C_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyCPress: { get: function get() { return _Keys[67 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_C_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyCDown: { get: function get() { return _Keys[67 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_D_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyDUp: { get: function get() { return _Keys[68 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_D_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyDPress: { get: function get() { return _Keys[68 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_D_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyDDown: { get: function get() { return _Keys[68 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_E_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyEUp: { get: function get() { return _Keys[69 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_E_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyEPress: { get: function get() { return _Keys[69 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_E_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyEDown: { get: function get() { return _Keys[69 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_F_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyFUp: { get: function get() { return _Keys[70 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyFPress: { get: function get() { return _Keys[70 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_F_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyFDown: { get: function get() { return _Keys[70 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_G_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyGUp: { get: function get() { return _Keys[71 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_G_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyGPress: { get: function get() { return _Keys[71 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_G_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyGDown: { get: function get() { return _Keys[71 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_H_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyHUp: { get: function get() { return _Keys[72 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_H_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyHPress: { get: function get() { return _Keys[72 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_H_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyHDown: { get: function get() { return _Keys[72 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_I_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyIUp: { get: function get() { return _Keys[73 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_I_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyIPress: { get: function get() { return _Keys[73 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_I_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyIDown: { get: function get() { return _Keys[73 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_J_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyJUp: { get: function get() { return _Keys[74 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_J_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyJPress: { get: function get() { return _Keys[74 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_J_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyJDown: { get: function get() { return _Keys[74 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_K_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyKUp: { get: function get() { return _Keys[75 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_K_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyKPress: { get: function get() { return _Keys[75 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_K_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyKDown: { get: function get() { return _Keys[75 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_L_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyLUp: { get: function get() { return _Keys[76 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_L_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyLPress: { get: function get() { return _Keys[76 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_L_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyLDown: { get: function get() { return _Keys[76 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_M_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyMUp: { get: function get() { return _Keys[77 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_M_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyMPress: { get: function get() { return _Keys[77 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_M_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyMDown: { get: function get() { return _Keys[77 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_N_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyNUp: { get: function get() { return _Keys[78 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_N_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyNPress: { get: function get() { return _Keys[78 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_N_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyNDown: { get: function get() { return _Keys[78 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_O_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyOUp: { get: function get() { return _Keys[79 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_O_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyOPress: { get: function get() { return _Keys[79 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_O_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyODown: { get: function get() { return _Keys[79 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_P_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyPUp: { get: function get() { return _Keys[80 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_P_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyPPress: { get: function get() { return _Keys[80 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_P_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyPDown: { get: function get() { return _Keys[80 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_Q_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyQUp: { get: function get() { return _Keys[81 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_Q_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyQPress: { get: function get() { return _Keys[81 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_Q_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyQDown: { get: function get() { return _Keys[81 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_R_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyRUp: { get: function get() { return _Keys[82 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_R_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyRPress: { get: function get() { return _Keys[82 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_R_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyRDown: { get: function get() { return _Keys[82 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_S_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeySUp: { get: function get() { return _Keys[83 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_S_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeySPress: { get: function get() { return _Keys[83 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_S_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeySDown: { get: function get() { return _Keys[83 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_T_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyTUp: { get: function get() { return _Keys[84 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_T_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyTPress: { get: function get() { return _Keys[84 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_T_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyTDown: { get: function get() { return _Keys[84 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_U_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyUUp: { get: function get() { return _Keys[85 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_U_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyUPress: { get: function get() { return _Keys[85 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_U_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyUDown: { get: function get() { return _Keys[85 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_V_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyVUp: { get: function get() { return _Keys[86 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_V_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyVPress: { get: function get() { return _Keys[86 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_V_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyVDown: { get: function get() { return _Keys[86 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_W_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyWUp: { get: function get() { return _Keys[87 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_W_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyWPress: { get: function get() { return _Keys[87 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_W_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyWDown: { get: function get() { return _Keys[87 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_X_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyXUp: { get: function get() { return _Keys[88 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_X_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyXPress: { get: function get() { return _Keys[88 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_X_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyXDown: { get: function get() { return _Keys[88 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_Y_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyYUp: { get: function get() { return _Keys[89 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_Y_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyYPress: { get: function get() { return _Keys[89 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_Y_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyYDown: { get: function get() { return _Keys[89 + _DOWN_K]; }, configurable: false, enumerable: true },

        
            /**
             * @property    {KEY_Z_UP}
             * @type        {Boolean}
             * @description Some description
             */
            KeyZUp: { get: function get() { return _Keys[90 + _UP_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_Z_PRESS}
             * @type        {Boolean}
             * @description Some description
             */
            KeyZPress: { get: function get() { return _Keys[90 + _PRESS_K]; }, configurable: false, enumerable: true },
        
            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            KeyZDown: { get: function get() { return _Keys[90 + _DOWN_K]; }, configurable: false, enumerable: true },
        


            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseLeftUp: { get: function get() { return _Mouse[0 + _UP_M]; }, configurable: false, enumerable: true },

            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseLeftClick: { get: function get() { return _Mouse[0 + _CLICK_M]; }, configurable: false, enumerable: true },

            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseLeftDown: { get: function get() { return _Mouse[0 + _DOWN_M]; }, configurable: false, enumerable: true },


            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseMiddleUp: { get: function get() { return _Mouse[1 + _UP_M]; }, configurable: false, enumerable: true },

            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseMiddleClick: { get: function get() { return _Mouse[1 + _CLICK_M]; }, configurable: false, enumerable: true },

            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseMiddleDown: { get: function get() { return _Mouse[1 + _DOWN_M]; }, configurable: false, enumerable: true },


            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseRightUp: { get: function get() { return _Mouse[2 + _UP_M]; }, configurable: false, enumerable: true },

            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseRightClick: { get: function get() { return _Mouse[2 + _CLICK_M]; }, configurable: false, enumerable: true },

            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseRightDown: { get: function get() { return _Mouse[2 + _DOWN_M]; }, configurable: false, enumerable: true },




            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseX: { get: function get() { return _Axis[_X + _CURR_A]; }, configurable: false, enumerable: true },

            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseY: { get: function get() { return _Axis[_Y + _CURR_A]; }, configurable: false, enumerable: true },

            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseDeltaX: { get: function get() { return _Axis[_X + _DELTA_A]; }, configurable: false, enumerable: true },

            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseDeltaY: { get: function get() { return _Axis[_Y + _DELTA_A]; }, configurable: false, enumerable: true },

            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseWheelUp: { get: function get() { return _Mouse[_WHEEL_U]; }, configurable: false, enumerable: true },

            /**
             * @property    {KEY_Z_DOWN}
             * @type        {Boolean}
             * @description Some description
             */
            MouseWheelDown: { get: function get() { return _Mouse[_WHEEL_D]; }, configurable: false, enumerable: true },


            Init:
            {
                value: function Init(canvas)
                {                
                    canvas.onkeyup = function onkeyup(e)
                    {
                        var key = _handle_event(e);

                        _Keys[key + _UP_K]      = true;
                        _Keys[key + _PRESS_K]   = false;
                        _Keys[key + _DOWN_K]    = false;
                    };
                    canvas.onkeydown = function onkeydown(e)
                    {
                        var key = _handle_event(e);

                        _Keys[key + _UP_K]      = false;
                        _Keys[key + _PRESS_K]   = true;
                        _Keys[key + _DOWN_K]    = true;
                    };

                    canvas.oncontextmenu = function oncontextmenu(e) { _handle_event(e); return false; };
                    canvas.onmouseenter = function onmouseenter(e)
                    {
                        _Axis[_X + _PREV_A] = e.clientX;
                        _Axis[_Y + _PREV_A] = e.clientY;
                        
                        _Axis[_X + _CURR_A] = e.clientX;
                        _Axis[_Y + _CURR_A] = e.clientY;

                        _Axis[_X + _DELTA_A] = 0;
                        _Axis[_Y + _DELTA_A] = 0;
                    };
                    canvas.onmousemove = function onmousemove(e) 
                    {
                        if (!_Axis[_X + _CURR_A] || !_Axis[_Y + _CURR_A])
                        {
                            _Axis[_X + _CURR_A] = e.clientX;
                            _Axis[_Y + _CURR_A] = e.clientY;
                        }

                        _Axis[_X + _PREV_A] = _Axis[_X + _CURR_A];
                        _Axis[_Y + _PREV_A] = _Axis[_Y + _CURR_A];
                        _Axis[_X + _CURR_A] = e.clientX;
                        _Axis[_Y + _CURR_A] = e.clientY;

                        _Axis[_X + _DELTA_A] = _Axis[_X + _CURR_A] - _Axis[_X + _PREV_A];
                        _Axis[_Y + _DELTA_A] = _Axis[_Y + _CURR_A] - _Axis[_Y + _PREV_A];
                    };
                    canvas.onmouseleave = function onmouseleave(e)
                    {
                        _Axis[_X + _PREV_A] = undefined;
                        _Axis[_Y + _PREV_A] = undefined;
                        
                        _Axis[_X + _CURR_A] = undefined;
                        _Axis[_Y + _CURR_A] = undefined;

                        _Axis[_X + _DELTA_A] = 0;
                        _Axis[_Y + _DELTA_A] = 0;
                    };
                    canvas.onmouseup = function onmouseup(e)   
                    {
                        var key = _handle_event(e);

                        _Mouse[key + _UP_M] = true;
                        _Mouse[key + _CLICK_M] = false;
                        _Mouse[key + _DOWN_M] = false;
                    };
                    canvas.onmousedown = function onmousedown(e) 
                    {
                        var key = _handle_event(e);

                        _Mouse[key + _UP_M] = false;
                        _Mouse[key + _CLICK_M] = true;
                        _Mouse[key + _DOWN_M] = true;
                    };
                    canvas.onmousewheel = function onmousewheel(e)
                    {
                        _Mouse[e.deltaY < 0 ? _WHEEL_U : _WHEEL_D] = true;
                    };
                }
            },

            /**
             * @function    InputUpdate
             * @return      {udefined}
             */
            InputUpdate:
            {
                value: function InputUpdate()
                {
                    for (var i = _PRESS_K; i < _DOWN_K; ++i)
                        if (_Keys[i])
                            _Keys[i] = false;

                    for (var i = _CLICK_M; i < _DOWN_M; ++i)
                        if (_Mouse[i])
                            _Mouse[i] = false;

                    _Axis[_X + _DELTA_A] = 0;
                    _Axis[_Y + _DELTA_A] = 0;
                    _Mouse[_WHEEL_U] = false;
                    _Mouse[_WHEEL_D] = false;
                }
            }
        });

        Object.seal(this);
    }

    Input.prototype = Object.create(null);
    Object.seal(Input.prototype);

    return new Input();
})();
Object.seal(Input);
