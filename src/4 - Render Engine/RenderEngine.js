/**
 * @name RenderEngine
 * @module      FWGE 
 * @description This module contains all the visual related aspects of the 
 *              game engine.
 */

let RenderEngine = (function()
{
    function RenderEngine()
    {
        Object.defineProperties(this,
        {
            /**
             *  @function       RenderUpdate: {undefined}
             *  @description    Updates the rendering to the screen
             */
            Update:
            {
                value: function Update()
                {
                    Renderer.Render();
                    Projection.Update(Camera.Mode, Camera)
                }
            }
        });
    }

    RenderEngine.prototype = Object.create(null);
    Object.seal(RenderEngine.prototype);

    return new RenderEngine();
})();
Object.seal(RenderEngine);
