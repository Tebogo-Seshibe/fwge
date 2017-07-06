var Sphere = !!Sphere ? Sphere : Object.create(null);

(function()
{
var moonVertexPositionBuffer;
var moonVertexNormalBuffer;
var moonVertexTextureCoordBuffer;
var moonVertexIndexBuffer;

var latitudeBands = 30;
var longitudeBands = 30;
var radius = 1;

var vertexPositionData = [];
var normalData = [];
var textureCoordData = [];
for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
    var theta = latNumber * Math.PI / latitudeBands;
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);

    for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
    var phi = longNumber * 2 * Math.PI / longitudeBands;
    var sinPhi = Math.sin(phi);
    var cosPhi = Math.cos(phi);

    var x = cosPhi * sinTheta;
    var y = cosTheta;
    var z = sinPhi * sinTheta;
    var u = 1 - (longNumber / longitudeBands);
    var v = 1 - (latNumber / latitudeBands);

    normalData.push(x);
    normalData.push(y);
    normalData.push(z);
    textureCoordData.push(u);
    textureCoordData.push(v);
    vertexPositionData.push(radius * x);
    vertexPositionData.push(radius * y);
    vertexPositionData.push(radius * z);
    }
}
var indexData = [];
for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
    for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
    var first = (latNumber * (longitudeBands + 1)) + longNumber;
    var second = first + longitudeBands + 1;
    indexData.push(first);
    indexData.push(second);
    indexData.push(first + 1);

    indexData.push(second);
    indexData.push(second + 1);
    indexData.push(first + 1);
    }
}

    Object.defineProperties(Sphere,
    {
        Mesh:
        {
            value: FWGE.Render.Mesh(
            {
                Position:   vertexPositionData,
                Normals:    normalData,
                UVs:        textureCoordData,
                Indices:    indexData,
            })
        },

        Material:
        {
            value: FWGE.Render.RenderMaterial(
            {
                Ambient:    FWGE.Render.Colour(0.50, 0.50, 0.50, 1.00),
                Diffuse:    FWGE.Render.Colour(0.75, 0.75, 0.75, 1.00),
                Specular:   FWGE.Render.Colour(1.00, 1.00, 1.00, 1.00),
                Alpha:      1.0,
                Shininess:  0
            })
        },  
        Make:
        {
            value: function Make(shader)
            {
                if (!Sphere.Material.Shader)
                    Sphere.Material.Shader = shader;

                return FWGE.Game.GameObject(
                {
                    Name:       "Sphere",
                    Mesh:       Sphere.Mesh,
                    Material:   Sphere.Material,
                    Transform:  FWGE.Game.Transform(
                    { 
                        Position: FWGE.Game.Maths.Vector3(0, 0, -2),
                        Rotation: FWGE.Game.Maths.Vector3(-23.7, 0, 0),
                    }),
                    Update:     function Update()
                    {
                        /*if (FWGE.Game.Input.MouseLeftDown)
                        {
                            this.Transform.Rotation.Y -= FWGE.Game.Input.MouseDeltaX;
                            this.Transform.Rotation.X -= FWGE.Game.Input.MouseDeltaY;
                        }

                        if (FWGE.Game.Input.MouseWheelDown)
                            this.Transform.Position.Z += FWGE.Game.Time.Delta * 0.5;
                        if (FWGE.Game.Input.MouseWheelUp)
                            this.Transform.Position.Z -= FWGE.Game.Time.Delta * 0.5;

                        this.Transform.Rotation.X = FWGE.Game.Maths.constructor.Clamp(this.Transform.Rotation.X, -90, 90);*/


                        this.Transform.Rotation.Y -= FWGE.Game.Time.Delta;
                    }
                });
            }
        }
    });
})();