import { Vector3 } from "@fwge/common"
import { Entity, UniqueComponent } from "@fwge/core"

export class Collider extends UniqueComponent
{
    constructor(
        public Position: Vector3,
        public IsTrigger: boolean,
        public Material: any,
        public OnCollisionEnter: (this: Entity, other: Entity) => void = () => void 0,
        public OnCollisionUpdate: (this: Entity, other: Entity) => void = () => void 0,
        public OnCollisionExit: (this: Entity, other: Entity) => void = () => void 0
    ) { super(Collider) }    
}
