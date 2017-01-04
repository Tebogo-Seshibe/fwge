/*!
 *  @constructor    Input
 *  @description    The input detector
 */
function Input()
{
    var UP      = 0;
    var PRESS   = 128;
    var DOWN    = 256;
    var END     = 384;

    var _Keys   = new Array(END);
    var _Mouse  = new Array(8);
    var _Axis   = new Array(16);

    for (var i = 0; i < PRESS; ++i)
        _Keys[i] = true;

    for (var i = PRESS; i < END; ++i)
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

        _Keys[key + UP   ]    = true;
        _Keys[key + PRESS]    = false;
        _Keys[key + DOWN ]    = false;
    };
    window.onkeydown = function onkeydown(e)
    {
        var key = handle_event(e);

        _Keys[key + UP   ]    = false;
        _Keys[key + PRESS]    = true;
        _Keys[key + DOWN ]    = true;
    };

    document.body.oncontextmenu = function oncontextmenu(e) { return false; };
    window.onmouseenter = function onmouseenter(e) { var key = handle_event(e) };
    window.onmousemove = function onmousemove(e) { var key = handle_event(e); };
    window.onmouseleave = function onmouseleave(e) { var key = handle_event(e); };
    window.onmousedown = function onmousedown(e) { var key = handle_event(e); };
    window.onmouseup = function onmouseup(e) { var key = handle_event(e); };
    
    Object.defineProperties(this, 
    {
        KEY_F1_UP:      { get: function getF1KeyUp()     { return _Keys[112 + UP   ]; } },
        KEY_F1_PRESS:   { get: function getF1KeyPress()  { return _Keys[112 + PRESS]; } },
        KEY_F1_DOWN:    { get: function getF1KeyDown()   { return _Keys[112 + DOWN ]; } },

        KEY_F2_UP:      { get: function getF2KeyUp()     { return _Keys[113 + UP   ]; } },
        KEY_F2_PRESS:   { get: function getF2KeyPress()  { return _Keys[113 + PRESS]; } },
        KEY_F2_DOWN:    { get: function getF2KeyDown()   { return _Keys[113 + DOWN ]; } },

        KEY_F3_UP:      { get: function getF3KeyUp()     { return _Keys[114 + UP   ]; } },
        KEY_F3_PRESS:   { get: function getF3KeyPress()  { return _Keys[114 + PRESS]; } },
        KEY_F3_DOWN:    { get: function getF3KeyDown()   { return _Keys[114 + DOWN ]; } },

        KEY_F4_UP:      { get: function getF4KeyUp()     { return _Keys[115 + UP   ]; } },
        KEY_F4_PRESS:   { get: function getF4KeyPress()  { return _Keys[115 + PRESS]; } },
        KEY_F4_DOWN:    { get: function getF4KeyDown()   { return _Keys[115 + DOWN ]; } },

        KEY_F5_UP:      { get: function getF5KeyUp()     { return _Keys[116 + UP   ]; } },
        KEY_F5_PRESS:   { get: function getF5KeyPress()  { return _Keys[116 + PRESS]; } },
        KEY_F5_DOWN:    { get: function getF5KeyDown()   { return _Keys[116 + DOWN ]; } },

        KEY_F6_UP:      { get: function getF6KeyUp()     { return _Keys[117 + UP   ]; } },
        KEY_F6_PRESS:   { get: function getF6KeyPress()  { return _Keys[117 + PRESS]; } },
        KEY_F6_DOWN:    { get: function getF6KeyDown()   { return _Keys[117 + DOWN ]; } },

        KEY_F7_UP:      { get: function getF7KeyUp()     { return _Keys[118 + UP   ]; } },
        KEY_F7_PRESS:   { get: function getF7KeyPress()  { return _Keys[118 + PRESS]; } },
        KEY_F7_DOWN:    { get: function getF7KeyDown()   { return _Keys[118 + DOWN ]; } },

        KEY_F8_UP:      { get: function getF8KeyUp()     { return _Keys[119 + UP   ]; } },
        KEY_F8_PRESS:   { get: function getF8KeyPress()  { return _Keys[119 + PRESS]; } },
        KEY_F8_DOWN:    { get: function getF8KeyDown()   { return _Keys[119 + DOWN ]; } },

        KEY_F9_UP:      { get: function getF9KeyUp()     { return _Keys[120 + UP   ]; } },
        KEY_F9_PRESS:   { get: function getF9KeyPress()  { return _Keys[120 + PRESS]; } },
        KEY_F9_DOWN:    { get: function getF9KeyDown()   { return _Keys[120 + DOWN ]; } },

        KEY_F10_UP:     { get: function getF10KeyUp()    { return _Keys[121 + UP   ]; } },
        KEY_F10_PRESS:  { get: function getF10KeyPress() { return _Keys[121 + PRESS]; } },
        KEY_F10_DOWN:   { get: function getF10KeyDown()  { return _Keys[121 + DOWN ]; } },

        KEY_F11_UP:     { get: function getF11KeyUp()    { return _Keys[122 + UP   ]; } },
        KEY_F11_PRESS:  { get: function getF11KeyPress() { return _Keys[122 + PRESS]; } },
        KEY_F11_DOWN:   { get: function getF11KeyDown()  { return _Keys[122 + DOWN ]; } },

        KEY_F12_UP:     { get: function getF12KeyUp()    { return _Keys[123 + UP   ]; } },
        KEY_F12_PRESS:  { get: function getF12KeyPress() { return _Keys[123 + PRESS]; } },
        KEY_F12_DOWN:   { get: function getF12KeyDown()  { return _Keys[123 + DOWN ]; } },


        KEY_0_UP:       { get: function get0KeyUp()    { return _Keys[48 + UP   ]; } },
        KEY_0_PRESS:    { get: function get0KeyPress() { return _Keys[48 + PRESS]; } },
        KEY_0_DOWN:     { get: function get0KeyDown()  { return _Keys[48 + DOWN ]; } },

        KEY_1_UP:       { get: function get1KeyUp()    { return _Keys[49 + UP   ]; } },
        KEY_1_PRESS:    { get: function get1KeyPress() { return _Keys[49 + PRESS]; } },
        KEY_1_DOWN:     { get: function get1KeyDown()  { return _Keys[49 + DOWN ]; } },

        KEY_2_UP:       { get: function get2KeyUp()    { return _Keys[50 + UP   ]; } },
        KEY_2_PRESS:    { get: function get2KeyPress() { return _Keys[50 + PRESS]; } },
        KEY_2_DOWN:     { get: function get2KeyDown()  { return _Keys[50 + DOWN ]; } },

        KEY_3_UP:       { get: function get3KeyUp()    { return _Keys[51 + UP   ]; } },
        KEY_3_PRESS:    { get: function get3KeyPress() { return _Keys[51 + PRESS]; } },
        KEY_3_DOWN:     { get: function get3KeyDown()  { return _Keys[51 + DOWN ]; } },

        KEY_4_UP:       { get: function get4KeyUp()    { return _Keys[52 + UP   ]; } },
        KEY_4_PRESS:    { get: function get4KeyPress() { return _Keys[52 + PRESS]; } },
        KEY_4_DOWN:     { get: function get4KeyDown()  { return _Keys[52 + DOWN ]; } },

        KEY_5_UP:       { get: function get5KeyUp()    { return _Keys[53 + UP   ]; } },
        KEY_5_PRESS:    { get: function get5KeyPress() { return _Keys[53 + PRESS]; } },
        KEY_5_DOWN:     { get: function get5KeyDown()  { return _Keys[53 + DOWN ]; } },

        KEY_6_UP:       { get: function get6KeyUp()    { return _Keys[54 + UP   ]; } },
        KEY_6_PRESS:    { get: function get6KeyPress() { return _Keys[54 + PRESS]; } },
        KEY_6_DOWN:     { get: function get6KeyDown()  { return _Keys[54 + DOWN ]; } },

        KEY_7_UP:       { get: function get7KeyUp()    { return _Keys[55 + UP   ]; } },
        KEY_7_PRESS:    { get: function get7KeyPress() { return _Keys[55 + PRESS]; } },
        KEY_7_DOWN:     { get: function get7KeyDown()  { return _Keys[55 + DOWN ]; } },

        KEY_8_UP:       { get: function get8KeyUp()    { return _Keys[56 + UP   ]; } },
        KEY_8_PRESS:    { get: function get8KeyPress() { return _Keys[56 + PRESS]; } },
        KEY_8_DOWN:     { get: function get8KeyDown()  { return _Keys[56 + DOWN ]; } },

        KEY_9_UP:       { get: function get9KeyUp()    { return _Keys[57 + UP   ]; } },
        KEY_9_PRESS:    { get: function get9KeyPress() { return _Keys[57 + PRESS]; } },
        KEY_9_DOWN:     { get: function get9KeyDown()  { return _Keys[57 + DOWN ]; } },


        KEY_TAB_UP:          { get: function getTABKeyUp()          { return _Keys[9 + UP   ]; } },
        KEY_TAB_PRESS:       { get: function getTABKeyPress()       { return _Keys[9 + PRESS]; } },
        KEY_TAB_DOWN:        { get: function getTABKeyDown()        { return _Keys[9 + DOWN ]; } },

        KEY_CAPS_UP:         { get: function getCAPSKeyUp()         { return _Keys[20 + UP   ]; } },
        KEY_CAPS_PRESS:      { get: function getCAPSKeyPress()      { return _Keys[20 + PRESS]; } },
        KEY_CAPS_DOWN:       { get: function getCAPSKeyDown()       { return _Keys[20 + DOWN ]; } },

        KEY_SHIFT_UP:        { get: function getSHIFTKeyUp()        { return _Keys[16 + UP   ]; } },
        KEY_SHIFT_PRESS:     { get: function getSHIFTKeyPress()     { return _Keys[16 + PRESS]; } },
        KEY_SHIFT_DOWN:      { get: function getSHIFTKeyDown()      { return _Keys[16 + DOWN ]; } },

        KEY_CTRL_UP:         { get: function getCTRLKeyUp()         { return _Keys[17 + UP   ]; } },
        KEY_CTRL_PRESS:      { get: function getCTRLKeyPress()      { return _Keys[17 + PRESS]; } },
        KEY_CTRL_DOWN:       { get: function getCTRLKeyDown()       { return _Keys[17 + DOWN ]; } },

        KEY_ALT_UP:          { get: function getALTKeyUp()          { return _Keys[18 + UP   ]; } },
        KEY_ALT_PRESS:       { get: function getALTKeyPress()       { return _Keys[18 + PRESS]; } },
        KEY_ALT_DOWN:        { get: function getALTKeyDown()        { return _Keys[18 + DOWN ]; } },

        KEY_BACKSPACE_UP:    { get: function getBACKSPACEKeyUp()    { return _Keys[8 + UP   ]; } },
        KEY_BACKSPACE_PRESS: { get: function getBACKSPACEKeyPress() { return _Keys[8 + PRESS]; } },
        KEY_BACKSPACE_DOWN:  { get: function getBACKSPACEKeyDown()  { return _Keys[8 + DOWN ]; } },

        KEY_ENTER_UP:        { get: function getENTERKeyUp()        { return _Keys[13 + UP   ]; } },
        KEY_ENTER_PRESS:     { get: function getENTERKeyPress()     { return _Keys[13 + PRESS]; } },
        KEY_ENTER_DOWN:      { get: function getENTERKeyDown()      { return _Keys[13 + DOWN ]; } },


        KEY_UP_UP:       { get: function getUPKeyUp()       { return _Keys[38 + UP   ]; } },
        KEY_UP_PRESS:    { get: function getUPKeyPress()    { return _Keys[38 + PRESS]; } },
        KEY_UP_DOWN:     { get: function getUPKeyDown()     { return _Keys[38 + DOWN ]; } },

        KEY_LEFT_UP:     { get: function getLEFTKeyUp()     { return _Keys[37 + UP   ]; } },
        KEY_LEFT_PRESS:  { get: function getLEFTKeyPress()  { return _Keys[37 + PRESS]; } },
        KEY_LEFT_DOWN:   { get: function getLEFTKeyDown()   { return _Keys[37 + DOWN ]; } },

        KEY_RIGHT_UP:    { get: function getRIGHTKeyUp()    { return _Keys[40 + UP   ]; } },
        KEY_RIGHT_PRESS: { get: function getRIGHTKeyPress() { return _Keys[40 + PRESS]; } },
        KEY_RIGHT_DOWN:  { get: function getRIGHTKeyDown()  { return _Keys[40 + DOWN ]; } },

        KEY_DOWN_UP:     { get: function getDOWNKeyUp()     { return _Keys[39 + UP   ]; } },
        KEY_DOWN_PRESS:  { get: function getDOWNKeyPress()  { return _Keys[39 + PRESS]; } },
        KEY_DOWN_DOWN:   { get: function getDOWNKeyDown()   { return _Keys[39 + DOWN ]; } },


        KEY_BRACKET_L_UP:     { get: function getTABKeyUp()    { return _Keys[219 + UP   ]; } },
        KEY_BRACKET_L_PRESS:  { get: function getTABKeyPress() { return _Keys[219 + PRESS]; } },
        KEY_BRACKET_L_DOWN:   { get: function getTABKeyDown()  { return _Keys[219 + DOWN ]; } },

        KEY_BRACKET_R_UP:     { get: function getTABKeyUp()    { return _Keys[221 + UP   ]; } },
        KEY_BRACKET_R_PRESS:  { get: function getTABKeyPress() { return _Keys[221 + PRESS]; } },
        KEY_BRACKET_R_DOWN:   { get: function getTABKeyDown()  { return _Keys[221 + DOWN ]; } },

        KEY_COLON_UP:         { get: function getTABKeyUp()    { return _Keys[186 + UP   ]; } },
        KEY_COLON_PRESS:      { get: function getTABKeyPress() { return _Keys[186 + PRESS]; } },
        KEY_COLON_DOWN:       { get: function getTABKeyDown()  { return _Keys[186 + DOWN ]; } },

        KEY_QUOTE_UP:         { get: function getTABKeyUp()    { return _Keys[222 + UP   ]; } },
        KEY_QUOTE_PRESS:      { get: function getTABKeyPress() { return _Keys[222 + PRESS]; } },
        KEY_QUOTE_DOWN:       { get: function getTABKeyDown()  { return _Keys[222 + DOWN ]; } },

        KEY_COMMA_UP:         { get: function getTABKeyUp()    { return _Keys[188 + UP   ]; } },
        KEY_COMMA_PRESS:      { get: function getTABKeyPress() { return _Keys[188 + PRESS]; } },
        KEY_COMMA_DOWN:       { get: function getTABKeyDown()  { return _Keys[188 + DOWN ]; } },

        KEY_PERIOD_UP:        { get: function getTABKeyUp()    { return _Keys[190 + UP   ]; } },
        KEY_PERIOD_PRESS:     { get: function getTABKeyPress() { return _Keys[190 + PRESS]; } },
        KEY_PERIOD_DOWN:      { get: function getTABKeyDown()  { return _Keys[190 + DOWN ]; } },

        KEY_SLASH_F_UP:       { get: function getTABKeyUp()    { return _Keys[191 + UP   ]; } },
        KEY_SLASH_F_PRESS:    { get: function getTABKeyPress() { return _Keys[191 + PRESS]; } },
        KEY_SLASH_F_DOWN:     { get: function getTABKeyDown()  { return _Keys[191 + DOWN ]; } },

        KEY_SLASH_B_UP:       { get: function getTABKeyUp()    { return _Keys[220 + UP   ]; } },
        KEY_SLASH_B_PRESS:    { get: function getTABKeyPress() { return _Keys[220 + PRESS]; } },
        KEY_SLASH_B_DOWN:     { get: function getTABKeyDown()  { return _Keys[220 + DOWN ]; } },


        KEY_A_UP:       { get: function getAKeyUp()     { return _Keys[65 + UP   ]; } },
        KEY_A_PRESS:    { get: function getAKeyPress()  { return _Keys[65 + PRESS]; } },
        KEY_A_DOWN:     { get: function getAKeyDown()   { return _Keys[65 + DOWN ]; } },

        KEY_B_UP:       { get: function getBKeyUp()     { return _Keys[66 + UP   ]; } },
        KEY_B_PRESS:    { get: function getBKeyPress()  { return _Keys[66 + PRESS]; } },
        KEY_B_DOWN:     { get: function getBKeyDown()   { return _Keys[66 + DOWN ]; } },

        KEY_C_UP:       { get: function getCKeyUp()     { return _Keys[67 + UP   ]; } },
        KEY_C_PRESS:    { get: function getCKeyPress()  { return _Keys[67 + PRESS]; } },
        KEY_C_DOWN:     { get: function getCKeyDown()   { return _Keys[67 + DOWN ]; } },

        KEY_D_UP:       { get: function getDKeyUp()     { return _Keys[68 + UP   ]; } },
        KEY_D_PRESS:    { get: function getDKeyPress()  { return _Keys[68 + PRESS]; } },
        KEY_D_DOWN:     { get: function getDKeyDown()   { return _Keys[68 + DOWN ]; } },

        KEY_E_UP:       { get: function getEKeyUp()     { return _Keys[69 + UP   ]; } },
        KEY_E_PRESS:    { get: function getEKeyPress()  { return _Keys[69 + PRESS]; } },
        KEY_E_DOWN:     { get: function getEKeyDown()   { return _Keys[69 + DOWN ]; } },

        KEY_F_UP:       { get: function getFKeyUp()     { return _Keys[70 + UP   ]; } },
        KEY_F_PRESS:    { get: function getFKeyPress()  { return _Keys[70 + PRESS]; } },
        KEY_F_DOWN:     { get: function getFKeyDown()   { return _Keys[70 + DOWN ]; } },

        KEY_G_UP:       { get: function getGKeyUp()     { return _Keys[71 + UP   ]; } },
        KEY_G_PRESS:    { get: function getGKeyPress()  { return _Keys[71 + PRESS]; } },
        KEY_G_DOWN:     { get: function getGKeyDown()   { return _Keys[71 + DOWN ]; } },

        KEY_H_UP:       { get: function getHKeyUp()     { return _Keys[72 + UP   ]; } },
        KEY_H_PRESS:    { get: function getHKeyPress()  { return _Keys[72 + PRESS]; } },
        KEY_H_DOWN:     { get: function getHKeyDown()   { return _Keys[72 + DOWN ]; } },

        KEY_I_UP:       { get: function getIKeyUp()     { return _Keys[73 + UP   ]; } },
        KEY_I_PRESS:    { get: function getIKeyPress()  { return _Keys[73 + PRESS]; } },
        KEY_I_DOWN:     { get: function getIKeyDown()   { return _Keys[73 + DOWN ]; } },

        KEY_J_UP:       { get: function getJKeyUp()     { return _Keys[74 + UP   ]; } },
        KEY_J_PRESS:    { get: function getJKeyPress()  { return _Keys[74 + PRESS]; } },
        KEY_J_DOWN:     { get: function getJKeyDown()   { return _Keys[74 + DOWN ]; } },

        KEY_K_UP:       { get: function getKKeyUp()     { return _Keys[75 + UP   ]; } },
        KEY_K_PRESS:    { get: function getKKeyPress()  { return _Keys[75 + PRESS]; } },
        KEY_K_DOWN:     { get: function getKKeyDown()   { return _Keys[75 + DOWN ]; } },

        KEY_L_UP:       { get: function getLKeyUp()     { return _Keys[76 + UP   ]; } },
        KEY_L_PRESS:    { get: function getLKeyPress()  { return _Keys[76 + PRESS]; } },
        KEY_L_DOWN:     { get: function getLKeyDown()   { return _Keys[76 + DOWN ]; } },

        KEY_M_UP:       { get: function getMKeyUp()     { return _Keys[77 + UP   ]; } },
        KEY_M_PRESS:    { get: function getMKeyPress()  { return _Keys[77 + PRESS]; } },
        KEY_M_DOWN:     { get: function getMKeyDown()   { return _Keys[77 + DOWN ]; } },

        KEY_N_UP:       { get: function getNKeyUp()     { return _Keys[78 + UP   ]; } },
        KEY_N_PRESS:    { get: function getNKeyPress()  { return _Keys[78 + PRESS]; } },
        KEY_N_DOWN:     { get: function getNKeyDown()   { return _Keys[78 + DOWN ]; } },

        KEY_O_UP:       { get: function getOKeyUp()     { return _Keys[79 + UP   ]; } },
        KEY_O_PRESS:    { get: function getOKeyPress()  { return _Keys[79 + PRESS]; } },
        KEY_O_DOWN:     { get: function getOKeyDown()   { return _Keys[79 + DOWN ]; } },

        KEY_P_UP:       { get: function getPKeyUp()     { return _Keys[80 + UP   ]; } },
        KEY_P_PRESS:    { get: function getPKeyPress()  { return _Keys[80 + PRESS]; } },
        KEY_P_DOWN:     { get: function getPKeyDown()   { return _Keys[80 + DOWN ]; } },

        KEY_Q_UP:       { get: function getQKeyUp()     { return _Keys[81 + UP   ]; } },
        KEY_Q_PRESS:    { get: function getQKeyPress()  { return _Keys[81 + PRESS]; } },
        KEY_Q_DOWN:     { get: function getQKeyDown()   { return _Keys[81 + DOWN ]; } },

        KEY_R_UP:       { get: function getRKeyUp()     { return _Keys[82 + UP   ]; } },
        KEY_R_PRESS:    { get: function getRKeyPress()  { return _Keys[82 + PRESS]; } },
        KEY_R_DOWN:     { get: function getRKeyDown()   { return _Keys[82 + DOWN ]; } },

        KEY_S_UP:       { get: function getSKeyUp()     { return _Keys[83 + UP   ]; } },
        KEY_S_PRESS:    { get: function getSKeyPress()  { return _Keys[83 + PRESS]; } },
        KEY_S_DOWN:     { get: function getSKeyDown()   { return _Keys[83 + DOWN ]; } },

        KEY_T_UP:       { get: function getTKeyUp()     { return _Keys[84 + UP   ]; } },
        KEY_T_PRESS:    { get: function getTKeyPress()  { return _Keys[84 + PRESS]; } },
        KEY_T_DOWN:     { get: function getTKeyDown()   { return _Keys[84 + DOWN ]; } },

        KEY_U_UP:       { get: function getUKeyUp()     { return _Keys[85 + UP   ]; } },
        KEY_U_PRESS:    { get: function getUKeyPress()  { return _Keys[85 + PRESS]; } },
        KEY_U_DOWN:     { get: function getUKeyDown()   { return _Keys[85 + DOWN ]; } },

        KEY_V_UP:       { get: function getVKeyUp()     { return _Keys[86 + UP   ]; } },
        KEY_V_PRESS:    { get: function getVKeyPress()  { return _Keys[86 + PRESS]; } },
        KEY_V_DOWN:     { get: function getVKeyDown()   { return _Keys[86 + DOWN ]; } },

        KEY_W_UP:       { get: function getWKeyUp()     { return _Keys[87 + UP   ]; } },
        KEY_W_PRESS:    { get: function getWKeyPress()  { return _Keys[87 + PRESS]; } },
        KEY_W_DOWN:     { get: function getWKeyDown()   { return _Keys[87 + DOWN ]; } },

        KEY_X_UP:       { get: function getXKeyUp()     { return _Keys[88 + UP   ]; } },
        KEY_X_PRESS:    { get: function getXKeyPress()  { return _Keys[88 + PRESS]; } },
        KEY_X_DOWN:     { get: function getXKeyDown()   { return _Keys[88 + DOWN ]; } },

        KEY_Y_UP:       { get: function getYKeyUp()     { return _Keys[89 + UP   ]; } },
        KEY_Y_PRESS:    { get: function getYKeyPress()  { return _Keys[89 + PRESS]; } },
        KEY_Y_DOWN:     { get: function getYKeyDown()   { return _Keys[89 + DOWN ]; } },

        KEY_Z_UP:       { get: function getZKeyUp()     { return _Keys[90 + UP   ]; } },
        KEY_Z_PRESS:    { get: function getZKeyPress()  { return _Keys[90 + PRESS]; } },
        KEY_Z_DOWN:     { get: function getZKeyDown()   { return _Keys[90 + DOWN ]; } },

        InputUpdate:
        {
            value: function InputUpdate()
            {
                for (var i = PRESS; i < DOWN; ++i)
                    if (_Keys[i])
                        _Keys[i] = false;
            }
        }
    });
}

