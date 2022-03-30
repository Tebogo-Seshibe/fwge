import { Vector2, Vector3 } from "@fwge/common"
import { Constructor } from "@fwge/core"
import { DynamicMesh, StaticMesh } from "../../components"
import { Colour4 } from "../colour"
import { IParser } from "./IParser"

type OBJKey = 'o' | 'v' | 'vn' | 'vt' | 'vp' | 'f'
interface OBJFace
{
    v: number
    vt: number
    vn: number
}
export class OBJParser implements IParser
{
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
