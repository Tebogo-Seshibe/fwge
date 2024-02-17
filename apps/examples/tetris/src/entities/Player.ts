import { OrthographicCamera, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";

export class Player extends Entity
{
    override Init()
    {
        this.AddComponent(new OrthographicCamera(
        {
            left: -16,
            right: 16,
            top: 9,
            bottom: -9,
            near: 0,
            far: -2,
        }));
        this.AddComponent(new Transform({ position: [0,5,0]}));
    }
}
