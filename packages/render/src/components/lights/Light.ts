import { Colour3 } from "@fwge/common"
import { UniqueComponent } from "@fwge/core"

export interface ILight
{
    ambient?: [number, number, number] | Colour3
    diffuse?: [number, number, number] | Colour3
    specular?: [number, number, number] | Colour3
    intensity?: number
}
export class Light extends UniqueComponent
{
    constructor(
        public readonly Ambient: Colour3 = new Colour3(0.1),
        public readonly Diffuse: Colour3 = new Colour3(0.75),
        public readonly Specular: Colour3 = new Colour3(1.0),
        public Intensity: number = 1.0
    ) {
        super(Light)
    }
}
