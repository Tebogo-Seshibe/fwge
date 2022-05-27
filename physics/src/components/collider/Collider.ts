import { Vector3 } from "@fwge/common"
import { Entity, SharedComponent, Transform } from "@fwge/core"

export class Collider extends SharedComponent
{
    public findFurthest(transform: Transform, direction: Vector3): Vector3 { return Vector3.ZERO }
    
    constructor(
        public Position: Vector3,
        public IsStatic: boolean,
        public IsTrigger: boolean,
        public Material: any,
        public OnCollisionEnter: (this: Entity, other: Entity) => void = () => void 0,
        public OnCollisionUpdate: (this: Entity, other: Entity) => void = () => void 0,
        public OnCollisionExit: (this: Entity, other: Entity) => void = () => void 0
    ) { super(Collider) }    
}
