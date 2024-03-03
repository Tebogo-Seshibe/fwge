import { OrthographicCamera, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";

export class Player extends Entity
{
    override Init()
    {
        this.AddComponent(new OrthographicCamera(
        {
            left: -35,
            right: 35,
            top: 20,
            bottom: -20,
            near: 0,
            far: -2,
        }));
        this.AddComponent(new Transform({ position: [0,5,0]}));
    }
}
