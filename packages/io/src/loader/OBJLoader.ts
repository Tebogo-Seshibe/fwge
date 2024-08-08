import { Colour4, Vector2, Vector3 } from "@fwge/common"
import { Game, StaticMesh } from "@fwge/core"
import { ILoader, OBJKey, OBJObject } from "./ILoader"

export type OBJ = { [name: string]:  {  mesh: StaticMesh, material: string } }
export const OBJLoader: ILoader<OBJ> = (game: Game, src: string) =>
{
    const objects: OBJ = {}
    const objectMap: Map<string | undefined, OBJObject> = new Map()
    const v: Vector3[] = []
    const vn: Vector3[] = []
    const vt: Vector2[] = []
    const vp: Vector3[] = []

    const objLines = src.trim().split('\n').map(x => x.trim())
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
                objObject = objectMap.get(o) ?? {}
                objObject.material = value
                objectMap.set(o, { ...objObject })
                break

            case 'o':
                o = value
                
                objObject = objectMap.get(o) ?? {}
                objObject.name = value
                objectMap.set(o, { ...objObject })
                break

            case 'g':
                if (objectMap.has(value))
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
                        parseFloat(values[1])
                    )
                )
                break

            case 'f':
                objObject = objectMap.get(o) ?? {}
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

    const keys = Array.from(objectMap.keys())
    for (const key of keys)
    {
        const object = objectMap.get(key)
        const f = object?.faces
        
        if (!f)
        {
            continue
        }

        const position: Vector3[] = []
        const colour: Colour4[] = []
        const normal: Vector3[] | undefined = []
        const uv: Vector2[] | undefined = []
        
        for (const face of f)
        {
            let offset = 0;
            const view = new Float32Array(face.length * Colour4.SIZE);
            view.fill(1);

            for (const indices of face)
            {
                position.push(v[indices.v])
                colour.push(new Colour4(view.buffer, offset * Float32Array.BYTES_PER_ELEMENT));
                
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
            objects[key!] =
            {
                material: object.material!,
                mesh: new StaticMesh(
                {
                    position: position,
                    colour: colour,
                    normal: normal.length !== 0 ? normal : undefined,
                    uv: uv.length !== 0 ? uv : undefined
                })
            }
        }
    }

    return objects
}