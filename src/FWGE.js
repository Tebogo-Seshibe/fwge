/**
 * @name        FWGE
 * @module      window
 * @description This is the main object used to handle the system.
 *              All control, of the game, rendering, and physcis engines are through
 *              this obejct.
 */

window.FWGE = (function()
{
    function FWGE()
    {
        let _GL = undefined;

        Object.defineProperties(this,
        {
            /**
             * @property    {GL}
             * @type        {WebGLRenderingContext}
             */
            GL: { get: function get() { return _GL; }, configurable: false, enumerable: false },

            /**
             * @function    Init
             * @param       {Object}            request
             * @param       {HTMLCanvasElement} request.canvas
             * @param       {number}            request.height
             * @param       {number}            request.width
             * @param       {Array<number>}     request.clear
             * @return      {undefined}
             */
            Init:
            {
                value: function Init({canvas = undefined, height = 480, width = 640, clear = [0, 0, 0, 1]} = {})
                {
                    if (!canvas)
                        throw new Error("Field {canvas: HTMLCanvasElement} is required");

                    _GL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

                    if (!_GL)
                        throw new Error("Webgl context could not be initialized.");
                    
                    Input.Init(canvas);
                    _GL.clearColor(clear[0], clear[1], clear[2], clear[3]);

                    console.log(this.GL);
                },
                configurable: false, enumerable: true, writable: false
            },

            /**
             * @function    Start
             * @return      {undefined}
             */
            Start:
            {
                value: function Start()
                {
                    GameEngine.Start();
                },
                configurable: false, enumerable: true, writable: false
            },

            /**
             * @function    Pause
             * @return      {undefined}
             */
            Pause:
            {
                value: function Pause()
                {
                    GameEngine.Pause();
                },
                configurable: false, enumerable: true, writable: false
            },

            /**
             * @function    Stop
             * @return      {undefined}
             */
            Stop:
            {
                value: function Stop()
                {
                    GameEngine.Stop();
                },
                configurable: false, enumerable: true, writable: false
            }        
        });

        Object.seal(this);
    }

    FWGE.prototype = Object.create(null);
    Object.seal(FWGE.prototype);
    
    return new FWGE();
})();
Object.seal(FWGE);
