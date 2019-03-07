/**
 * @name        OBJConverter
 * @module      FWGE.Render
 * @description Some description
 */

window.OBJConverter = (function()
{
    function OBJConverter()
    {
        Converter.call(this,
            function Parse(obj, mtl)
            {
                var object_name = obj.split(/(\/|\\)/).filter(function(string){if (string.indexOf('.obj') !== -1) return string;})[0].replace('.obj', '');
                var self = this;
                var OBJ = this.Read(obj).split('\n');
                var MTL = this.Read(mtl).split('\n');
                var Children = new Array();
                var Materials = {};
                var Meshes = {};

                var curr = -1;
                var name = '';
                MTL.forEach(function(item, index, array)
                {
                    if (item.indexOf('newmtl') !== -1)
                    {
                        if (curr !== -1)
                            Materials[name] = MTL.slice(curr, index).join('\n');

                        curr = index;
                        name = item.split(' ')[1].trim();
                    }

                    if (index === array.length - 1)
                        Materials[name] = MTL.slice(curr, array.length).join('\n');
                });

                curr = -1;
                OBJ.forEach(function(item, index, array)
                {
                    if (item.indexOf('o ') !== -1)
                    {
                        if (curr !== -1)
                            Meshes[name] = OBJ.slice(curr, index).join('\n');

                        curr = index;
                        name = item.split(' ')[1].trim();
                    }

                    if (index === array.length - 1)
                        Meshes[name] = OBJ.slice(curr, array.length).join('\n');
                });

                Object.keys(Materials).forEach(function(key, index, array) { Materials[key] = self.ParseRenderMaterial(Materials[key]); });
                Object.keys(Meshes).forEach(function(key, index, array)
                {
                    var mesh = self.ParseMesh(Meshes[key]);
                    var material = Meshes[key].split('\n').filter(function(item){if(item.indexOf('usemtl ')!==-1)return item;}).join('').replace('usemtl ', '');

                    Children.push(new GameObject(
                    {
                        name:       mesh.Name,
                        mesh:       mesh,
                        material:   Materials[material]
                    }));
                });

                var result = undefined;

                if (Children.length === 1)
                    return Children.pop();

                return new GameObject(
                {
                    name:       object_name,
                    children:   Children
                });
            },
            
            function ParseGameObject(ParseMesh, materials, meshes)
            {
                return new GameObject();
            },

            function ParseMesh(obj)
            {
                var lines = obj.split('\n');
                var vertices = [];
                var normals = [];
                var uvs = [];
                var request =
                {
                    position:   [],
                    normal:     [],
                    uv:         [],
                    colour:     [],
                    index:      [],
                    wireframe:  []
                };
                var face_offset = 0;
                var wireframe_offset = 0;
                
                for (var i = 0; i < lines.length; ++i)
                {
                    var line = lines[i];
                    var type = line.split(' ')[0];
                    var value = line.substring(type.length).trim();
                    var values = value.split(' ');


                    switch (type)
                    {
                        case 'o':
                            request.name = value;
                        break;
                        
                        case 'v':
                            vertices.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                        break;
                        
                        case 'vn':
                            normals.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                        break;
                        
                        case 'vt':
                            uvs.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                        break;

                        case 'f':
                            values.forEach(function(face, index, array)
                            {
                                var face_i = face.split('/').map(function(item)
                                { 
                                    var val = parseInt(item);
                                    
                                    if (!isNaN(val))
                                        return val - 1;

                                    return NaN;
                                });

                                if (!isNaN(face_i[0]))
                                    request.position = request.position.concat(vertices[face_i[0]]);
                                
                                if (!isNaN(face_i[1]))
                                    request.uv = request.uv.concat(uvs[face_i[1]]);
                                
                                if (!isNaN(face_i[2]))
                                    request.normal = request.normal.concat(normals[face_i[2]]);

                                if (index >= 2)
                                    request.index.push(face_offset, face_offset + index - 1, face_offset + index);
                            });
                            
                            for (var j = 0; j < values.length; ++j)
                            {
                                if (j === values.length - 1)
                                    request.wireframe.push(wireframe_offset + j, wireframe_offset);
                                else
                                    request.wireframe.push(wireframe_offset + j, wireframe_offset + j + 1);
                            }
                            wireframe_offset += values.length;
                            face_offset += values.length;
                        break;
                    }
                }

                return new Mesh(request);
            },
            
            function ParseRenderMaterial(mtl)
            {
                var lines = mtl.split('\n');
                var request = {};

                for (var i = 0; i < lines.length; ++i)
                {
                    var line = lines[i];
                    var type = line.split(' ')[0];
                    var value = line.substring(type.length).trim();
                    var values = value.split(' ');

                    switch (type)
                    {
                        case 'newmtl':
                            request.name = value;
                        break;

                        case 'Ns':
                            request.shininess = parseFloat(value);
                        break;

                        case 'Ka':
                            request.ambient = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                        break;

                        case 'Kd':
                            request.diffuse = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                        break;

                        case 'Ks':
                            request.specular = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                        break;
                        
                        case 'd':
                            request.alpha = parseFloat(value);
                        break;

                        case 'Tr':
                            request.alpha = 1 - parseFloat(value);
                        break;
                    }
                }

                return new RenderMaterial(request);
            }
        );

        Object.seal(this);
    }

    OBJConverter.prototype = Object.create(null);
    Object.seal(OBJConverter.prototype);

    return new OBJConverter();
})();
Object.seal(OBJConverter);