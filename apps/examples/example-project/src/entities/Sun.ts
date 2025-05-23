import { DirectionalLight, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";

export class Sun extends Entity
{
    Init(): void
    {
        this.AddComponents(
            new Transform(
            {
                rotation: [0,0,0]
            }),
            new DirectionalLight(
            {
                castShadows: true,
                colour: [1,1,1],
                intensity: 0.5,
            })
        )
    }
}