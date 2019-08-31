import GameObject from '../../GameObject';
import Vector2 from '../../Maths/Vector2';
import Vector3 from '../../Maths/Vector3';
import Vector4 from '../../Maths/Vector4';
import Colour4 from '../../Render/Colour4';
import Mesh, { IMesh } from '../../Render/Mesh';
import RenderMaterial, { IRenderMaterial } from '../../Render/RenderMaterial';
import Converter from './Converter';


export default class OBJConverter implements Converter
{
    public static Parse(obj: string, mtl: string): GameObject
    {
        return new GameObject(
        {
            mesh: OBJConverter.ParseMesh(obj),
            material: OBJConverter.ParseRenderMaterial(mtl)
        })
    }    

    public static ParseMesh(obj: string): Mesh
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
            
    public static ParseRenderMaterial(mtl: string): RenderMaterial
    {
        let lines: string[] = mtl.split('\n')
        let {
            name, shininess, ambient, diffuse, specular, alpha, imagemap
        }: IRenderMaterial = new IRenderMaterial

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

        return new RenderMaterial({ name, shininess, ambient, diffuse, specular, alpha, imagemap })
    }
}