import Converter from './Converter'
import Vector2 from '../../Maths/Vector2'
import Vector3 from '../../Maths/Vector3'

type ObjKeyword = 'mtllib' | 'g' | 'o' | 'v' | 'vn' | 'vt' | 'usemtl' | 'f' | '#'

class IObjMesh
{
    v: Array<Vector3> = []
    vn: Array<Vector3> = []
    vt: Array<Vector2> = []
    usemtl: string
    f: Array<Array<number>> = []
}

class IObjectMesh extends IObjMesh
{
    o: string
}

class IGroupMesh extends IObjMesh
{
    g: string
}

class IObj
{
    mtllib: string
    g: IGroupMesh
    o: IObjectMesh
}


export default class OBJConverter implements Converter
{
    static Parse(obj: string, mtl: string): void //GameObject
    {
        OBJConverter.ParseObj(obj)
        /*
        return new GameObject(
        {
            mesh: OBJConverter.ParseMesh(obj),
            material: OBJConverter.ParseRenderMaterial(mtl)
        })*/
    }    

    /*static ParseMesh(obj: string): Mesh
    {
        let lines: string[] = obj.split('\n')
        
        let vertices: Array<Vector3> = []
        let normals: Array<Vector3> = []
        let uvs: Array<Vector2> = []

        let face_offset: number = 0
        let wireframe_offset: number = 0

        let {
            name, position, normal, uv, colour, index, wireframe
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
            
    static ParseRenderMaterial(mtl: string): RenderMaterial
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
    }*/

    //#region obj state machine
    private static ObjNext(text: string, start: number): [ number, ObjKeyword  ]
    {        
        debugger

        let index: number = 0
        let kind: ObjKeyword = undefined
        let curr: string
        
        while (start !== -1 && !kind)
        {
            text = text.substring(start)
            start = text.search(/\w+/)
            curr = text.substring(start, text.search(/\s/))
            
            if (['mtllib', 'g', 'o', 'v', 'vn', 'vt', 'usemtl', 'f', '#'].includes(curr))
            {
                kind = <ObjKeyword>curr
                index = start +  curr.length
            }
        }

        console.table([ index, kind ])
        
        return [ index, kind ]
    }

    static ParseObj(input: string): void
    {
        console.log(OBJConverter.obj(input))
    }
    
    private static obj(input: string): IObj
    {
        let result: IObj = new IObj
        let index: number = 0
        let kind: ObjKeyword

        do
        {
            
            [ index, kind ] = OBJConverter.ObjNext(input, index)

            switch (kind)
            {
                case 'mtllib':
                    [ index, result.mtllib ] = OBJConverter.mtllib(input, index)
                break

                case 'g':
                    [ index, result.g ] = OBJConverter.g(input, index)
                break

                case 'o':
                    [ index, result.o ] = OBJConverter.o(input, index)
                break
            }
        }
        while (index !== -1)

        return result
    }

    private static mtllib(input: string, index: number): [ number, string ]
    {
        let mtllib: string = ''

        for (let char: string = ''; char !== '\n' && (index + 1) < input.length; char = input[++index])
        {
            mtllib += char
        }

        return [ index, mtllib.trim() ]
    }

    private static g(input: string, index: number): [ number, IGroupMesh ]
    {
        return null
    }

    private static o(input: string, index: number): [ number, IObjectMesh ]
    {
        let result: IObjectMesh = new IObjectMesh
        let kind: ObjKeyword

        let o: string = ''
        let v: Vector3
        let vn: Vector3
        let vt: Vector2
        let usemtl: string
        let f: Array<number>

        for (let char: string = ''; char !== '\n'; char = input[++index])
        {
            o += char
        }
        result.o = o.trim()

        do
        {
            [ index, kind ] = OBJConverter.ObjNext(input, index)

            switch (kind)
            {
                case 'v':
                    [ index, v ] = OBJConverter.v(input, index)
                    result.v.push(v)
                break

                case 'vn':
                    [ index, vn ] = OBJConverter.vn(input, index)
                    result.vn.push(vn)
                break

                case 'vt':
                    [ index, vt ] = OBJConverter.vt(input, index)
                    result.vt.push(vt)
                break

                case 'usemtl':
                    [ index, usemtl ] = OBJConverter.usemtl(input, index)
                break

                case 'f':
                    [ index, f ] = OBJConverter.f(input, index)
                    result.f.push(f)
                break
            }
        }
        while (index !== -1)

        if (usemtl)
        {
            result.usemtl = usemtl.trim()
        }
        
        return [ index, result ]
    }

    private static v(input: string, index: number): [ number, Vector3 ]
    {
        let v: string = ''
 
        for (let float: string = ''; float !== '\n' && (index + 1) < input.length; float = input[++index])
        {
            v += float
        }

        return [ index, new Vector3(v.split('\s+').map(val => +(val.trim()))) ]
    }

    private static vn(input: string, index: number): [ number, Vector3 ]
    {
        let vn: string = ''

        for (let float: string = ''; float !== '\n' && (index + 1) < input.length; float = input[++index])
        {
            vn += float
        }

        return [ index, new Vector3(vn.split('\s+').map(val => +(val.trim()))) ]
    }

    private static vt(input: string, index: number): [ number, Vector2 ]
    {
        let vt: string = ''

        for (let float: string = ''; float !== '\n' && (index + 1) < input.length; float = input[++index])
        {
            vt += float
        }

        return [ index, new Vector2(vt.split('\s+').map(val => +(val.trim()))) ]
    }

    private static usemtl(input: string, index: number): [ number, string ]
    {
        let usemtl: string = ''

        for (let char: string = ''; char !== '\n' && (index + 1) < input.length; char = input[++index])
        {
            usemtl += char
        }

        return [ index, usemtl.trim() ]
    }

    private static f(input: string, index: number): [ number, Array<number> ]
    {
        let f: string = ''

        for (let float: string = ''; float !== '\n' && (index + 1) < input.length; float = input[++index])
        {
            f += float
        }

        return [ index, f.split('\s+').map(val => +(val.trim())) ]
    }
    //#endregion
}