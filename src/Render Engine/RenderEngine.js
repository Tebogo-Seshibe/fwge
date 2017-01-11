/**
 * @constructor RenderEngine
 * @description This module contains all the visual related aspects of the 
 *              game engine.
 * @module      FWGE 
 */
function RenderEngine()
{
    var _Renderer;

    Object.defineProperties(this,
    {
        /**
         * @property    Colour: {Colour}
         * @description This module creates colour arrays.
         * @see         FWGE.Render.Colour
         */
        Colour:         {value: new Colour()},
        /**
         * @property    Mesh: {Function}
         * @description This is the constructor for a Mesh object.
         * @see         FWGE.Render.Mesh
         */
        Mesh:           {value: Mesh},
        /**
         * @property    RenderM<aterial: {Function`}
         * @description This is the constructor for a Render Material.
         * @see         FWGE.Render.RenderMaterial
         */
        RenderMaterial: {value: RenderMaterial},
        /**
         * @property    Shader: {Function}
         * @description This is a constructor for a Shader object.
         * @see         FWGE.Render.Shader
         */
        Shader:         {value: Shader},

        /**
         *  @function       Init: void
         *  @description    Initializes the rendering engine
         */
        Init:
        {
            value: function Init()
            {
                __MODELVIEW__ = new ModelView();
                __PROJECTION__ = new Projection();
                _Renderer = new Renderer();
                GL.enable(GL.DEPTH_TEST);
            }
        },

        /**
         *  @function       RenderUpdate: void
         *  @description    Updates the rendering to the screen
         */
        RenderUpdate:
        {
            value: function RenderUpdate()
            {
                _Renderer.Render();
            }
        }
    });
}

