![fwge_logo](https://cloud.githubusercontent.com/assets/11041523/12609838/f812f660-c4ec-11e5-9284-fe80d6d811eb.png)

###Synopsis
FWGE is an web-based 3D game engine built on top of WebGL.


###Motivation
This all began when after using the programmes: Unity3D, Unreal Engine, Blender, Maya.
I initially wanted to make games but quickly learned what little knew about game development (and any form of development for that matter).
A few years, and a couple of Computer Science modules later, I decided to build this engine.


###Installation
To begin running :
  1. Add a javascript script tag
  2. Call FWGE.Init();
  3. If no exception is thrown, you're good to go. Add your objects/lights/scripts to the scene.
  4. Call FWGE.Game.Start();

```javascript
<script type="text/javascript">
window.onload = function onload(e)
{
	try
	{
		FWGE.Init(
		{
			canvas: document.getElementById("canvas"),
			clear: 	new Float32Array([0, 0, 0, 0])
		});
	}
	catch(e)
	{
		alert(e);
	}

	Start();
}

function Start()
{
	Cube = new FWGE.Game.GameObject(
	{
		name: 			"Spinning Colourful Cube",
		mesh: 			new FWGE.Render.Mesh(
		{
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
		}),
		material: 		new FWGE.Render.RenderMaterial(
		{
			ambient: 			[1,1,1],
			diffuse: 			[1,1,1],
			specular: 			[1,1,1],
			alpha: 				1.0,
			shininess: 			5.0,
			shader: 			new FWGE.Render.Shader(
			{
				name: 			"Basic Shader",
				vertexShader: 	"attribute vec3 A_Position;\nattribute vec3 A_Colour;\n\nstruct Matrix\n{\n\tmat4 ModelView;\n\tmat4 Projection;\n};\nuniform Matrix U_Matrix;\n\nvarying vec3 V_Colour;\n\nvoid main(void)\n{\n\tV_Colour = A_Colour;\n\tgl_Position = U_Matrix.Projection * U_Matrix.ModelView * vec4(A_Position, 1.0);\n}\n",
				fragmentShader: "precision mediump float;\n\nvarying vec3 V_Colour;\n\nvoid main(void)\n{\n\tgl_FragColor = vec4(V_Colour, 1.0);\n}\n"
			}),
			bumpmap: 			undefined,
			specularmap: 		undefined
		}),
		transform: 		new FWGE.Game.Transform(
		{
			position: 	[0, 0,-8],
			rotation: 	[0, 0, 0],
			scale: 		[1, 1, 1],
			shear: 		[0, 0, 0]
		}),
		
		begin: function Begin()
		{
			console.log("This is just to say hi.");
		},
		update: function Update()
		{
			this.Transform.Rotation.Y += FWGE.Game.Time.Delta * 0.05;

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

			if (FWGE.Game.Input.KEY_SUBTRACT_PRESS)
				Ambient.Intensity -= 0.1;
			if (FWGE.Game.Input.KEY_ADD_PRESS)
				Ambient.Intensity += 0.1;
		},
		end: function End()
		{
			console.log("Destroying the Cube");
		}
	});

	var Ambient = FWGE.Game.Light.Ambient(
	{
		colour: new Float32Array([1,1,1]),
		intensity: 1.0
	});
	
	FWGE.Game.Start();
};
</script>
```
