import { FixedLengthArray } from "@fwge/common";

export class ControllerInputHandler
{
    private controllers: FixedLengthArray<Gamepad | null, 4> = [null, null, null, null];
    
    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly controller_axes: Float32Array,
        private readonly controller_buttons: Uint8ClampedArray
    ) { }

    Start(): void        
    {
        this.canvas.ownerDocument.documentElement.addEventListener('gamepadconnected', this.addController.bind(this))
    }

    Update(_: number): void
    {
        this.controllers = navigator.getGamepads() as FixedLengthArray<Gamepad | null, 4>;
    
        for (const controller of this.controllers)
        {
            if (!controller)
            {
                continue;
            }

            this.controller_axes[controller.index + 0] = controller.axes[0];
            this.controller_axes[controller.index + 1] = controller.axes[1];
            this.controller_axes[controller.index + 2] = controller.axes[2];
            this.controller_axes[controller.index + 2] = controller.axes[2];

            this.controller_buttons[controller.index + 0] = controller.buttons[0].value;
            this.controller_buttons[controller.index + 1] = controller.buttons[1].value;
            this.controller_buttons[controller.index + 2] = controller.buttons[2].value;
            this.controller_buttons[controller.index + 3] = controller.buttons[3].value;
            this.controller_buttons[controller.index + 4] = controller.buttons[4].value;
            this.controller_buttons[controller.index + 5] = controller.buttons[5].value;
            this.controller_buttons[controller.index + 6] = controller.buttons[6].value;
            this.controller_buttons[controller.index + 7] = controller.buttons[7].value;
            this.controller_buttons[controller.index + 8] = controller.buttons[8].value;
            this.controller_buttons[controller.index + 9] = controller.buttons[9].value;
            this.controller_buttons[controller.index + 10] = controller.buttons[10].value;
            this.controller_buttons[controller.index + 11] = controller.buttons[11].value;
            this.controller_buttons[controller.index + 12] = controller.buttons[12].value;
            this.controller_buttons[controller.index + 13] = controller.buttons[13].value;
            this.controller_buttons[controller.index + 14] = controller.buttons[14].value;
            this.controller_buttons[controller.index + 15] = controller.buttons[15].value;
        }
    }

    Stop(): void        
    {
        this.canvas.ownerDocument.documentElement.addEventListener('gamepadconnected', this.removeController.bind(this))        
    }

    private addController(e: Event)
    {
        debugger;
        const controller = (e as GamepadEvent).gamepad;
        this.controllers[controller.index] = controller;
    }
    
    private removeController(e: Event)
    {
        const controller = (e as GamepadEvent).gamepad;   
        this.controllers[controller.index] = null;
    }
}
