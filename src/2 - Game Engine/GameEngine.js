/**
 * @name        GameEngine
 * @module      FWGE
 * @description Something...
 */

let GameEngine = (function()
{
    function GameEngine()
    {
        let self = this;
        let _Running  = false;
        let _AnimationFrame = -1;

        /**
         * @function    Run
         * @return      {undefined}
         * @description Runs the main game loop
         */
        function _Run()
        {
            _AnimationFrame = window.requestAnimationFrame(_Run);

            self.Update();

            if (_Running)
            {
                PhysicsEngine.Update();
                RenderEngine.Update();
            }
        }

        Object.defineProperties(this,
        {
            /**
             * @function    GameUpdate
             * @return      {undefined}
             */
            Update:
            {
                value: function Update()
                {
                    Time.Update();
                    Camera.Update();

                    var i = GameObject.Objects.length;
                    while (--i >= 0)
                        GameObject.Objects[i].ObjectUpdate();

                    Input.InputUpdate();
                },
                configurableL:false, configurable: false, enumerable: true
            },

            /**
             * @function    Start
             * @return      {undefined}
             */
            Start:
            {
                value: function Start()
                {
                    if(!_Running)
                        _Running = true;

                    if (_AnimationFrame === -1)
                        _Run();
                },
                configurable: false, configurable: false, enumerable: true
            },

            /**
             * @function    Pause
             * @return      {undefined}
             */
            Pause:
            {
                value: function Pause()
                {
                    if (!_Running)
                        _Running = false;
                },
                configurable:false, configurable: false, enumerable: true
            },

            /**
             * @function    Stop
             * @return      {undefined}
             */
            Stop:
            {
                value: function Stop()
                {
                    if (_Running)
                        _Running = false;

                    if (_AnimationFrame !== -1)
                    {
                        window.cancelAnimationFrame(_AnimationFrame);
                        _AnimationFrame = -1;
                    }

                    Time.Reset();
                },
                configurable:false, configurable: false, enumerable: true
            }
        });

        Object.seal(this);
    }

    GameEngine.prototype = Object.create(null);
    Object.seal(GameEngine.prototype);

    return new GameEngine();
})();
Object.seal(GameEngine);
