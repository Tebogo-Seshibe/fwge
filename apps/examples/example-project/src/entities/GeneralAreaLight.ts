import { AreaLight, Entity, Game } from "@fwge/core";

export class GeneralAreaLight extends Entity
{
    Init(): void
    {
        this.AddComponents(
            new AreaLight(this.Game,
            {
                colour: [1, 1, 1],
                intensity: 0.5
            })
        )
    }
}