import { Vector3 } from "@fwge/common"
import { sameDirection } from "./utils"

export class Simplex3D extends Array<Vector3>
{
    public handleSimplex(direction: Vector3): boolean
    {
        switch (this.length)
        {
            case 2: return this.lineCase(direction)
            case 3: return this.triangleCase(direction)
            case 4: return this.tetrahedronCase(direction)
        }

        return false
    }

    private reset(...values: Vector3[])
    {
        while (this.length > values.length)
        {
            this.pop()
        }

        for (let i = 0; i < values.length; ++i)
        {
            this[i] = values[i]
        }
    }

    private lineCase(direction: Vector3): boolean
    {
        const [B, A] = this

        const AB = Vector3.Subtract(B, A)
        const AO = A.Clone().Scale(-1)

        if (sameDirection(AB, AO))
        {
            direction.Set(AB).Cross(AO).Cross(AB)
        }
        else
        {
            this.reset(A)
            direction.Set(AO)
        }

        return false
    }

    private triangleCase(direction: Vector3): boolean
    {
        const [C, B, A] = this

        const AB = Vector3.Subtract(B, A).Normalize()
        const AC = Vector3.Subtract(C, A).Normalize()
        const AO = A.Clone().Scale(-1).Normalize()

        const ABC = Vector3.Cross(AB, AC)
        
        if (sameDirection(Vector3.Cross(ABC, AC), AO))
        {
            if (sameDirection(AC, AO))
            {
                this.reset(C, A)
                direction.Set(AC).Cross(AO).Cross(AC)
            }
            else
            {
                this.reset(B, A)
                return this.lineCase(direction)
            }
        }
        else
        {
            if (sameDirection(Vector3.Cross(AB, ABC), AO))
            {
                this.reset(B, A)
                return this.lineCase(direction)
            }
            else
            {
                direction.Set(ABC)

                if (!sameDirection(ABC, AO))
                {
                    this.reset(B, C, A)
                    direction.Scale(-1)
                }
            }
        }
        
        return false
    }

    private tetrahedronCase(direction: Vector3): boolean
    {
        const [D, C, B, A] = this

        const AB = Vector3.Subtract(B, A)
        const AC = Vector3.Subtract(C, A)
        const AD = Vector3.Subtract(D, A)
        const AO = A.Clone().Scale(-1)

        const ABC = Vector3.Cross(AB, AC)
        const ACD = Vector3.Cross(AC, AD)
        const ADB = Vector3.Cross(AD, AB)

        if (sameDirection(ABC, AO))
        {
            this.reset(C, B, A)
            return this.triangleCase(direction)
        }
        
        if (sameDirection(ACD, AO))
        {
            this.reset(D, C, A)
            return this.triangleCase(direction)
        }

        if (sameDirection(ADB, AO))
        {
            this.reset(B, D, A)
            return this.triangleCase(direction)
        }

        return true
    }
}
