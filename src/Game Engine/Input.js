/**
 * @constructor Input
 * @description This module handles all user key and mouse inputs.
 * @module      FWGE.Game
 */
function Input()
{
    var _UP      = 0;
    var _PRESS   = 128;
    var _DOWN    = 256;
    var _END     = 384;

    var _Keys   = new Array(_END);
    var _Mouse  = new Array(8);
    var _Axis   = new Array(16);

    for (var i = 0; i < _PRESS; ++i)
        _Keys[i] = true;

    for (var i = _PRESS; i < _END; ++i)
        _Keys[i] = false;

    function handle_event(e)
    {
        var key = e.which || e.keyCode || 0;
        
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;

        return key;
    }

    window.onkeyup = function onkeyup(e)
    {
        var key = handle_event(e);

        _Keys[key + _UP   ]    = true;
        _Keys[key + _PRESS]    = false;
        _Keys[key + _DOWN ]    = false;
    };
    window.onkeydown = function onkeydown(e)
    {
        var key = handle_event(e);

        _Keys[key + _UP   ]    = false;
        _Keys[key + _PRESS]    = true;
        _Keys[key + _DOWN ]    = true;
    };

    document.body.oncontextmenu = function oncontextmenu(e) { handle_event(e); return false; };
    window.onmouseenter = function onmouseenter(e)
    {
        var key = handle_event(e);

        //TODO
    };
    window.onmousemove = function onmousemove(e) 
    {
        var key = handle_event(e);

        //TODO
    };
    window.onmouseleave = function onmouseleave(e)
    {
        var key = handle_event(e);

        //TODO
    };
    window.onmousedown = function onmousedown(e) 
    {
        var key = handle_event(e);

        //TODO
    };
    window.onmouseup = function onmouseup(e)   
    {
        var key = handle_event(e);

        //TODO
    };
    
    Object.defineProperties(this, 
    {
        KEY_F1_UP:      { get: function getF1KeyUp()     { return _Keys[112 + _UP   ]; } },
        KEY_F1_PRESS:   { get: function getF1KeyPress()  { return _Keys[112 + _PRESS]; } },
        KEY_F1_DOWN:    { get: function getF1KeyDown()   { return _Keys[112 + _DOWN ]; } },

        KEY_F2_UP:      { get: function getF2KeyUp()     { return _Keys[113 + _UP   ]; } },
        KEY_F2_PRESS:   { get: function getF2KeyPress()  { return _Keys[113 + _PRESS]; } },
        KEY_F2_DOWN:    { get: function getF2KeyDown()   { return _Keys[113 + _DOWN ]; } },

        KEY_F3_UP:      { get: function getF3KeyUp()     { return _Keys[114 + _UP   ]; } },
        KEY_F3_PRESS:   { get: function getF3KeyPress()  { return _Keys[114 + _PRESS]; } },
        KEY_F3_DOWN:    { get: function getF3KeyDown()   { return _Keys[114 + _DOWN ]; } },

        KEY_F4_UP:      { get: function getF4KeyUp()     { return _Keys[115 + _UP   ]; } },
        KEY_F4_PRESS:   { get: function getF4KeyPress()  { return _Keys[115 + _PRESS]; } },
        KEY_F4_DOWN:    { get: function getF4KeyDown()   { return _Keys[115 + _DOWN ]; } },

        KEY_F5_UP:      { get: function getF5KeyUp()     { return _Keys[116 + _UP   ]; } },
        KEY_F5_PRESS:   { get: function getF5KeyPress()  { return _Keys[116 + _PRESS]; } },
        KEY_F5_DOWN:    { get: function getF5KeyDown()   { return _Keys[116 + _DOWN ]; } },

        KEY_F6_UP:      { get: function getF6KeyUp()     { return _Keys[117 + _UP   ]; } },
        KEY_F6_PRESS:   { get: function getF6KeyPress()  { return _Keys[117 + _PRESS]; } },
        KEY_F6_DOWN:    { get: function getF6KeyDown()   { return _Keys[117 + _DOWN ]; } },

        KEY_F7_UP:      { get: function getF7KeyUp()     { return _Keys[118 + _UP   ]; } },
        KEY_F7_PRESS:   { get: function getF7KeyPress()  { return _Keys[118 + _PRESS]; } },
        KEY_F7_DOWN:    { get: function getF7KeyDown()   { return _Keys[118 + _DOWN ]; } },

        KEY_F8_UP:      { get: function getF8KeyUp()     { return _Keys[119 + _UP   ]; } },
        KEY_F8_PRESS:   { get: function getF8KeyPress()  { return _Keys[119 + _PRESS]; } },
        KEY_F8_DOWN:    { get: function getF8KeyDown()   { return _Keys[119 + _DOWN ]; } },

        KEY_F9_UP:      { get: function getF9KeyUp()     { return _Keys[120 + _UP   ]; } },
        KEY_F9_PRESS:   { get: function getF9KeyPress()  { return _Keys[120 + _PRESS]; } },
        KEY_F9_DOWN:    { get: function getF9KeyDown()   { return _Keys[120 + _DOWN ]; } },

        KEY_F10_UP:     { get: function getF10KeyUp()    { return _Keys[121 + _UP   ]; } },
        KEY_F10_PRESS:  { get: function getF10KeyPress() { return _Keys[121 + _PRESS]; } },
        KEY_F10_DOWN:   { get: function getF10KeyDown()  { return _Keys[121 + _DOWN ]; } },

        KEY_F11_UP:     { get: function getF11KeyUp()    { return _Keys[122 + _UP   ]; } },
        KEY_F11_PRESS:  { get: function getF11KeyPress() { return _Keys[122 + _PRESS]; } },
        KEY_F11_DOWN:   { get: function getF11KeyDown()  { return _Keys[122 + _DOWN ]; } },

        KEY_F12_UP:     { get: function getF12KeyUp()    { return _Keys[123 + _UP   ]; } },
        KEY_F12_PRESS:  { get: function getF12KeyPress() { return _Keys[123 + _PRESS]; } },
        KEY_F12_DOWN:   { get: function getF12KeyDown()  { return _Keys[123 + _DOWN ]; } },


        KEY_0_UP:       { get: function get0KeyUp()    { return _Keys[48 + _UP   ]; } },
        KEY_0_PRESS:    { get: function get0KeyPress() { return _Keys[48 + _PRESS]; } },
        KEY_0_DOWN:     { get: function get0KeyDown()  { return _Keys[48 + _DOWN ]; } },

        KEY_1_UP:       { get: function get1KeyUp()    { return _Keys[49 + _UP   ]; } },
        KEY_1_PRESS:    { get: function get1KeyPress() { return _Keys[49 + _PRESS]; } },
        KEY_1_DOWN:     { get: function get1KeyDown()  { return _Keys[49 + _DOWN ]; } },

        KEY_2_UP:       { get: function get2KeyUp()    { return _Keys[50 + _UP   ]; } },
        KEY_2_PRESS:    { get: function get2KeyPress() { return _Keys[50 + _PRESS]; } },
        KEY_2_DOWN:     { get: function get2KeyDown()  { return _Keys[50 + _DOWN ]; } },

        KEY_3_UP:       { get: function get3KeyUp()    { return _Keys[51 + _UP   ]; } },
        KEY_3_PRESS:    { get: function get3KeyPress() { return _Keys[51 + _PRESS]; } },
        KEY_3_DOWN:     { get: function get3KeyDown()  { return _Keys[51 + _DOWN ]; } },

        KEY_4_UP:       { get: function get4KeyUp()    { return _Keys[52 + _UP   ]; } },
        KEY_4_PRESS:    { get: function get4KeyPress() { return _Keys[52 + _PRESS]; } },
        KEY_4_DOWN:     { get: function get4KeyDown()  { return _Keys[52 + _DOWN ]; } },

        KEY_5_UP:       { get: function get5KeyUp()    { return _Keys[53 + _UP   ]; } },
        KEY_5_PRESS:    { get: function get5KeyPress() { return _Keys[53 + _PRESS]; } },
        KEY_5_DOWN:     { get: function get5KeyDown()  { return _Keys[53 + _DOWN ]; } },

        KEY_6_UP:       { get: function get6KeyUp()    { return _Keys[54 + _UP   ]; } },
        KEY_6_PRESS:    { get: function get6KeyPress() { return _Keys[54 + _PRESS]; } },
        KEY_6_DOWN:     { get: function get6KeyDown()  { return _Keys[54 + _DOWN ]; } },

        KEY_7_UP:       { get: function get7KeyUp()    { return _Keys[55 + _UP   ]; } },
        KEY_7_PRESS:    { get: function get7KeyPress() { return _Keys[55 + _PRESS]; } },
        KEY_7_DOWN:     { get: function get7KeyDown()  { return _Keys[55 + _DOWN ]; } },

        KEY_8_UP:       { get: function get8KeyUp()    { return _Keys[56 + _UP   ]; } },
        KEY_8_PRESS:    { get: function get8KeyPress() { return _Keys[56 + _PRESS]; } },
        KEY_8_DOWN:     { get: function get8KeyDown()  { return _Keys[56 + _DOWN ]; } },

        KEY_9_UP:       { get: function get9KeyUp()    { return _Keys[57 + _UP   ]; } },
        KEY_9_PRESS:    { get: function get9KeyPress() { return _Keys[57 + _PRESS]; } },
        KEY_9_DOWN:     { get: function get9KeyDown()  { return _Keys[57 + _DOWN ]; } },


        KEY_NUMPAD_0_UP:       { get: function getNumpad0KeyUp()    { return _Keys[96 + _UP   ]; } },
        KEY_NUMPAD_0_PRESS:    { get: function getNumpad0KeyPress() { return _Keys[96 + _PRESS]; } },
        KEY_NUMPAD_0_DOWN:     { get: function getNumpad0KeyDown()  { return _Keys[96 + _DOWN ]; } },

        KEY_NUMPAD_1_UP:       { get: function getNumpad1KeyUp()    { return _Keys[97 + _UP   ]; } },
        KEY_NUMPAD_1_PRESS:    { get: function getNumpad1KeyPress() { return _Keys[97 + _PRESS]; } },
        KEY_NUMPAD_1_DOWN:     { get: function getNumpad1KeyDown()  { return _Keys[97 + _DOWN ]; } },

        KEY_NUMPAD_2_UP:       { get: function getNumpad2KeyUp()    { return _Keys[98 + _UP   ]; } },
        KEY_NUMPAD_2_PRESS:    { get: function getNumpad2KeyPress() { return _Keys[98 + _PRESS]; } },
        KEY_NUMPAD_2_DOWN:     { get: function getNumpad2KeyDown()  { return _Keys[98 + _DOWN ]; } },

        KEY_NUMPAD_3_UP:       { get: function getNumpad3KeyUp()    { return _Keys[99 + _UP   ]; } },
        KEY_NUMPAD_3_PRESS:    { get: function getNumpad3KeyPress() { return _Keys[99 + _PRESS]; } },
        KEY_NUMPAD_3_DOWN:     { get: function getNumpad3KeyDown()  { return _Keys[99 + _DOWN ]; } },

        KEY_NUMPAD_4_UP:       { get: function getNumpad4KeyUp()    { return _Keys[100 + _UP   ]; } },
        KEY_NUMPAD_4_PRESS:    { get: function getNumpad4KeyPress() { return _Keys[100 + _PRESS]; } },
        KEY_NUMPAD_4_DOWN:     { get: function getNumpad4KeyDown()  { return _Keys[100 + _DOWN ]; } },

        KEY_NUMPAD_5_UP:       { get: function getNumpad5KeyUp()    { return _Keys[101 + _UP   ]; } },
        KEY_NUMPAD_5_PRESS:    { get: function getNumpad5KeyPress() { return _Keys[101 + _PRESS]; } },
        KEY_NUMPAD_5_DOWN:     { get: function getNumpad5KeyDown()  { return _Keys[101 + _DOWN ]; } },

        KEY_NUMPAD_6_UP:       { get: function getNumpad6KeyUp()    { return _Keys[102 + _UP   ]; } },
        KEY_NUMPAD_6_PRESS:    { get: function getNumpad6KeyPress() { return _Keys[102 + _PRESS]; } },
        KEY_NUMPAD_6_DOWN:     { get: function getNumpad6KeyDown()  { return _Keys[102 + _DOWN ]; } },

        KEY_NUMPAD_7_UP:       { get: function getNumpad7KeyUp()    { return _Keys[103 + _UP   ]; } },
        KEY_NUMPAD_7_PRESS:    { get: function getNumpad7KeyPress() { return _Keys[103 + _PRESS]; } },
        KEY_NUMPAD_7_DOWN:     { get: function getNumpad7KeyDown()  { return _Keys[103 + _DOWN ]; } },

        KEY_NUMPAD_8_UP:       { get: function getNumpad8KeyUp()    { return _Keys[104 + _UP   ]; } },
        KEY_NUMPAD_8_PRESS:    { get: function getNumpad8KeyPress() { return _Keys[104 + _PRESS]; } },
        KEY_NUMPAD_8_DOWN:     { get: function getNumpad8KeyDown()  { return _Keys[104 + _DOWN ]; } },

        KEY_NUMPAD_9_UP:       { get: function getNumpad9KeyUp()    { return _Keys[105 + _UP   ]; } },
        KEY_NUMPAD_9_PRESS:    { get: function getNumpad9KeyPress() { return _Keys[105 + _PRESS]; } },
        KEY_NUMPAD_9_DOWN:     { get: function getNumpad9KeyDown()  { return _Keys[105 + _DOWN ]; } },


        KEY_DIVIDE_UP:        { get: function getDivideKeyUp()      { return _Keys[111 + _UP   ]; } },
        KEY_DIVIDE_PRESS:     { get: function getDivideKeyPress()   { return _Keys[111 + _PRESS]; } },
        KEY_DIVIDE_DOWN:      { get: function getDivideKeyDown()    { return _Keys[111 + _DOWN ]; } },

        KEY_MULTIPLY_UP:      { get: function getMultiplyKeyUp()    { return _Keys[106 + _UP   ]; } },
        KEY_MULTIPLY_PRESS:   { get: function getMultiplyKeyPress() { return _Keys[106 + _PRESS]; } },
        KEY_MULTIPLY_DOWN:    { get: function getMultiplyKeyDown()  { return _Keys[106 + _DOWN ]; } },

        KEY_SUBTRACT_UP:      { get: function getSubtractKeyUp()    { return _Keys[109 + _UP   ]; } },
        KEY_SUBTRACT_PRESS:   { get: function getSubtractKeyPress() { return _Keys[109 + _PRESS]; } },
        KEY_SUBTRACT_DOWN:    { get: function getSubtractKeyDown()  { return _Keys[109 + _DOWN ]; } },

        KEY_ADD_UP:           { get: function getAddKeyUp()         { return _Keys[107 + _UP   ]; } },
        KEY_ADD_PRESS:        { get: function getAddKeyPress()      { return _Keys[107 + _PRESS]; } },
        KEY_ADD_DOWN:         { get: function getAddKeyDown()       { return _Keys[107 + _DOWN ]; } },


        KEY_TAB_UP:          { get: function getTABKeyUp()          { return _Keys[9 + _UP   ]; } },
        KEY_TAB_PRESS:       { get: function getTABKeyPress()       { return _Keys[9 + _PRESS]; } },
        KEY_TAB_DOWN:        { get: function getTABKeyDown()        { return _Keys[9 + _DOWN ]; } },

        KEY_CAPS_UP:         { get: function getCAPSKeyUp()         { return _Keys[20 + _UP   ]; } },
        KEY_CAPS_PRESS:      { get: function getCAPSKeyPress()      { return _Keys[20 + _PRESS]; } },
        KEY_CAPS_DOWN:       { get: function getCAPSKeyDown()       { return _Keys[20 + _DOWN ]; } },

        KEY_SHIFT_UP:        { get: function getSHIFTKeyUp()        { return _Keys[16 + _UP   ]; } },
        KEY_SHIFT_PRESS:     { get: function getSHIFTKeyPress()     { return _Keys[16 + _PRESS]; } },
        KEY_SHIFT_DOWN:      { get: function getSHIFTKeyDown()      { return _Keys[16 + _DOWN ]; } },

        KEY_CTRL_UP:         { get: function getCTRLKeyUp()         { return _Keys[17 + _UP   ]; } },
        KEY_CTRL_PRESS:      { get: function getCTRLKeyPress()      { return _Keys[17 + _PRESS]; } },
        KEY_CTRL_DOWN:       { get: function getCTRLKeyDown()       { return _Keys[17 + _DOWN ]; } },

        KEY_ALT_UP:          { get: function getALTKeyUp()          { return _Keys[18 + _UP   ]; } },
        KEY_ALT_PRESS:       { get: function getALTKeyPress()       { return _Keys[18 + _PRESS]; } },
        KEY_ALT_DOWN:        { get: function getALTKeyDown()        { return _Keys[18 + _DOWN ]; } },

        KEY_BACKSPACE_UP:    { get: function getBACKSPACEKeyUp()    { return _Keys[8 + _UP   ]; } },
        KEY_BACKSPACE_PRESS: { get: function getBACKSPACEKeyPress() { return _Keys[8 + _PRESS]; } },
        KEY_BACKSPACE_DOWN:  { get: function getBACKSPACEKeyDown()  { return _Keys[8 + _DOWN ]; } },

        KEY_ENTER_UP:        { get: function getENTERKeyUp()        { return _Keys[13 + _UP   ]; } },
        KEY_ENTER_PRESS:     { get: function getENTERKeyPress()     { return _Keys[13 + _PRESS]; } },
        KEY_ENTER_DOWN:      { get: function getENTERKeyDown()      { return _Keys[13 + _DOWN ]; } },


        KEY_UP_UP:       { get: function getUPKeyUp()       { return _Keys[38 + _UP   ]; } },
        KEY_UP_PRESS:    { get: function getUPKeyPress()    { return _Keys[38 + _PRESS]; } },
        KEY_UP_DOWN:     { get: function getUPKeyDown()     { return _Keys[38 + _DOWN ]; } },

        KEY_LEFT_UP:     { get: function getLEFTKeyUp()     { return _Keys[37 + _UP   ]; } },
        KEY_LEFT_PRESS:  { get: function getLEFTKeyPress()  { return _Keys[37 + _PRESS]; } },
        KEY_LEFT_DOWN:   { get: function getLEFTKeyDown()   { return _Keys[37 + _DOWN ]; } },

        KEY_RIGHT_UP:    { get: function getRIGHTKeyUp()    { return _Keys[40 + _UP   ]; } },
        KEY_RIGHT_PRESS: { get: function getRIGHTKeyPress() { return _Keys[40 + _PRESS]; } },
        KEY_RIGHT_DOWN:  { get: function getRIGHTKeyDown()  { return _Keys[40 + _DOWN ]; } },

        KEY_DOWN_UP:     { get: function getDOWNKeyUp()     { return _Keys[39 + _UP   ]; } },
        KEY_DOWN_PRESS:  { get: function getDOWNKeyPress()  { return _Keys[39 + _PRESS]; } },
        KEY_DOWN_DOWN:   { get: function getDOWNKeyDown()   { return _Keys[39 + _DOWN ]; } },


        KEY_BRACKET_L_UP:     { get: function getTABKeyUp()    { return _Keys[219 + _UP   ]; } },
        KEY_BRACKET_L_PRESS:  { get: function getTABKeyPress() { return _Keys[219 + _PRESS]; } },
        KEY_BRACKET_L_DOWN:   { get: function getTABKeyDown()  { return _Keys[219 + _DOWN ]; } },

        KEY_BRACKET_R_UP:     { get: function getTABKeyUp()    { return _Keys[221 + _UP   ]; } },
        KEY_BRACKET_R_PRESS:  { get: function getTABKeyPress() { return _Keys[221 + _PRESS]; } },
        KEY_BRACKET_R_DOWN:   { get: function getTABKeyDown()  { return _Keys[221 + _DOWN ]; } },

        KEY_COLON_UP:         { get: function getTABKeyUp()    { return _Keys[186 + _UP   ]; } },
        KEY_COLON_PRESS:      { get: function getTABKeyPress() { return _Keys[186 + _PRESS]; } },
        KEY_COLON_DOWN:       { get: function getTABKeyDown()  { return _Keys[186 + _DOWN ]; } },

        KEY_QUOTE_UP:         { get: function getTABKeyUp()    { return _Keys[222 + _UP   ]; } },
        KEY_QUOTE_PRESS:      { get: function getTABKeyPress() { return _Keys[222 + _PRESS]; } },
        KEY_QUOTE_DOWN:       { get: function getTABKeyDown()  { return _Keys[222 + _DOWN ]; } },

        KEY_COMMA_UP:         { get: function getTABKeyUp()    { return _Keys[188 + _UP   ]; } },
        KEY_COMMA_PRESS:      { get: function getTABKeyPress() { return _Keys[188 + _PRESS]; } },
        KEY_COMMA_DOWN:       { get: function getTABKeyDown()  { return _Keys[188 + _DOWN ]; } },

        KEY_PERIOD_UP:        { get: function getTABKeyUp()    { return _Keys[190 + _UP   ]; } },
        KEY_PERIOD_PRESS:     { get: function getTABKeyPress() { return _Keys[190 + _PRESS]; } },
        KEY_PERIOD_DOWN:      { get: function getTABKeyDown()  { return _Keys[190 + _DOWN ]; } },

        KEY_SLASH_F_UP:       { get: function getTABKeyUp()    { return _Keys[191 + _UP   ]; } },
        KEY_SLASH_F_PRESS:    { get: function getTABKeyPress() { return _Keys[191 + _PRESS]; } },
        KEY_SLASH_F_DOWN:     { get: function getTABKeyDown()  { return _Keys[191 + _DOWN ]; } },

        KEY_SLASH_B_UP:       { get: function getTABKeyUp()    { return _Keys[220 + _UP   ]; } },
        KEY_SLASH_B_PRESS:    { get: function getTABKeyPress() { return _Keys[220 + _PRESS]; } },
        KEY_SLASH_B_DOWN:     { get: function getTABKeyDown()  { return _Keys[220 + _DOWN ]; } },


        KEY_A_UP:       { get: function getAKeyUp()     { return _Keys[65 + _UP   ]; } },
        KEY_A_PRESS:    { get: function getAKeyPress()  { return _Keys[65 + _PRESS]; } },
        KEY_A_DOWN:     { get: function getAKeyDown()   { return _Keys[65 + _DOWN ]; } },

        KEY_B_UP:       { get: function getBKeyUp()     { return _Keys[66 + _UP   ]; } },
        KEY_B_PRESS:    { get: function getBKeyPress()  { return _Keys[66 + _PRESS]; } },
        KEY_B_DOWN:     { get: function getBKeyDown()   { return _Keys[66 + _DOWN ]; } },

        KEY_C_UP:       { get: function getCKeyUp()     { return _Keys[67 + _UP   ]; } },
        KEY_C_PRESS:    { get: function getCKeyPress()  { return _Keys[67 + _PRESS]; } },
        KEY_C_DOWN:     { get: function getCKeyDown()   { return _Keys[67 + _DOWN ]; } },

        KEY_D_UP:       { get: function getDKeyUp()     { return _Keys[68 + _UP   ]; } },
        KEY_D_PRESS:    { get: function getDKeyPress()  { return _Keys[68 + _PRESS]; } },
        KEY_D_DOWN:     { get: function getDKeyDown()   { return _Keys[68 + _DOWN ]; } },

        KEY_E_UP:       { get: function getEKeyUp()     { return _Keys[69 + _UP   ]; } },
        KEY_E_PRESS:    { get: function getEKeyPress()  { return _Keys[69 + _PRESS]; } },
        KEY_E_DOWN:     { get: function getEKeyDown()   { return _Keys[69 + _DOWN ]; } },

        KEY_F_UP:       { get: function getFKeyUp()     { return _Keys[70 + _UP   ]; } },
        KEY_F_PRESS:    { get: function getFKeyPress()  { return _Keys[70 + _PRESS]; } },
        KEY_F_DOWN:     { get: function getFKeyDown()   { return _Keys[70 + _DOWN ]; } },

        KEY_G_UP:       { get: function getGKeyUp()     { return _Keys[71 + _UP   ]; } },
        KEY_G_PRESS:    { get: function getGKeyPress()  { return _Keys[71 + _PRESS]; } },
        KEY_G_DOWN:     { get: function getGKeyDown()   { return _Keys[71 + _DOWN ]; } },

        KEY_H_UP:       { get: function getHKeyUp()     { return _Keys[72 + _UP   ]; } },
        KEY_H_PRESS:    { get: function getHKeyPress()  { return _Keys[72 + _PRESS]; } },
        KEY_H_DOWN:     { get: function getHKeyDown()   { return _Keys[72 + _DOWN ]; } },

        KEY_I_UP:       { get: function getIKeyUp()     { return _Keys[73 + _UP   ]; } },
        KEY_I_PRESS:    { get: function getIKeyPress()  { return _Keys[73 + _PRESS]; } },
        KEY_I_DOWN:     { get: function getIKeyDown()   { return _Keys[73 + _DOWN ]; } },

        KEY_J_UP:       { get: function getJKeyUp()     { return _Keys[74 + _UP   ]; } },
        KEY_J_PRESS:    { get: function getJKeyPress()  { return _Keys[74 + _PRESS]; } },
        KEY_J_DOWN:     { get: function getJKeyDown()   { return _Keys[74 + _DOWN ]; } },

        KEY_K_UP:       { get: function getKKeyUp()     { return _Keys[75 + _UP   ]; } },
        KEY_K_PRESS:    { get: function getKKeyPress()  { return _Keys[75 + _PRESS]; } },
        KEY_K_DOWN:     { get: function getKKeyDown()   { return _Keys[75 + _DOWN ]; } },

        KEY_L_UP:       { get: function getLKeyUp()     { return _Keys[76 + _UP   ]; } },
        KEY_L_PRESS:    { get: function getLKeyPress()  { return _Keys[76 + _PRESS]; } },
        KEY_L_DOWN:     { get: function getLKeyDown()   { return _Keys[76 + _DOWN ]; } },

        KEY_M_UP:       { get: function getMKeyUp()     { return _Keys[77 + _UP   ]; } },
        KEY_M_PRESS:    { get: function getMKeyPress()  { return _Keys[77 + _PRESS]; } },
        KEY_M_DOWN:     { get: function getMKeyDown()   { return _Keys[77 + _DOWN ]; } },

        KEY_N_UP:       { get: function getNKeyUp()     { return _Keys[78 + _UP   ]; } },
        KEY_N_PRESS:    { get: function getNKeyPress()  { return _Keys[78 + _PRESS]; } },
        KEY_N_DOWN:     { get: function getNKeyDown()   { return _Keys[78 + _DOWN ]; } },

        KEY_O_UP:       { get: function getOKeyUp()     { return _Keys[79 + _UP   ]; } },
        KEY_O_PRESS:    { get: function getOKeyPress()  { return _Keys[79 + _PRESS]; } },
        KEY_O_DOWN:     { get: function getOKeyDown()   { return _Keys[79 + _DOWN ]; } },

        KEY_P_UP:       { get: function getPKeyUp()     { return _Keys[80 + _UP   ]; } },
        KEY_P_PRESS:    { get: function getPKeyPress()  { return _Keys[80 + _PRESS]; } },
        KEY_P_DOWN:     { get: function getPKeyDown()   { return _Keys[80 + _DOWN ]; } },

        KEY_Q_UP:       { get: function getQKeyUp()     { return _Keys[81 + _UP   ]; } },
        KEY_Q_PRESS:    { get: function getQKeyPress()  { return _Keys[81 + _PRESS]; } },
        KEY_Q_DOWN:     { get: function getQKeyDown()   { return _Keys[81 + _DOWN ]; } },

        KEY_R_UP:       { get: function getRKeyUp()     { return _Keys[82 + _UP   ]; } },
        KEY_R_PRESS:    { get: function getRKeyPress()  { return _Keys[82 + _PRESS]; } },
        KEY_R_DOWN:     { get: function getRKeyDown()   { return _Keys[82 + _DOWN ]; } },

        KEY_S_UP:       { get: function getSKeyUp()     { return _Keys[83 + _UP   ]; } },
        KEY_S_PRESS:    { get: function getSKeyPress()  { return _Keys[83 + _PRESS]; } },
        KEY_S_DOWN:     { get: function getSKeyDown()   { return _Keys[83 + _DOWN ]; } },

        KEY_T_UP:       { get: function getTKeyUp()     { return _Keys[84 + _UP   ]; } },
        KEY_T_PRESS:    { get: function getTKeyPress()  { return _Keys[84 + _PRESS]; } },
        KEY_T_DOWN:     { get: function getTKeyDown()   { return _Keys[84 + _DOWN ]; } },

        KEY_U_UP:       { get: function getUKeyUp()     { return _Keys[85 + _UP   ]; } },
        KEY_U_PRESS:    { get: function getUKeyPress()  { return _Keys[85 + _PRESS]; } },
        KEY_U_DOWN:     { get: function getUKeyDown()   { return _Keys[85 + _DOWN ]; } },

        KEY_V_UP:       { get: function getVKeyUp()     { return _Keys[86 + _UP   ]; } },
        KEY_V_PRESS:    { get: function getVKeyPress()  { return _Keys[86 + _PRESS]; } },
        KEY_V_DOWN:     { get: function getVKeyDown()   { return _Keys[86 + _DOWN ]; } },

        KEY_W_UP:       { get: function getWKeyUp()     { return _Keys[87 + _UP   ]; } },
        KEY_W_PRESS:    { get: function getWKeyPress()  { return _Keys[87 + _PRESS]; } },
        KEY_W_DOWN:     { get: function getWKeyDown()   { return _Keys[87 + _DOWN ]; } },

        KEY_X_UP:       { get: function getXKeyUp()     { return _Keys[88 + _UP   ]; } },
        KEY_X_PRESS:    { get: function getXKeyPress()  { return _Keys[88 + _PRESS]; } },
        KEY_X_DOWN:     { get: function getXKeyDown()   { return _Keys[88 + _DOWN ]; } },

        KEY_Y_UP:       { get: function getYKeyUp()     { return _Keys[89 + _UP   ]; } },
        KEY_Y_PRESS:    { get: function getYKeyPress()  { return _Keys[89 + _PRESS]; } },
        KEY_Y_DOWN:     { get: function getYKeyDown()   { return _Keys[89 + _DOWN ]; } },

        KEY_Z_UP:       { get: function getZKeyUp()     { return _Keys[90 + _UP   ]; } },
        KEY_Z_PRESS:    { get: function getZKeyPress()  { return _Keys[90 + _PRESS]; } },
        KEY_Z_DOWN:     { get: function getZKeyDown()   { return _Keys[90 + _DOWN ]; } },

        InputUpdate:
        {
            value: function InputUpdate()
            {
                for (var i = _PRESS; i < _DOWN; ++i)
                    if (_Keys[i])
                        _Keys[i] = false;
            }
        }
    });
}

