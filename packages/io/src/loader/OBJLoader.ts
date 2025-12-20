import { Colour4, Colour4Array, Vector2Array, Vector3Array } from "@fwge/common"
import { IMesh, Mesh, StaticMesh } from "@fwge/core"
import { ILoader, OBJFace, OBJKey, OBJObject } from "./ILoader"

export type OBJ = { [name: string]:  {  mesh: Mesh, material: string } }
export const OBJLoader: ILoader<OBJ> = (src: string) =>
{
    const objects: OBJ = {}

    const v: Vector3Array[] = []
    const vn: Vector3Array[] = []
    const vt: Vector2Array[] = []
    const vp: Vector3Array[] = []

    let o = ''
    let usemtl = ''
    // let i = 0
    let objObject: OBJObject
    let objectMap: Map<string, OBJObject> = new Map()
    let parsingVertexData = true;
    let addingFaces = false;
    let currentObject: string | undefined = undefined;
    
    const objLines = src.trim().split('\n').map(x => x.trim())
    for (let line of objLines)
    {
        const key = line.split(' ')[0].trim() as OBJKey
        const value = line.substring(key.length).trim()
        const values = value.split(' ').map(x => x.trim()).filter(x => x.length > 0)
        
        switch (key)
        {
            //#region Shared vertex data
            case 'o':
                o = value;
                break;

            case 'v':
                v.push(
                [
                    parseFloat(values[0]),
                    parseFloat(values[1]),
                    parseFloat(values[2])
                ])
                break;

            case 'vn':
                vn.push(
                [
                    parseFloat(values[0]),
                    parseFloat(values[1]),
                    parseFloat(values[2])
                ])
                break;
                
            case 'vp':
                vp.push(
                [
                    parseFloat(values[0]),
                    parseFloat(values[1]),
                    parseFloat(values[2])
                ])
                break;

            case 'vt':
                vt.push(
                [
                    parseFloat(values[0]),
                    parseFloat(values[1])
                ])
                break;
            //#endregion

            case 'usemtl':
                usemtl = value;
                currentObject = value;
                break


            // case 'g':
            //     if (objectMap.has(value))
            //     {
            //         o = value + '_' + i++
            //     }
            //     else
            //     {
            //         o = value
            //     }
            //     break

            case 'f':
                let name = usemtl ?? o;

                if (!currentObject) {
                    currentObject = o;
                }

                objObject = objectMap.get(name) ?? {}
                
                if (!objObject.faces)
                {
                    objObject.faces = []
                    
                }
                const face: OBJFace[] = []
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
                objectMap.set(name, objObject)
                break
        }
    }

    for (const [key, object] of objectMap.entries())
    {
        const f = object?.faces
        
        if (!f)
        {
            continue
        }

        const position: Vector3Array[] = []
        const colour: Colour4Array[] = []
        const normal: Vector3Array[] | undefined = []
        const uv: Vector2Array[] | undefined = []
        
        for (const face of f)
        {
            const view = new Float32Array(face.length * Colour4.SIZE);
            view.fill(1);

            for (const indices of face)
            {
                position.push(v[indices.v])
                colour.push([1,1,1,1]);
                
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
                material: key,
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