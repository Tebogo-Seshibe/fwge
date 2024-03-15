import { Matrix4, Polygon3D, Vector3 } from "@fwge/common"
import { Transform } from "@fwge/core"
import { Component, Entity } from "@fwge/ecs"

export class Collider extends Component
{    
    protected readonly Scale: Vector3 = Vector3.One

    public CalculatedVertices(transform: Transform): Vector3[]
    {
        const mv = Matrix4.Multiply(
            Matrix4.ScaleMatrix(this.Scale),
            Matrix4.TranslationMatrix(this.Position)
        ).Multiply(transform.GlobalModelViewMatrix())

        return this.Polygon.TransformedVertices(mv)
    }


    static FindFurthest(vertices: Vector3[], direction: Vector3): Vector3
    {
        let maxPoint!: Vector3
        let maxDot: number = Number.NEGATIVE_INFINITY

        for (const currPoint of vertices)
        {
            const currDot: number = currPoint.Dot(direction)

            if (currDot > maxDot)
            {
                maxPoint = currPoint
                maxDot = currDot
            }
        }

        return maxPoint
    }

    public FindFurthest(transform: Transform, direction: Vector3): Vector3
    {
        const points = this.CalculatedVertices(transform)
        return Collider.FindFurthest(points, direction)
    }

    constructor(
        public readonly Position: Vector3,
        public IsStatic: boolean,
        public IsTrigger: boolean,
        public Material: any,
        public OnCollisionEnter: <T extends Entity>(this: T, other: T) => void = () => void 0,
        public OnCollisionUpdate: <T extends Entity>(this: T, other: T) => void = () => void 0,
        public OnCollisionExit: <T extends Entity>(this: T, other: T) => void = () => void 0,
        public Polygon: Polygon3D
    ) { super(Collider) }    
}
