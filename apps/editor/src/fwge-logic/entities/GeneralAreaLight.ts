import { AreaLight } from "@fwge/core";
import { Entity } from "@fwge/ecs";

export class GeneralAreaLight extends Entity{
    constructor() {
        super();

        this.AddComponents(
            new AreaLight({
                colour: [1, 1, 1],
                intensity: 0.0
            })
        )
    }
}