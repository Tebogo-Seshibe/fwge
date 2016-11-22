function FWGEPrototype()
{
	var $ = this;

	Object.defineProperties($,
	{
        Item:     { value: new Item()       },
        Maths:    { value: new Maths()      },
        Render:   { value: new Render()     },
        Physics:  { value: new Physics()    },
        Convert:  { value: new Convert() 	},
        Other:    { value: new Other()      },

		Init: 
		{
			value: function Init(canvas)
			{
				GL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

				if (!GL)
					throw "Webgl context could not be initialized.";

				window.onresize = function onresize(e)
				{
					FWGE.Render.Camera.CameraUpdate();
					__PROJECTION__.ProjectionUpdate();
				};
				FWGE.Render.Camera.CameraUpdate();
				__PROJECTION__.ProjectionUpdate();

				shader = new FWGE.Render.Shader
				({
					name: "Simple Shader",
					vertexShader: vs_text,
					fragmentShader: fs_text
				});
				GL.useProgram(shader.Program);

				GL.clearColor(0, 0, 0, 0);
				GL.enable(GL.DEPTH_TEST);
			}
		},
		Start: { value: function Start() { __ENGINE__.Start();  } },
		Stop:  { value: function Stop()  { __ENGINE__.Stop(); } }
	});
}

    Object.defineProperty(window, "FWGE", { value: new FWGEPrototype() });

    