import { Camera, OrthographicCamera, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { ActionInput } from "../components/ActionInput";

export class Player extends Entity
{
    camera!: Camera;

    override Init()
    {
        this.AddComponent(new Transform())
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
        ]))
        this.AddComponent(new OrthographicCamera())
    }
}