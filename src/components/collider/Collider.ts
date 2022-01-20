import { Vector3 } from "../../atoms"

export class Collider
{
    constructor(
        public Position: Vector3,
        public IsTrigger: boolean,
        public Material: any
    ) { }    
}
