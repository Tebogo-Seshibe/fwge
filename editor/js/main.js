var Inputs = undefined;
var Project;
var Sidebar;
var Cube;

var send = (function()
{    
    function FWGERequest(type = "EMPTY", options = undefined)
    {
        this.type   = type;
        this.option = options;
    }

    function Send(request = new FWGERequest(), callback = new Function())
    { 
        var _XML = new XMLHttpRequest();

        _XML.onreadystatechange = function onreadystatechange(e)
        {
            if (_XML.readyState === _XML.DONE && (_XML.status === 0 || _XML.status === 200))
                callback(JSON.parse(_XML.responseText));
        };

        _XML.open("POST", "/", true);
        _XML.setRequestHeader("Content-type", "application/json");
        _XML.send(JSON.stringify(request));
    }

    return Send;
})();

window.onload = function(e)
{
    Sidebar = document.getElementById('project');
    FWGE.Init(
    {
        Canvas: document.getElementById("canvas"),
        Clear:  [0.0, 0.0, 0.0, 0.0]
    });
    FWGE.Start();

    load_project();
    edit_list_hover();
};

function load_project()
{
    send({type: 'PROJECT', option: 'Cube'}, function(e)
    {
        parse_project(e.data);
        populate_sidebar();
        edit_list_hover();
    });
}

function parse_project(project)
{
    Meshes      = {};
    Materials   = {};
    Shaders     = {};
    Scenes      = {};

    project.Resources.Shaders.forEach(function(shader)
    {
        Shaders[shader.Name] = FWGE.Render.Shader(shader);
    });
    project.Resources.Materials.forEach(function(material)
    {
        material.Shader = Shaders[material.Shader];
        Materials[material.Name] = FWGE.Render.RenderMaterial(material);
    });
    project.Resources.Meshes.forEach(function(mesh)
    {
        console.log(mesh);
        Meshes[mesh.Name] = FWGE.Render.Mesh(mesh);
    });

    project.Scenes.forEach(function(scene)
    {
        Objects = {};
        Lights  = { Ambient: undefined, Directional: new Array(3), Point: new Array(8) };
        Sounds  = {};

        scene.Objects.forEach(function(object)
        {
            console.log(object);
            object.Material = Materials[object.Material];
            object.Mesh = Meshes[object.Mesh];
            if (object.Update)
                object.Update = new Function(object.Update);

            object = FWGE.Game.GameObject(object);

            Objects[object.Name] = object;
        });
    
        Lights.Ambient = FWGE.Game.Light.Ambient(scene.Lights.Ambient);

        Lights.Directional = scene.Lights.Directional.map(function(directional)
        {
            return FWGE.Game.Light.Directional(directional);
        });

        Lights.Point = scene.Lights.Point.map(function(point)
        {
            point.GameObject = Objects[point.GameObject];
            return FWGE.Game.Light.Point(point);
        });

        Cube = Objects.Cube;
        Scenes[scene.Name] = { Objects: Objects, Lights: Lights, Sounds: Sounds };

        Project = Scenes;
    });
}

function populate_sidebar()
{
    while (Sidebar.children.length > 1)
        Sidebar.removeChild(Sidebar.lastChild);
    
    var scenes = document.createElement('ul');
    scenes.id = "scenes";

    Sidebar.appendChild(scenes);

    add_scenes(scenes, Project);
}

function add_scenes(parent, scenes)
{
    var keys = Object.keys(scenes);
    keys.forEach(function(item)
    {
        var scene = document.createElement('li');
        scene.className = 'scene';

        var list = document.createElement('ul');
        list.className = 'things open';

        var a = document.createElement('a');
        a.appendChild(document.createTextNode(item));

        scene.appendChild(a);
        scene.appendChild(list);
        parent.appendChild(scene);

        add_scene(list, scenes[item]);
    });
}

function add_scene(parent, scene)
{
    var object_list = document.createElement('ul');
    object_list.className = 'object-list';
    var a_objects = document.createElement('a');
    a_objects.appendChild(document.createTextNode('Objects'));
    var objects = document.createElement('li');
    objects.className = "objects";
    objects.appendChild(a_objects);
    objects.appendChild(object_list);

    var light_list = document.createElement('ul');
    light_list.className = 'light-list';
    var a_lights = document.createElement('a');
    a_lights.appendChild(document.createTextNode('Lights'));
    var lights = document.createElement('li');
    lights.className = "lights";
    lights.appendChild(a_lights);
    lights.appendChild(light_list);

    var sound_list = document.createElement('ul');
    sound_list.className = 'sound-list';
    var a_sounds = document.createElement('a');
    a_sounds.appendChild(document.createTextNode('Sounds'));
    var sounds = document.createElement('li');
    sounds.className = "sounds";
    sounds.appendChild(a_sounds);
    sounds.appendChild(sound_list);

    add_objects(object_list, scene.Objects);
    add_lights(light_list, scene.Lights);
    add_sounds(sound_list, scene.Sounds);

    parent.appendChild(objects);
    parent.appendChild(lights);
    parent.appendChild(sounds);
}

function add_objects(parent, objects)
{
    var keys = Object.keys(objects);
    keys.forEach(function(item)
    {
        var object = document.createElement('li');
        object.className = "object";
        
        var img = document.createElement('img');
        img.src = 'icons/cube icon.png';

        var a = document.createElement('a');
        a.appendChild(document.createTextNode(objects[item].Name));

        object.appendChild(img);
        object.appendChild(a);
        parent.appendChild(object);
    });
}

function add_lights(parent, lights)
{
    if (!!lights.Ambient)
        add_light(parent, lights.Ambient);
    
    if (lights.Directional.length > 0)
        lights.Directional.forEach(function(item) { add_light(parent, item); });
    
    if (lights.Point.length > 0)
        lights.Point.forEach(function(item) { add_light(parent, item); });
}

function add_light(parent, light)
{ 
    console.log(light);
    
    var _light = document.createElement('li');
    _light.className = "light";
    var a = document.createElement('a');
    a.appendChild(document.createTextNode(light.Name));
    _light.appendChild(a);
    parent.appendChild(_light);
}

function add_sounds()
{
    // TODO
}

function edit_list_hover()
{
    [].slice.apply(document.getElementsByTagName('li')).forEach(function(list_parent)
    {
        var list_item = list_parent.children[0];        
        list_item.onclick = function onclick(e)
        {
            let _class = list_item.className.split(' ')[0];
            list_parent.className = list_parent.className.indexOf('closed') === -1 ? _class + " closed" : _class + " open";
            e.cancelBubble = true;
        };
    });
}

function temp(shader)
{
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
                Ambient:    [0.50, 0.50, 0.50, 1.00],
                Diffuse:    [0.75, 0.75, 0.75, 1.00],
                Specular:   [1.00, 1.00, 1.00, 1.00],
                Alpha:      1.0,
                Shininess:  32
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
                        Position: [0, 0, -2]
                    }),
                    Update:     function Update()
                    {
                        if (FWGE.Game.Input.MouseLeftDown)
                        {
                            this.Transform.Rotation.Y -= FWGE.Game.Input.MouseDeltaX;
                            this.Transform.Rotation.X -= FWGE.Game.Input.MouseDeltaY;
                        }

                        if (FWGE.Game.Input.MouseWheelDown)
                            this.Transform.Position.Z += FWGE.Game.Time.Delta * 0.5;
                        if (FWGE.Game.Input.MouseWheelUp)
                            this.Transform.Position.Z -= FWGE.Game.Time.Delta * 0.5;

                        this.Transform.Rotation.X = FWGE.Game.Maths.constructor.Clamp(this.Transform.Rotation.X, -90, 90);
                    }
                });
            }
        }
    });
})();
sphere = Sphere.Make(shader);

console.log(sphere);
}