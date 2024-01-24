import { FixedLengthArray } from "@fwge/common";
import { ControllerState } from "./ControllerState";

export class ControllerInputHandler
{
    private readonly _controllers: FixedLengthArray<Gamepad | null, 4> = [null, null, null, null];
    public readonly State: FixedLengthArray<ControllerState, 4>;
    
    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly controllerAxes: Float32Array,
        private readonly controllerButtons: Uint8ClampedArray
    ) { 
        this.State = [
            new ControllerState(controllerAxes, 0,  controllerButtons, 0),
            new ControllerState(controllerAxes, 4,  controllerButtons, 16),
            new ControllerState(controllerAxes, 8,  controllerButtons, 32),
            new ControllerState(controllerAxes, 12, controllerButtons, 48),
        ];
    }

    public Start(): void        
    {
        this.canvas.ownerDocument.documentElement.addEventListener('gamepadconnected', this.addController.bind(this))
        this.canvas.ownerDocument.documentElement.addEventListener('gamepaddisconnected', this.removeController.bind(this))
    }

    public Update(): void
    {
        const controllers = navigator.getGamepads() as FixedLengthArray<Gamepad | null, 4>;
        let i = 0;
        for (const controller of controllers)
        {
            if (!controller && this.State[i].Active)
            {
                this.State[i].Active = false;
            }
            else if (controller && !this.State[i].Active)
            {
                this.State[i].Active = true;
            }
            
            if (!controller) continue;

            this.controllerAxes[controller.index + 0] = controller.axes[0];
            this.controllerAxes[controller.index + 1] = controller.axes[1];
            this.controllerAxes[controller.index + 2] = controller.axes[2];
            this.controllerAxes[controller.index + 3] = controller.axes[3];

            this.controllerButtons[controller.index +  0] = controller.buttons[ 0].value;
            this.controllerButtons[controller.index +  1] = controller.buttons[ 1].value;
            this.controllerButtons[controller.index +  2] = controller.buttons[ 2].value;
            this.controllerButtons[controller.index +  3] = controller.buttons[ 3].value;
            this.controllerButtons[controller.index +  4] = controller.buttons[ 4].value;
            this.controllerButtons[controller.index +  5] = controller.buttons[ 5].value;
            this.controllerButtons[controller.index +  6] = controller.buttons[ 6].value;
            this.controllerButtons[controller.index +  7] = controller.buttons[ 7].value;
            this.controllerButtons[controller.index +  8] = controller.buttons[ 8].value;
            this.controllerButtons[controller.index +  9] = controller.buttons[ 9].value;
            this.controllerButtons[controller.index + 10] = controller.buttons[10].value;
            this.controllerButtons[controller.index + 11] = controller.buttons[11].value;
            this.controllerButtons[controller.index + 12] = controller.buttons[12].value;
            this.controllerButtons[controller.index + 13] = controller.buttons[13].value;
            this.controllerButtons[controller.index + 14] = controller.buttons[14].value;
            this.controllerButtons[controller.index + 15] = controller.buttons[15].value;
        }
    }

    public Stop(): void        
    {
        this.canvas.ownerDocument.documentElement.removeEventListener('gamepadconnected', this.removeController.bind(this)) 
        this.canvas.ownerDocument.documentElement.removeEventListener('gamepaddisconnected', this.removeController.bind(this))       
    }

    private addController(e: Event)
    {
        const controller = (e as GamepadEvent).gamepad;
        this._controllers[controller.index] = controller;
    }
    
    private removeController(e: Event)
    {
        const controller = (e as GamepadEvent).gamepad;
        this._controllers[controller.index] = null;
    }
}
