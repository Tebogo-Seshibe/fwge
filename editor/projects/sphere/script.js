var Sphere = !!Sphere ? Sphere : Object.create(null);
var sphere;

(function()
{
    var Light;
    Object.defineProperties(Sphere,
    {
        Run:
        {
            value: function Run()
            {
                if (!sphere)
                {
                    Light = FWGE.Game.Light.Point(
                    {
                        Name:               "Point",
                        Colour:             FWGE.Render.Colour(1.0, 1.0, 1.0, 1.0),
                        Intensity:          1,
                        Shininess:          255,
                        Radius:             15,
                        Angle:              180,
                        GameObject:         FWGE.Game.GameObject(
                        {
                            Transform:      FWGE.Game.Transform(
                            {
                                Position:   FWGE.Game.Maths.Vector3(0, 0, 0)
                            }),
                            Update:         function Update()
                            {
                                if (FWGE.Game.Input.MouseWheelUp)
                                    this.Light.Intensity += FWGE.Game.Time.Delta * 0.5;
                                if (FWGE.Game.Input.MouseWheelDown)
                                    this.Light.Intensity -= FWGE.Game.Time.Delta * 0.5;

                                this.Light.Intensity = FWGE.Game.Maths.constructor.Clamp(this.Light.Intensity, 0, 1);
                            }
                        })
                    });
                    /*FWGE.Game.Light.Ambient(
                    {
                        Name:               "Ambient",
                        Colour:             FWGE.Render.Colour(1.0, 1.0, 1.0, 1.0),
                        Intensity:          0.5,
                    });*/

                    console.log(Light);

                    sphere = Sphere.Make(Shaders.Texture);
                    sphere.Material.SetTextures(
                    {
                        ImageMap:       "earth.img.jpg",
                        BumpMap:        "earth.bump.jpg",
                        //SpecularMap:    "earth.spec2.jpg"
                    });
                    //sphere.Transform.Rotation.Z = 23;
                }
            }
        },

        Reset:
        {
            value: function Reset()
            {
                if (!!sphere && sphere.Destroy instanceof Function)
                    sphere.Destroy(0);
            }
        }
    });

    Projects["Sphere"] = function() { Sphere.Reset(); Sphere.Run(); };
})();
