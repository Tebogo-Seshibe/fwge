import Colour4 from '../../Colour4'
import Converter from './Converter'
import GameObject from '../../GameObject'
import List from '../List'
import Mesh, { IMesh } from '../../Render Engine/Mesh'
import RenderMaterial, { IRenderMaterial } from '../../Render Engine/RenderMaterial'
import Vector2 from '../../Maths/Vector2'
import Vector3 from '../../Maths/Vector3'
import Vector4 from '../../Maths/Vector4'

export default class OBJConverter implements Converter
{
    static Parse(obj: string, mtl: string): GameObject
    {
        return new GameObject(
        {
            mesh: OBJConverter.ParseMesh(obj),
            material: OBJConverter.ParseRenderMaterial(mtl)
        })
    }    

    static ParseMesh(obj: string): Mesh
    {
        let lines: string[] = obj.split('\n')
        
        let vertices: List<Vector3>
        let normals: List<Vector3>
        let uvs: List<Vector2>

        let face_offset: number = 0
        let wireframe_offset: number = 0

        let { name, position, normal, uv, colour, index, wireframe }: IMesh = new IMesh

        position = new List<Vector3>()
        normal = new List<Vector3>()
        uv = new List<Vector2>()
        colour = new List<Vector4>()
        index = new List<number>()
        wireframe = new List<number>()
        
        for (var i = 0; i < lines.length; ++i)
        {
            let line: string = lines[i]
            let type: string = line.split(' ')[0]
            let value: string = line.substring(type.length).trim()
            let values: string[] = value.split(' ')

            switch (type)
            {
                case 'o':
                    name = value
                break
                
                case 'v':
                    vertices.Add(new Vector3(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])))
                break
                
                case 'vn':
                    normals.Add(new Vector3(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])))
                break
                
                case 'vt':
                    uvs.Add(new Vector2(parseFloat(values[0]), parseFloat(values[1])))
                break

                case 'f':
                    for (var i: number = 0; i < values.length; ++i)
                    {

                        let faces = values[i].split('/').map(val => parseInt(val) - 1)

                        if (!isNaN(faces[0]))
                        {
                            position.Add(vertices.Get(faces[0]))
                        }
                        
                        if (!isNaN(faces[1]))
                        {
                            uv.Add(uvs.Get(faces[1]))
                        }
                        
                        if (!isNaN(faces[2]))
                        {
                            normal.Add(normals.Get(faces[2]))
                        }

                        if (i >= 2)
                        {
                            index.AddMany(face_offset, face_offset + i - 1, face_offset + i)
                        }
                    }
                    
                    for (var i = 0; i < values.length; ++i)
                    {
                        if (i === values.length - 1)
                        {
                            wireframe.AddMany(wireframe_offset + i, wireframe_offset)
                        }
                        else
                        {
                            wireframe.AddMany(wireframe_offset + i, wireframe_offset + i + 1)
                        }
                    }

                    wireframe_offset += values.length
                    face_offset += values.length
                break
            }
        }

        return new Mesh({ name, position, normal, uv, colour, index, wireframe })
    }
            
    static ParseRenderMaterial(mtl: string): RenderMaterial
    {
        let lines: string[] = mtl.split('\n')
        let { name, shininess, ambient, diffuse, specular, alpha }: IRenderMaterial = new IRenderMaterial

        for (var i = 0; i < lines.length; ++i)
        {
            var line = lines[i]
            var type = line.split(' ')[0]
            var value = line.substring(type.length).trim()
            var values = value.split(' ')

            switch (type)
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
            }
        }

        return new RenderMaterial({ name, shininess, ambient, diffuse, specular, alpha })
    }
}