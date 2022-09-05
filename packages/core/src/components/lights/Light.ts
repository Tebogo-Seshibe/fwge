import { Colour3, Vector3, Vector3Array } from "@fwge/common"
import { Shader } from "../../base"
import { UniqueComponent } from "../../ecs"

export interface ILight
{
    colour?: Vector3Array | Colour3 | Vector3
    intensity?: number
}

export class Light extends UniqueComponent
{
    constructor(
        public readonly Colour: Colour3 = new Colour3(0.1),
        public Intensity: number = 1.0
    ) {
        super(Light)
    }

    Bind(shader: Shader): void
    Bind(shader: Shader, index: number): void
    Bind(shader: Shader, index?: number): void {}
}
