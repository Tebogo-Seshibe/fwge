import { FixedLengthArray } from "@fwge/common";
import { ControllerState } from "./ControllerState";

export class ControllerInputHandler
{
    private readonly _controllers: FixedLengthArray<Gamepad | null, 4> = [null, null, null, null];
    private readonly controllerReset = {
        axes: [0,0,0,0],
        buttons: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0].map((value) => ({value}))
    }
    public readonly State: FixedLengthArray<ControllerState, 4>;
    
    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly controllerAxes: Float32Array,
        private readonly controllerButtons: Uint8ClampedArray
    ) { 
        this.State = [
            new ControllerState(controllerAxes,  0, controllerButtons,  0),
            new ControllerState(controllerAxes,  4, controllerButtons, 16),
            new ControllerState(controllerAxes,  8, controllerButtons, 32),
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
        for (let i = 0; i < controllers.length; ++i)
        {
            const controller = controllers[i];
            let axesOffset = i * 4;
            let buttonsOffset = i * 16;

            if (!controller && this.State[i].Active)
            {
                this.State[i].Active = false;
            }
            else if (controller && !this.State[i].Active)
            {
                this.State[i].Active = true;
            }
            
            let update = controller ?? this.controllerReset;

            this.controllerAxes[axesOffset + 0] =  update.axes[0];
            this.controllerAxes[axesOffset + 1] = -update.axes[1];
            this.controllerAxes[axesOffset + 2] =  update.axes[2];
            this.controllerAxes[axesOffset + 3] = -update.axes[3];

            this.controllerButtons[buttonsOffset +  0] = update.buttons[ 0].value;
            this.controllerButtons[buttonsOffset +  1] = update.buttons[ 1].value;
            this.controllerButtons[buttonsOffset +  2] = update.buttons[ 2].value;
            this.controllerButtons[buttonsOffset +  3] = update.buttons[ 3].value;
            this.controllerButtons[buttonsOffset +  4] = update.buttons[ 4].value;
            this.controllerButtons[buttonsOffset +  5] = update.buttons[ 5].value;
            this.controllerButtons[buttonsOffset +  6] = update.buttons[ 6].value;
            this.controllerButtons[buttonsOffset +  7] = update.buttons[ 7].value;
            this.controllerButtons[buttonsOffset +  8] = update.buttons[ 8].value;
            this.controllerButtons[buttonsOffset +  9] = update.buttons[ 9].value;
            this.controllerButtons[buttonsOffset + 10] = update.buttons[10].value;
            this.controllerButtons[buttonsOffset + 11] = update.buttons[11].value;
            this.controllerButtons[buttonsOffset + 12] = update.buttons[12].value;
            this.controllerButtons[buttonsOffset + 13] = update.buttons[13].value;
            this.controllerButtons[buttonsOffset + 14] = update.buttons[14].value;
            this.controllerButtons[buttonsOffset + 15] = update.buttons[15].value;
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
