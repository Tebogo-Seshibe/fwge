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
3. Add your objects/lights/scripts to the scene.
4. Call FWGE.Game.Start();

```javascript
<script type="text/javascript">
window.onload = function onload(e)
{
    try
    {
        // Before anything, initialise the engine
        FWGE.Init(
        {
            Canvas: document.getElementById("canvas"),
            Heigth: 600,
            Width:  800,
            Clear:  new Float32Array([0, 0, 0, 0])
        });

        // We first need a light to see what's in the scene.
        var Ambient = FWGE.Game.Light.Ambient(
        {
            Colour:     new Float32Array([1, 1, 1]),
            Intensity:  1.0
        });

        // Next, we need to create shader to define how our scene will
        // be rendered.
        var Shader = FWGE.Render.Shader(
        {
            Name:           "Basic Shader",
            VertexShader:   `/* Basic Vertex Shader */
                            attribute vec3 A_Position;
                            attribute vec3 A_Colour;

                            struct Matrix
                            {
                                mat4 ModelView;
                                mat4 Projection;
                            };
                            uniform Matrix U_Matrix;

                            varying vec3 V_Colour;

                            void main(void)
                            {
                                V_Colour = A_Colour;
                                gl_Position = U_Matrix.Projection * U_Matrix.ModelView * vec4(A_Position, 1.0);
                            }
                            `,
            FragmentShader: `/* Basic Fragment Shader */
                            precision mediump float;

                            varying vec3 V_Colour;

                            void main(void)
                            {
                                gl_FragColor = vec4(V_Colour, 1.0);
                            }
                            `
        });

        // Define the vertices of the object
        var Mesh = FWGE.Render.Mesh(
        {
            Position:
            [
                -0.5,  0.5, -0.5,  -0.5,  0.5,  0.5,   0.5,  0.5,  0.5,   0.5,  0.5, -0.5,
                -0.5, -0.5,  0.5,  -0.5, -0.5, -0.5,   0.5, -0.5, -0.5,   0.5, -0.5,  0.5,
                -0.5,  0.5, -0.5,  -0.5, -0.5, -0.5,  -0.5, -0.5,  0.5,  -0.5,  0.5,  0.5,
                 0.5,  0.5,  0.5,   0.5, -0.5,  0.5,   0.5, -0.5, -0.5,   0.5,  0.5, -0.5,
                -0.5,  0.5,  0.5,  -0.5, -0.5,  0.5,   0.5, -0.5,  0.5,   0.5,  0.5,  0.5,
                 0.5,  0.5, -0.5,   0.5, -0.5, -0.5,  -0.5, -0.5, -0.5,  -0.5,  0.5, -0.5
            ],
            Colours:
            [
                0.0, 1.0, 1.0,  0.0, 1.0, 1.0,  0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
                1.0, 0.0, 1.0,  1.0, 0.0, 1.0,  1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
                1.0, 1.0, 0.0,  1.0, 1.0, 0.0,  1.0, 1.0, 0.0, 1.0, 1.0, 0.0,
                0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
                0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
                1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, 1.0, 0.0, 0.0
            ],
            Normals:
            [
                 0.0,  1.0,  0.0,   0.0,  1.0,  0.0,   0.0,  1.0,  0.0,   0.0,  1.0,  0.0,
                 0.0, -1.0,  0.0,   0.0, -1.0,  0.0,   0.0, -1.0,  0.0,   0.0, -1.0,  0.0,
                -1.0,  0.0,  0.0,  -1.0,  0.0,  0.0,  -1.0,  0.0,  0.0,  -1.0,  0.0,  0.0,
                 1.0,  0.0,  0.0,   1.0,  0.0,  0.0,   1.0,  0.0,  0.0,   1.0,  0.0,  0.0,
                 0.0,  0.0,  1.0,   0.0,  0.0,  1.0,   0.0,  0.0,  1.0,   0.0,  0.0,  1.0,
                 0.0,  0.0, -1.0,   0.0,  0.0, -1.0,   0.0,  0.0, -1.0,   0.0,  0.0, -1.0
            ],
            UVs:
            [
                0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,   0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,
                0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,   0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,
                0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,   0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0
            ],
            Indices:
            [
                 0,  1, 2,    0,  2,  3,     4,  5, 6,    4,  6,  7,     8,  9, 10,   8, 10, 11,
                12, 13, 14,  12, 14, 15,    16, 17, 18,  16, 18, 19,    20, 21, 22,  20, 22, 23
            ]
        });

        // Define colouring of the object and attach the shader to it
        var RenderMaterial = FWGE.Render.RenderMaterial(
        {
            Ambient:        [1,1,1],
            Diffuse:        [1,1,1],
            Specular:       [1,1,1],
            Alpha:          1.0,
            Shininess:      5.0,
            Shader:         Shader,
            ImageLink:      undefined,
            BumpLink:       undefined,
            SpecularLink:   undefined
        });

        // Finally, combine them into a GameObject
        var Cube = FWGE.Game.GameObject(
        {
            Name:           "Cube",
            Mesh:           Mesh,
            RenderMaterial: RenderMaterial,
            Transform:      FWGE.Game.Transform(
            {
                Position:   [0, 0,-8],
                Rotation:   [0, 0, 0],
                Scale:      [1, 1, 1],
                Shear:      [0, 0, 0]
            }),
            
            Begin: function Begin()
            {
                console.log("Begin Cube");
            },
            Update: function Update()
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
            End: function End()
            {
                console.log("Ending Cube");
            }
        });
        
        FWGE.Game.Start();
    }
    catch(e)
    {
        alert(e);
    }
};
</script>
```
