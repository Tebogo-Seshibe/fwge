import { Entity, OrthographicCamera, Transform } from "@fwge/core";

export class Player extends Entity
{
    override Init()
    {
        this.AddComponent(new OrthographicCamera(
            this.Game,
            {
                left: -35,
                right: 35,
                top: 20,
                bottom: -20,
                near: 0,
                far: -2,
            }
        ));
        this.AddComponent(new Transform(this.Game, { position: [0,5,0]}));
    }
}
