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
        const self = this;

        this.AddComponent(new Transform())
        this.AddComponent(new Input(
        {
            onInput: (delta: number, keyboard: KeyboardState, mouse: MouseState, controllers: Readonly<FixedLengthArray<ControllerState, 4>>) =>
            {
                self.OnInput(delta, keyboard, mouse, controllers);
            }
        }));
        this.AddComponent(new Script(
        {
            start: () =>
            {
                self.Start();
            },
            update: (delta: number) =>
            {
                self.Update(delta!);
            },
            end: () =>
            {
                self.Stop();
            }
        }));

        this.transform = this.GetComponent(Transform)!
    }

    Init(): void {}

    Start(): void { }
    // @ts-ignore
    Update(delta: number): void { }
    Stop(): void { }
    // @ts-ignore
    OnInput(delta: number, keyboard: KeyboardState, mouse: MouseState, controllers: Readonly<FixedLengthArray<ControllerState, 4>>) { }
}
