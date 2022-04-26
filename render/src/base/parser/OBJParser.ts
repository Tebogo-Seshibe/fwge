import { Vector2, Vector3 } from "@fwge/common"
import { Constructor, Prefab } from "@fwge/core"
import { DynamicMesh, Material, StaticMesh } from "../../components"
import { Colour4 } from "../colour"
import { IParser } from "./IParser"

type OBJKey = 'mtllib' | 'o' | 'g' | 'v' | 'vn' | 'vt' | 'vp' | 'f' | 'usemtl'
type MTLKey = 'newmtl' | 'ka' | 'kd' | 'ks' | 'ns' | 'd' | 'tr' | 'illum' | 'map_kd' | 'map_disp' | 'map_ka'
| 'map_bump'
| 'bump'
| 'map_ks'
| 'map_d'
export interface OBJ
{
    mesh: StaticMesh
    material: Material
}
interface OBJObject
{
    name?: string
    material?: string
    faces?: OBJFace[][]
}
interface OBJFace
{
    v: number
    vt: number
    vn: number
}
export class OBJParser implements IParser
{
    hmm(obj: string, mtl: string): OBJ[]
    {
        const prefabs: OBJ[] = []
        
        const mtlLines = mtl.trim().split('\n').map(x => x.trim())
        const matMap: Map<string, any> = new Map()
        let newmtl: string = ''
        for (let line of mtlLines)
        {
            const key = line.split(' ')[0].trim().toLowerCase() as MTLKey
            const value = line.substring(key.length).trim()
            const values = value.split(' ').map(x => x.trim()).filter(x => x.length > 0)
            
            switch (key)
            {
                case 'newmtl':
                    newmtl = value
                    matMap.set(newmtl, {})
                    break

                case 'ka':
                    matMap.get(newmtl)!.ambient = new Colour4(
                        parseFloat(values[0]),
                        parseFloat(values[1]),
                        parseFloat(values[2]),
                        1.0
                    )
                    break

                case 'kd':
                    matMap.get(newmtl)!.diffuse = new Colour4(
                        parseFloat(values[0]),
                        parseFloat(values[1]),
                        parseFloat(values[2]),
                        1.0
                    )
                    break

                case 'ks':
                    matMap.get(newmtl)!.specular = new Colour4(
                        parseFloat(values[0]),
                        parseFloat(values[1]),
                        parseFloat(values[2]),
                        1.0
                    )
                    break

                case 'ns':
                    matMap.get(newmtl)!.shininess = parseFloat(value)
                    break

                case 'd':
                    matMap.get(newmtl)!.alpha = parseFloat(value)
                    break

                case 'tr':
                    matMap.get(newmtl)!.alpha = 1.0 - parseFloat(value)
                    break

                case 'map_ka':
                    matMap.get(newmtl)!.imagemap = value
                    break

                case 'map_kd':
                case 'map_d':
                    matMap.get(newmtl)!.imagemap = value
                    break

                case 'map_ks':
                    matMap.get(newmtl)!.specularmap = value
                    break

                case 'map_bump':
                case 'bump':
                    matMap.get(newmtl)!.normalmap = values.last().trim()
                    break
            }
        }

        const objects: Map<string | undefined, OBJObject> = new Map()
        const v: Vector3[] = []
        const vn: Vector3[] = []
        const vt: Vector2[] = []
        const vp: Vector3[] = []

        const objLines = obj.trim().split('\n').map(x => x.trim())
        let o = ''
        let i = 0
        let objObject: OBJObject
        for (let line of objLines)
        {
            const key = line.split(' ')[0].trim() as OBJKey
            const value = line.substring(key.length).trim()
            const values = value.split(' ').map(x => x.trim()).filter(x => x.length > 0)

            switch (key)
            {
                case 'usemtl':
                    objObject = objects.get(o) ?? {}
                    objObject.material = value
                    objects.set(o, objObject)
                    break

                case 'o':
                    o = value
                    
                    objObject = objects.get(o) ?? {}
                    objObject.material = value
                    objects.set(o, objObject)
                    break

                case 'g':
                    if (objects.has(value))
                    {
                        o = value + '_' + i++
                    }
                    else
                    {
                        o = value
                    }
                    break

                case 'v':
                    v.push(
                        new Vector3(
                            parseFloat(values[0]),
                            parseFloat(values[1]),
                            parseFloat(values[2])
                        )
                    )
                    break

                case 'vn':
                    vn.push(
                        new Vector3(
                            parseFloat(values[0]),
                            parseFloat(values[1]),
                            parseFloat(values[2])
                        )
                    )
                    break

                case 'vp':
                    break

                case 'vt':
                    vt.push(
                        new Vector2(
                            parseFloat(values[0]),
                            1.0 - parseFloat(values[1])
                        )
                    )
                    break

                case 'f':
                    objObject = objects.get(o) ?? {}
                    if (!objObject.faces)
                    {
                        objObject.faces = []
                    }
                    const face = []
                    for (const indices of values)
                    {
                        const index = indices.split('/').map(x => x.trim())

                        face.push({
                            v: parseInt(index[0]) - 1,
                            vt: parseInt(index[1]) - 1,
                            vn: parseInt(index[2]) - 1,
                        })
                    }
                    objObject.faces.push(face)
                    break
            }
        }

        const keys = Array.from(objects.keys())
        for (const key of keys)
        {
            const object = objects.get(key)!
            const f = object.faces!

            const position: Vector3[] = []
            const colour: Colour4[] = []
            const normal: Vector3[] | undefined = []
            const uv: Vector2[] | undefined = []
            
            for (const face of f)
            {
                for (const indices of face)
                {
                    position.push(v[indices.v])
                    colour.push(new Colour4(1.0, 1.0, 1.0, 1.0))
                    
                    if (indices.vn !== undefined && !Number.isNaN(indices.vn))
                    {
                        normal.push(vn[indices.vn])
                    }
                    
                    if (indices.vt !== undefined && !Number.isNaN(indices.vt))
                    {
                        uv.push(vt[indices.vt])
                    }
                }
            }

            if (v.length > 0)
            {
                const material = matMap.get(object.material!)!
                
                prefabs.push(
                {
                    mesh: new StaticMesh(
                    {
                        position: position,
                        colour: colour,
                        normal: normal.length !== 0 ? normal : undefined,
                        uv: uv.length !== 0 ? uv : undefined
                    }),
                    material: new Material(material)
                })
            }
        }

        return prefabs
    }


    read(source: string, type?: Constructor<StaticMesh, any>): StaticMesh
    read(source: string, type: Constructor<DynamicMesh, any>): DynamicMesh
    read(source: string, type: Constructor<StaticMesh, any> | Constructor<DynamicMesh, any> = StaticMesh): DynamicMesh | StaticMesh
    {
        const lines = source.trim().split('\n')
        const v: Vector3[] = []
        const vn: Vector3[] = []
        const vt: Vector2[] = []
        const vp: Vector3[] = []
        const f: OBJFace[][] = []

        for (let line of lines)
        {
            line = line.trim()

            const key = line.split(' ')[0].trim().toLowerCase() as OBJKey
            const value = line.substring(key.length).trim()
            const values = value.split(' ').map(x => x.trim()).filter(x => x.length > 0)

            switch (key)
            {
                case 'o':
                    break

                case 'v':
                    v.push(
                        new Vector3(
                            parseFloat(values[0]),
                            parseFloat(values[1]),
                            parseFloat(values[2])
                        )
                    )
                    break

                case 'vn':
                    vn.push(
                        new Vector3(
                            parseFloat(values[0]),
                            parseFloat(values[1]),
                            parseFloat(values[2])
                        )
                    )
                    break

                case 'vp':
                    break

                case 'vt':
                    vt.push(
                        new Vector2(
                            parseFloat(values[0]),
                            1.0 - parseFloat(values[1])
                        )
                    )
                    break

                case 'f':
                    const face = []
                    for (const indices of values)
                    {
                        const index = indices.split('/').map(x => x.trim())

                        face.push({
                            v: parseInt(index[0]) - 1,
                            vt: parseInt(index[1]) - 1,
                            vn: parseInt(index[2]) - 1,
                        })
                    }
                    f.push(face)
                    break
            }
        }

        const position: Vector3[] = []
        const colour: Colour4[] = []
        const normal: Vector3[] | undefined = []
        const uv: Vector2[] | undefined = []
        
        for (const face of f)
        {
            const col = new Colour4(Math.random(), Math.random(), Math.random(), 1.0)
            for (const indices of face)
            {
                position.push(v[indices.v])
                colour.push(new Colour4(1.0, 1.0, 1.0, 1.0))
                
                if (indices.vn !== undefined && !Number.isNaN(indices.vn))
                {
                    normal.push(vn[indices.vn])
                }
                
                if (indices.vt !== undefined && !Number.isNaN(indices.vt))
                {
                    uv.push(vt[indices.vt])
                }
            }
        }

        return new type(
        {
            position: position,
            colour: colour,
            normal: normal.length !== 0 ? normal : undefined,
            uv: uv.length !== 0 ? uv : undefined
        })
    }

    write(mesh: StaticMesh): void {
        throw new Error("Method not implemented.")
    }
}
