import { Camera, PerspectiveCamera, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { ActionInput } from "../components/ActionInput";

export class Player extends Entity
{
    camera!: Camera;

    override Init()
    {
        // this.AddComponent(new OrthographicCamera());
        this.AddComponent(new PerspectiveCamera());
        this.AddComponent(new Transform({ position: [0,0,5]}));
        this.AddComponent(new ActionInput(
        [
            { 
                left: {
                    keyboard: ['KeyA', 'KeyLeft'],
                    controller: ['DirectionalLeft']
                },
                right: {
                    keyboard: ['KeyD', 'KeyRight'],
                    controller: ['DirectionalRight']
                }
            }
        ]));
    }
}
