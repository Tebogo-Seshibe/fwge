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
  2. Place all intended actions into a function.
  3. Make a call to the `FWGE.Init(callback)` method with your function.
  4. Open in a WebGL enabled browser.

```javascript
<script type="text/javascript">
window.onload = function onload(e)
{
	FWGE.Init();
	FWGE.LoadObjects(null);
	
	FWGE.Start(function Start()
	{
	        var earth = FWGE.GameObjects.UVSphere();
	        earth.Material = new FWGE.Material
	        ({
	            name: "Cube Material",
	            uselight: true,
	            shader: "Toon Shader"
	        });
	        earth.Transform.Position.Z = -3;
	        earth.Transform.Rotation.Z = 22.3;
	        earth.Transform.Scale.X = 3;
	        earth.Transform.Scale.Y = 3;
	        earth.Transform.Scale.Z = 3;
        
	        earth.Update = function Update()
	        {
	            this.Transform.Rotation.Y += FWGE.Time.Delta; 
	                    
	            if (FWGE.Input.W)
	                this.Transform.Position.Z -= (FWGE.Time.Delta * 0.1);
	            if (FWGE.Input.S)
	                this.Transform.Position.Z += (FWGE.Time.Delta * 0.1);
	            
	            if (FWGE.Input.A)
	                this.Transform.Position.X -= (FWGE.Time.Delta * 0.1);
	            if (FWGE.Input.D)
	                this.Transform.Position.X += (FWGE.Time.Delta * 0.1);
	            
	            if (FWGE.Input.Q)
	                this.Transform.Position.Y += (FWGE.Time.Delta * 0.1);
	            if (FWGE.Input.E)
	                this.Transform.Position.Y -= (FWGE.Time.Delta * 0.1);
	        };
        
	        var ambiance = FWGE.Lights.Ambient();
	        ambiance.Colour = FWGE.Colour.Create(0.5,0.5,0.5,1.0);
	        
	        var light = FWGE.Lights.Point();
	        light.Position.X = 0;
	        light.Position.Y = 0;
	        light.Position.Z = 5;
	        light.Shininess = 256;
	});
};
</script>
```
"# FWGE" 
