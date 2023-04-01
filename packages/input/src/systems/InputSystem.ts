import { CompositeDataView, FixedLengthArray, GL } from "@fwge/common";
import { getComponent, System, view } from "@fwge/core";
import { ControllerState, KeyboardState, KeyState, MouseState } from "../base";
import { ControllerInputHandler } from "../base/controller/ControllerInputHandler";
import { KeyboardInputHandler, NUM_KEYBOARD_KEYS } from "../base/keyboard/KeyboardInputHandler";
import { MouseInputHandler } from "../base/mouse/MouseInputHandler";
import { IInputArgs, Input } from "../components";

export class InputSystem extends System
{
    private _keyboard!: KeyboardInputHandler;
    private _keyboardState!: KeyboardState;

    private _mouse!: MouseInputHandler;
    private _mouseState!: MouseState;

    private _controllers!: ControllerInputHandler;
    private _controllerState!: FixedLengthArray<ControllerState, 4>;

    private inputState!: IInputArgs;

    private _inputListeners: Map<number, number[]> = new Map();

    private readonly inputView = new CompositeDataView([
        {
            name: 'keyboard',
            type: Uint8ClampedArray,
            length: NUM_KEYBOARD_KEYS
        },
        {
            name: 'mouse_movement',
            type: Float32Array,
            length: 6
        },
        {
            name: 'mouse_buttons',
            type: Uint8ClampedArray,
            length: 6
        },
        {
            name: 'controller_axes',
            type: Float32Array,
            length: 16
        },
        {
            name: 'controller_buttons',
            type: Uint8ClampedArray,
            length: 64
        }
    ]);

    Init(): void
    {
        view([Input])

        this._keyboard = new KeyboardInputHandler(
            GL.canvas as HTMLCanvasElement,
            0.2,
            
        );
        this._keyboardState = new KeyboardState(this.inputView.View('keyboard')!);

        this._mouse = new MouseInputHandler(
            GL.canvas as HTMLCanvasElement,
            this.inputView.View('mouse_movement')!,
            this.inputView.View('mouse_buttons')!
        );
        this._mouseState = new MouseState(
            this.inputView.View('mouse_movement')!,
            this.inputView.View('mouse_buttons')!
        );

        this._controllers = new ControllerInputHandler(GL.canvas as HTMLCanvasElement, this.inputView.View('controller_axes')!, this.inputView.View('controller_buttons')!);
        this._controllerState = [
            new ControllerState(this.inputView.View('controller_axes')!, 0,  this.inputView.View('controller_buttons')!, 0),
            new ControllerState(this.inputView.View('controller_axes')!, 4,  this.inputView.View('controller_buttons')!, 16),
            new ControllerState(this.inputView.View('controller_axes')!, 8,  this.inputView.View('controller_buttons')!, 32),
            new ControllerState(this.inputView.View('controller_axes')!, 12, this.inputView.View('controller_buttons')!, 48),
        ];

        this.inputState = {
            Keyboard: this._keyboardState,
            Mouse: this._mouseState,
            Controllers: this._controllerState
        };

        console.log(this.inputView.View('keyboard')!)
        console.log(this.inputView.View('mouse_movement')!)
        console.log(this.inputView.View('mouse_buttons')!)
        console.log(this.inputView.View('controller_axes')!)
        console.log(this.inputView.View('controller_buttons')!)
    }
    
    Start(): void        
    {
        this._keyboard.Start();
        this._mouse.Start();
        this._controllers.Start();
    }

    Update(delta: number): void
    {
        this._keyboard.Update(delta);
        this._mouse.Update(delta);
        this._controllers.Update(delta);

        for (const entityId of view([Input]))
        {
            const entity = this.Scene.GetEntity(entityId)!
            const input = getComponent(entityId, Input)!

            input.OnInput.call(entity,
            {
                Keyboard: this._keyboardState,
                Mouse: this._mouseState,
                Controllers: this._controllerState
            }, delta);
        }
        
        // this._keyboard.Start()
        console.log(this.inputView.View('mouse_movement')!)
        this._mouse.Reset();
        // this._controllers.Start()
    }

    Stop(): void        
    {
        this._keyboard.Stop()
        this._mouse.Stop()
        this._controllers.Stop()
    }
}
