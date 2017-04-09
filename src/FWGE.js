/**
 * @name        FWGE
 * @module      {}
 * @description Some description.
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
        Game:           { value: new GameEngine() },

        /**
         * @property    Physics: {PhysicsEngine}
         * @description The physics engine.
		 * @see         FWGE.Physics
         */
        Physics:        { value: new PhysicsEngine() },

        /**
         * @property    Render: {RenderEngine}
         * @description The rendering engine.
		 * @see         Render
         */
        Render:         { value: new RenderEngine() },

        /**
         * @function    Init: {undefined}
         * @description Initializes the webgl context and the seperate engines
         * @param       request:     {Object}
         *              > Canvas:    {HTMLCanvasElement}
         *              > Height:    {Number}               [null]
         *              > Width:     {Number}               [null]
         *              > Clear:     {Float32Array}         [null]
         */
        Init: 
        {
            value: function Init(request)
            {
                if (!request) request = {};
                if (!(request.clear instanceof Float32Array) || request.clear.length === 4)
                    request.clear = [0, 0, 0, 0];

                GL = request.canvas.getContext("webgl") || request.canvas.getContext("experimental-webglrequest.");

                if (!GL)
                    throw new Error("Webgl context could not be initialized.");

                GL.clearColor(request.clear[0] || 0, request.clear[1] || 0, request.clear[2] || 0, request.clear[3] || 0);

                this.Game.Init();
                this.Physics.Init();
                this.Render.Init();
            }
        }
    });
}

