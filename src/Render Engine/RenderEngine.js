function RenderEngine()
{
    var _Renderer;

    Object.defineProperties(this,
    {
        Colour:         {value: new Colour()},
        Mesh:           {value: Mesh},
        RenderMaterial: {value: RenderMaterial},
        Shader:         {value: Shader},
        GameScreen:     {value: new GameScreen()},

        /*!
         *  @function       Init
         *  @description    Initializes the rendering engine
         */
    	Init:
    	{
    		value: function Init()
    		{
                _Renderer = new Renderer();
    		}
    	},

        /*!
         *  @function       RenderUpdate
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

