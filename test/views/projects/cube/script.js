var Cube;

/*!
 *
 */
var server = (function()
{
	function Server()
	{
		var $ = this;
		var _XML = new XMLHttpRequest();

		$.send = function send(message, callback)
		{
			_XML.open("GET", "/" + message, true);
			_XML.send(null);

			_XML.onreadystatechange = function onreadystatechange()
			{
				if ((_XML.readyState === _XML.DONE) && (_XML.status === 0 || _XML.status === 200))
					callback(_XML.responseText, null);
			};

			_XML.error = function error()
			{
				callback(null, "Failed to complete request: " + message);
			};
		};
	}

	return new Server();
})();

window.onload = function onload(e)
{
	addShader();
};

function addShader()
{
	server.send("shaders/basic", function(res, err)
	{
		if (!!err)
			alert(err);
		else
		{
			res = JSON.parse(res);

			FWGE.Init
			({
				canvas: document.getElementById("canvas"),
				heigth: 600,
				width: 800,
				clear: new Float32Array([0,0,0,0])
			});

			var Shader = new FWGE.Render.Shader
			({
				name: 			res.Name,
				vertexShader: 	res.VertexShader,
				fragmentShader: res.FragmentShader
			});

			var Mesh = new FWGE.Render.Mesh
			({
			    position:
			    [
			        -0.5,  0.5, -0.5,  -0.5,  0.5,  0.5,   0.5,  0.5,  0.5,   0.5,  0.5, -0.5,
			        -0.5, -0.5,  0.5,  -0.5, -0.5, -0.5,   0.5, -0.5, -0.5,   0.5, -0.5,  0.5,
			        -0.5,  0.5, -0.5,  -0.5, -0.5, -0.5,  -0.5, -0.5,  0.5,  -0.5,  0.5,  0.5,
			         0.5,  0.5,  0.5,   0.5, -0.5,  0.5,   0.5, -0.5, -0.5,   0.5,  0.5, -0.5,
			        -0.5,  0.5,  0.5,  -0.5, -0.5,  0.5,   0.5, -0.5,  0.5,   0.5,  0.5,  0.5,
			         0.5,  0.5, -0.5,   0.5, -0.5, -0.5,  -0.5, -0.5, -0.5,  -0.5,  0.5, -0.5
			    ],
			    colours:
			    [
			        0.0, 1.0, 1.0,  0.0, 1.0, 1.0,  0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
			        1.0, 0.0, 1.0,  1.0, 0.0, 1.0,  1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
			        1.0, 1.0, 0.0,  1.0, 1.0, 0.0,  1.0, 1.0, 0.0, 1.0, 1.0, 0.0,
			        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
			        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
			        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, 1.0, 0.0, 0.0
			    ],
			    normals:
			    [
			         0.0,  1.0,  0.0,   0.0,  1.0,  0.0,   0.0,  1.0,  0.0,   0.0,  1.0,  0.0,
			         0.0, -1.0,  0.0,   0.0, -1.0,  0.0,   0.0, -1.0,  0.0,   0.0, -1.0,  0.0,
			        -1.0,  0.0,  0.0,  -1.0,  0.0,  0.0,  -1.0,  0.0,  0.0,  -1.0,  0.0,  0.0,
			         1.0,  0.0,  0.0,   1.0,  0.0,  0.0,   1.0,  0.0,  0.0,   1.0,  0.0,  0.0,
			         0.0,  0.0,  1.0,   0.0,  0.0,  1.0,   0.0,  0.0,  1.0,   0.0,  0.0,  1.0,
			         0.0,  0.0, -1.0,   0.0,  0.0, -1.0,   0.0,  0.0, -1.0,   0.0,  0.0, -1.0
			    ],
			    uvs:
			    [
			        0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,   0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,
			        0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,   0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,
			        0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,   0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0
			    ],
			    indices:
			    [
			         0,  1, 2,    0,  2,  3,     4,  5, 6,    4,  6,  7,     8,  9, 10,   8, 10, 11,
			        12, 13, 14,  12, 14, 15,    16, 17, 18,  16, 18, 19,    20, 21, 22,  20, 22, 23
			    ]
			});

			var Material = new FWGE.Render.RenderMaterial
			({
				ambient: 		[1,1,1],
				diffuse: 		[1,1,1],
				specular: 		[1,1,1],
				alpha: 			1.0,
				shininess: 		5.0,
				shader: 		Shader,
				imagemamp: 		undefined,
				imagemamp: 		undefined,
				specularmap: 	undefined
			});

			Cube = new FWGE.Game.GameObject
			({
				name: 			"Cube",
				mesh: 			Mesh,
				material: 		Material,
				transform: 		new FWGE.Game.Transform
				({
					position: 	[0, 0,-8],
					rotation: 	[0, 0, 0],
					scale: 		[1, 1, 1],
					shear: 		[0, 0, 0]
				}),
				begin: 			function Begin()
				{
					console.log("Begin Cube");
					console.log(this);
				},
				update: 		function Update()
				{
					this.Transform.Rotation.X += FWGE.Game.Time.Delta * 0.05;
					this.Transform.Rotation.Y += FWGE.Game.Time.Delta * 0.10;
					this.Transform.Rotation.Z += FWGE.Game.Time.Delta * 0.15;

					if (FWGE.Game.Input.KEY_A_DOWN)
						this.Transform.Position.X += FWGE.Game.Time.Delta;
					if (FWGE.Game.Input.KEY_D_DOWN)
						this.Transform.Position.X -= FWGE.Game.Time.Delta;
					if (FWGE.Game.Input.KEY_W_DOWN)
						this.Transform.Position.Z += FWGE.Game.Time.Delta;
					if (FWGE.Game.Input.KEY_S_DOWN)
						this.Transform.Position.Z -= FWGE.Game.Time.Delta;
					if (FWGE.Game.Input.KEY_Q_DOWN)
						this.Transform.Position.Y += FWGE.Game.Time.Delta;
					if (FWGE.Game.Input.KEY_E_DOWN)
						this.Transform.Position.Y -= FWGE.Game.Time.Delta;
					if (FWGE.Game.Input.KEY_F5_PRESS)
						window.location.reload();
				},
				end: 			function End()
				{
					console.log("Ending Cube");
					console.log(this);
				}
			});

			console.log(Cube);

			Cube.Destroy();
			/*setTimeout(function setTimeout(e)
			{
				FWGE.Stop();
			}, 5000);*/
			FWGE.Start();
		}
	});
}