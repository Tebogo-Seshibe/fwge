import { CompositeDataView, FixedLengthArray, Vector2 } from "@fwge/common"
import { ButtonState, WheelState } from "../InputState"


export class MouseState 
{
    public readonly Offset: Readonly<Vector2>;
    public readonly RawPosition: Readonly<Vector2>;
    public readonly ScreenPosition: Readonly<Vector2>;
    public readonly Buttons: Readonly<[WheelState, ...FixedLengthArray<ButtonState, 5>]>;

    public get Wheel(): WheelState
    {
        return this.Buttons[0];
    }
    
    public get Left(): ButtonState
    {
        return this.Buttons[1];
    }
    public get Middle(): ButtonState
    {
        return this.Buttons[2];
    }
    public get Right(): ButtonState
    {
        return this.Buttons[3];
    }

    public get Forward(): ButtonState
    {
        return this.Buttons[5];
    }

    public get Back(): ButtonState
    {
        return this.Buttons[4];
    }
    
    constructor(mouse_movement: Float32Array, mouse_buttons: Uint8ClampedArray)
    {
        this.Offset = new Vector2(mouse_movement.buffer, Float32Array.BYTES_PER_ELEMENT * 0);
        this.RawPosition = new Vector2(mouse_movement.buffer, Float32Array.BYTES_PER_ELEMENT * 2);
        this.ScreenPosition = new Vector2(mouse_movement.buffer, Float32Array.BYTES_PER_ELEMENT * 4);
        this.Buttons = mouse_buttons as any as [WheelState, ...FixedLengthArray<ButtonState, 5>];
    }
}
