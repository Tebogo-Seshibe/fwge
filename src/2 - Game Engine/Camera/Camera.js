/**
 * @name        Camera
 * @module      FWGE.Game
 * @description Something...
 */

let Camera = (function()
{
    function Camera()
    {
        var _Mode = 0;
        var _FOV = 35;
        var _Aspect = 16/9;
        var _Near = 0.1;
        var _Far = 900;
        var _Left = -10;
        var _Right = 10;
        var _Top = 10;
        var _Bottom = 10;
        var _Theta = 90;
        var _Phi = 90;

        Object.defineProperties(this, 
        {
            constructor: Camera,

            //Transform: { value : new Transform(), configurable: false, enumerable: true,  writable: false },
            CameraMode: { value: 0, configurable: false, enumerable: true, writable: true },

            Mode:
            { 
                get: function get() { return _Mode; },
                set: function set(m)
                {
                    switch (m)
                    {
                        case 0:
                        case 1:
                            _Mode = m;
                        break;
                    }
                }
            },

            FOV: 
            {
                get: function get() { return _FOV; },
                set: function set(f) { if (typeof f === 'number') _FOV = f; }
            },
            Aspect: 
            {
                get: function get() { return _Aspect; },
                set: function set(a) { if (typeof a === 'number') _Aspect = a; }
            },
            Near: 
            {
                get: function get() { return _Near; },
                set: function set(n) { if (typeof n === 'number') _Near = n; }
            },
            Far: 
            {
                get: function get() { return _Far; },
                set: function set(f) { if (typeof f === 'number') _Far = f; }
            },
            Left: 
            {
                get: function get() { return _Left; },
                set: function set(l) { if (typeof l === 'number') _Left = l; }
            },
            Right: 
            {
                get: function get() { return _Right; },
                set: function set(r) { if (typeof r === 'number') _Right = r; }
            },
            Top: 
            {
                get: function get() { return _Top; },
                set: function set(t) { if (typeof t === 'number') _Top = t; }
            },
            Bottom: 
            {
                get: function get() { return _Bottom; },
                set: function set(b) { if (typeof b === 'number') _Bottom = b; }
            },
            Theta: 
            {
                get: function get() { return _Theta; },
                set: function set(t) { if (typeof t === 'number') _Theta = t; }
            },
            Phi: 
            {
                get: function get() { return _Phi; },
                set: function set(p) { if (typeof p === 'number') _Phi = p; }
            },
            
            Update:
            {
                value: function Update()
                {
                    if (FWGE.GL.canvas.width != FWGE.GL.canvas.clientWidth || FWGE.GL.canvas.height != FWGE.GL.canvas.clientHeight)
                    {
                        FWGE.GL.canvas.width  = FWGE.GL.canvas.clientWidth;
                        FWGE.GL.canvas.height = FWGE.GL.canvas.clientHeight;
                    }
                    
                    this.Aspect = FWGE.GL.drawingBufferWidth / FWGE.GL.drawingBufferHeight;
                }
            }
        });
    }
    Camera.prototype = Object.create(null);

    return new Camera();
})();