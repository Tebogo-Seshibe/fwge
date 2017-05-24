import { Converter } from '../../Interfaces/Converter';
import { GameObject } from "../../Game Engine/GameObject";
import { Mesh, IMesh } from "../Mesh";
import { RenderMaterial, IRenderMaterial } from "../RenderMaterial";
import { Colour } from "../Colour";

export class OBJConverter extends Converter
{
    public Parse(obj: string, mtl: string): GameObject
    {
        var object_name = obj.split(/(\/|\\)/).filter(function(string){if (string.indexOf('.obj') !== -1) return string;})[0].replace('.obj', '');
        var self: OBJConverter = this;
        var OBJ: Array<string> = this.Read(obj).split('\n');
        var MTL: Array<string> = this.Read(mtl).split('\n');
        var Children: Array<GameObject> = new Array<GameObject>();
        var Materials: any = {};
        var Meshes: any = {};

        var curr: number = -1;
        var name: string = "";
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

        Object.keys(Materials).forEach(function(key, index, array) { Materials[key] = self.RenderMaterial(Materials[key]); });
        Object.keys(Meshes).forEach(function(key, index, array)
        {
            var mesh = self.Mesh(Meshes[key]);
            var material = Meshes[key].split('\n').filter(function(item){if(item.indexOf('usemtl ')!==-1)return item;}).join('').replace('usemtl ', '');

            Children.push(new GameObject(
            {
                Name: mesh.Name,
                Mesh: mesh,
                Material: Materials[material]
            }));
        });

        if (Children.length === 1)
            return Children.pop();

        return new GameObject(
        {
            Name: object_name,
            Children: Children
        });
    }
    
    protected GameObject(mesh: Mesh, materials: Array<RenderMaterial>, meshes: string[]): GameObject
    {
        return new GameObject();
    }

    protected Mesh(obj: string): Mesh
    {
        var lines = obj.split('\n');
        var vertices = [];
        var normals = [];
        var uvs = [];
        var request: IMesh = new IMesh();
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
                case "o":
                    request.Name = value;
                break;
                
                case "v":
                    vertices.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                break;
                
                case "vn":
                    normals.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                break;
                
                case "vt":
                    uvs.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                break;

                case "f":
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
                            request.Position = request.Position.concat(vertices[face_i[0]]);
                        
                        if (!isNaN(face_i[1]))
                            request.UVs = request.UVs.concat(uvs[face_i[1]]);
                        
                        if (!isNaN(face_i[2]))
                            request.Normals = request.Normals.concat(normals[face_i[2]]);

                        if (index >= 2)
                            request.Indices.push(face_offset, face_offset + index - 1, face_offset + index);
                    });
                    
                    for (var j = 0; j < values.length; ++j)
                    {
                        if (j === values.length - 1)
                            request.Wireframe.push(wireframe_offset + j, wireframe_offset);
                        else
                            request.Wireframe.push(wireframe_offset + j, wireframe_offset + j + 1);
                    }
                    wireframe_offset += values.length;
                    face_offset += values.length;
                break;
            }
        }

        return new Mesh(request);
    }
    
    protected RenderMaterial(mtl: string): RenderMaterial
    {
        var lines = mtl.split('\n');
        var request: IRenderMaterial = new IRenderMaterial();

        for (var i = 0; i < lines.length; ++i)
        {
            var line = lines[i];
            var type = line.split(' ')[0];
            var value = line.substring(type.length).trim();
            var values = value.split(' ');

            switch (type)
            {
                case 'newmtl':
                    request.Name = value;
                break;

                case 'Ns':
                    request.Shininess = parseFloat(value);
                break;

                case 'Ka':
                    request.Ambient = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                break;

                case 'Kd':
                    request.Diffuse = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                break;

                case 'Ks':
                    request.Specular = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                break;
                
                case 'd':
                    request.Alpha = parseFloat(value);
                break;

                case 'Tr':
                    request.Alpha = 1 - parseFloat(value);
                break;
            }
        }

        return new RenderMaterial(request);
    }
}
