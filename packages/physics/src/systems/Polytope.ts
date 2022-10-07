import { Vector3, Vector4 } from "@fwge/common"

export class Polytope extends Array<Vector3>
{
    getFaceNormal(faces: number[]): [Vector4[], number]
    {
        const normals: Vector4[] = []
        let minTriangle: number = 0
        let minDot: number = Number.MAX_VALUE

        for (let i = 0; i < faces.length; i +=3)
        {
            const A = this[faces[i + 0]]
            const B = this[faces[i + 1]]
            const C = this[faces[i + 2]]
            
            const AB = Vector3.Subtract(B, A)
            const AC = Vector3.Subtract(C, A)

            const normal = Vector3.Cross(AB, AC).Normalize()
            let dot = normal.Dot(A)

            if (dot < 0)
            {
                normal.Scale(-1)
                dot *= -1
            }

            normals.push(new Vector4(normal[0], normal[1], normal[2], dot))

            if (dot < minDot)
            {
                minTriangle = i / 3
                minDot = dot
            }
        }

        return [normals, minTriangle]
    }
}
