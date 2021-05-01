import Colour4 from '..//Colour/Colour4';
import GameObject from '../Object/GameObject';
import Material, { IMaterial } from '../Object/Material';
import Vector2 from '../Maths/Vector2';
import Vector3 from '../Maths/Vector3';
import Vector4 from '../Maths/Vector4';
import Mesh, { IMesh } from '../Object/Mesh';
import IConverter from './IConverter';


export default class OBJConverter implements IConverter
{
    public Parse(obj: string, mtl: string): GameObject
    {
        return new GameObject(
        {
            mesh: OBJConverter.ParseOBJ(obj),
            material: OBJConverter.ParseMTL(mtl)
        })
    }    

    public static ParseOBJ(obj: string): Mesh
    {
        let lines: string[] = obj.split('\n')
        
        let vertices: Array<Vector3> = []
        let normals: Array<Vector3> = []
        let uvs: Array<Vector2> = []

        let face_offset: number = 0
        let wireframe_offset: number = 0

        let {
            name,
            position,
            normal,
            uv,
            colour,
            index,
            wireframe
        }: IMesh = {
            position: new Array<Vector3>(),
            normal: new Array<Vector3>(),
            uv: new Array<Vector2>(),
            colour: new Array<Vector4>(),
            index: new Array<number>(),
            wireframe: new Array<number>()
        }

        for (let line of lines)
        {
            line = line.trim()
            let key: string = line.split(' ')[0]
            let value: string = line.substring(key.length).trim()
            let values: string[] = value.split(' ')

            switch (key)
            {
                case 'o':
                    name = value
                break
                
                case 'v':
                    vertices.push(new Vector3(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])))
                break
                
                case 'vn':
                    normals.push(new Vector3(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])))
                break
                
                case 'vt':
                    uvs.push(new Vector2(parseFloat(values[0]), parseFloat(values[1])))
                break

                case 'f':
                    for (var i: number = 0; i < values.length; ++i)
                    {
                        let faces = values[i].split('/').map(val => parseInt(val) - 1)

                        if (!isNaN(faces[0]))
                        {
                            position.push(vertices[faces[0]])
                        }
                        
                        if (!isNaN(faces[1]))
                        {
                            uv.push(uvs[faces[1]])
                        }
                        
                        if (!isNaN(faces[2]))
                        {
                            normal.push(normals[faces[2]])
                        }

                        if (i >= 2)
                        {
                            index.push(face_offset, face_offset + i - 1, face_offset + i)
                        }
                    }
                    
                    for (var i = 0; i < values.length; ++i)
                    {
                        if (i === values.length - 1)
                        {
                            wireframe.concat(wireframe_offset + i, wireframe_offset)
                        }
                        else
                        {
                            wireframe.concat(wireframe_offset + i, wireframe_offset + i + 1)
                        }
                    }

                    wireframe_offset += values.length
                    face_offset += values.length
                break
            }
        }

        return new Mesh({ name, position, normal, uv, colour, index, wireframe })
    }
            
    public static ParseMTL(mtl: string): Material
    {
        let lines: string[] = mtl.split('\n')
        let {
            name, shininess, ambient, diffuse, specular, alpha, imagemap
        }: IMaterial = new IMaterial

        for (let line of lines)
        {
            line = line.trim()
            var key = line.split(' ')[0]
            var value = line.substring(key.length).trim()
            var values = value.split(' ')

            switch (key)
            {
                case 'newmtl':
                    name = value
                break

                case 'Ns':
                    shininess = parseFloat(value)
                break

                case 'Ka':
                    ambient = new Colour4(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1)
                break

                case 'Kd':
                    diffuse = new Colour4(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1)
                break

                case 'Ks':
                    specular = new Colour4(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1)
                break
                
                case 'd':
                    alpha = parseFloat(value)
                break

                case 'Tr':
                    alpha = 1 - parseFloat(value)
                break

                case 'map_Kd':
                    imagemap = value
                break
            }
        }

        return new Material({ name, shininess, ambient, diffuse, specular, alpha, imagemap, shader: null })
    }
}