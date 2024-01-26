import { CompositeDataView, GL } from "@fwge/common";
import { Registry, System } from "@fwge/ecs";
import { ControllerInputHandler } from "../base/controller/ControllerInputHandler";
import { KeyboardInputHandler, NUM_KEYBOARD_KEYS } from "../base/keyboard/KeyboardInputHandler";
import { MouseInputHandler } from "../base/mouse/MouseInputHandler";
import { Input } from "../components";

export class InputSystem extends System
{
    private readonly inputView = Registry.RegisterView([Input]);

    private readonly inputDataView = new CompositeDataView([
        {
            name: 'keyboard',
            type: Uint8ClampedArray,
            length: NUM_KEYBOARD_KEYS
        },
        {
            name: 'mouseMovement',
            type: Float32Array,
            length: 6
        },
        {
            name: 'mouseButtons',
            type: Uint8ClampedArray,
            length: 6
        },
        {
            name: 'controllerAxes',
            type: Float32Array,
            length: 16
        },
        {
            name: 'controllerButtons',
            type: Uint8ClampedArray,
            length: 64
        }
    ]);
    
    private readonly keyboard: KeyboardInputHandler = new KeyboardInputHandler(
        GL.canvas as HTMLCanvasElement,
        0.2,
        this.inputDataView.View('keyboard')!
    );

    private readonly mouse: MouseInputHandler = new MouseInputHandler(
        GL.canvas as HTMLCanvasElement,
        this.inputDataView.View('mouseMovement')!,
        this.inputDataView.View('mouseButtons')!
    );
    
    private readonly controllers: ControllerInputHandler = new ControllerInputHandler(
        GL.canvas as HTMLCanvasElement,
        this.inputDataView.View('controllerAxes')!,
        this.inputDataView.View('controllerButtons')!
    );

    Init(): void { }
    
    Start(): void
    {
        this.keyboard.Start();
        this.mouse.Start();
        this.controllers.Start();
    }

    Update(delta: number): void
    {
        this.keyboard.Update(delta!);
        this.mouse.Update();
        this.controllers.Update();

        for (const entityId of Registry.GetView(this.inputView))
        {
            const input = Registry.GetComponent(entityId, Input)!;
            input.OnInput(delta, this.keyboard.State, this.mouse.State, this.controllers.State);
        }

        this.mouse.Reset();
    }

    Stop(): void        
    {
        this.keyboard.Stop()
        this.mouse.Stop()
        this.controllers.Stop()
    }
}
