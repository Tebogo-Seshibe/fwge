import { Entity, PerspectiveCamera, Transform } from "@fwge/core";

export class Camera extends Entity
{
    Init(): void
    {
        this.AddComponents(
            new Transform(this.Game, { position: [ 0, 0, 10 ] }),
            new PerspectiveCamera(this.Game)
        )
    }
}