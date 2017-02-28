/**
 * @name    FWGE
 * @module  {}
 */
function FWGEPrototype()
{
    Object.defineProperties(this,
    {
        /**
         * @property    Game: {GameEngine}
         * @description The main engine.
		 * @see         FWGE.Game
         */
        Game:       { value: new GameEngine() },

        /**
         * @property    Physics: {PhysicsEngine}
         * @description The physics engine.
		 * @see         FWGE.Physics
         */
        Physics:    { value: new PhysicsEngine() },

        /**
         * @property    Render: {RenderEngine}
         * @description The rendering engine.
		 * @see         Render
         */
        Render:     { value: new RenderEngine() },

        /**
         * @function    Init: {undefined}
         * @description Initializes the webgl context and the seperate engines
         * @param       request:     {Object}
         *              > Canvas:    {HTMLCanvasElement}
         *              > Height:    {Number}                [nullable]
         *              > Width:     {Number}                [nullable]
         *              > Clear:     {Float32Array}          [nullable]
         */
        Init: 
        {
            value: function Init(request)
            {
                if (!request) request = {};
                if (!request.Clear || !(request.Clear instanceof Float32Array) || request.Clear.length === 4)
                    request.Clear = [0, 0, 0, 0];

                GL = Canvas.getContext("webgl") || Canvas.getContext("experimental-webgl");

                if (!GL)
                    throw new Error("Webgl context could not be initialized.");

                GL.clearColor(request.Clear[0] || 0, request.Clear[1] || 0, request.Clear[2] || 0, request.Clear[3] || 0);

                this.Game.Init();
                this.Physics.Init();
                this.Render.Init();
            }
        }
    });
}

window.FWGE = new FWGEPrototype();

