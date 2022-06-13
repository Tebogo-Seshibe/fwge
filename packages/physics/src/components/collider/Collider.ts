import { Polygon3D, Vector3 } from "@fwge/common"
import { Entity, SharedComponent, Transform } from "@fwge/core"

export class Collider extends SharedComponent
{
    public findFurthest(transform: Transform, direction: Vector3): Vector3 { return Vector3.Zero }
    
    constructor(
        public Position: Vector3,
        public IsStatic: boolean,
        public IsTrigger: boolean,
        public Material: any,
        public OnCollisionEnter: <T extends Entity>(this: T, other: T) => void = () => void 0,
        public OnCollisionUpdate: <T extends Entity>(this: T, other: T) => void = () => void 0,
        public OnCollisionExit: <T extends Entity>(this: T, other: T) => void = () => void 0,
        public Polygon: Polygon3D
    ) { super(Collider) }    
}
