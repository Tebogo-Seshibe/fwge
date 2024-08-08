import { DirectionalLight, Entity, Transform } from "@fwge/core";

export class Sun extends Entity
{
    Init(): void
    {
        this.AddComponents(
            new Transform(this.Game,
            {
                rotation: [0,0,0]
            }),
            new DirectionalLight(this.Game,
            {
                castShadows: true,
                colour: [1,1,1],
                intensity: 0.5
            })
        )
    }
}