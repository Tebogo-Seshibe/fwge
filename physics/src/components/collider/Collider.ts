import { Vector3 } from "@fwge/common"
import { UniqueComponent } from "@fwge/core"

export class Collider extends UniqueComponent
{
    constructor(
        public Position: Vector3,
        public IsTrigger: boolean,
        public Material: any
    ) { super() }    
}
