import { FixedLengthArray } from "@fwge/common";
import { Scene, Script, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { ControllerState, Input, KeyboardState, MouseState } from "@fwge/input";

export class GameObject extends Entity
{
    public readonly transform: Transform

    constructor(public scene: Scene)
    {
        super();
        
        this.AddComponent(new Transform())
        this.AddComponent(new Input(
        {
            onInput: (delta: number, keyboard: KeyboardState, mouse: MouseState, controllers: Readonly<FixedLengthArray<ControllerState, 4>>) =>
            {
                this.OnInput(delta, keyboard, mouse, controllers);
            }
        }));
        this.AddComponent(new Script(
        {
            start(this: GameObject)
            {
                this.OnStart()
            },
            update(this: GameObject, delta: number)
            {
                this.OnUpdate(delta)
            },
            end(this: GameObject)
            {
                this.OnStop()
            }
        }));

        this.transform = this.GetComponent(Transform)!
    }

    OnStart(): void { }
    // @ts-ignore
    OnUpdate(delta: number): void { }
    OnStop(): void { }
    // @ts-ignore
    OnInput(delta: number, keyboard: KeyboardState, mouse: MouseState, controllers: Readonly<FixedLengthArray<ControllerState, 4>>) { }
}
