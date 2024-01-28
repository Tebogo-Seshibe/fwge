import { Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";

export class Tetromino extends Entity
{
    override Init(): void
    {
        this.AddComponent(new Transform());
    }
}
