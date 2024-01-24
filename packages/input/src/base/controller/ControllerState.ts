import { FixedLengthArray, Vector2 } from "@fwge/common"
import { ButtonState } from "../InputState"

export class ControllerState
{
    public Active: boolean = false;
    
    public readonly LeftStick: Readonly<Vector2>;
    public readonly RightStick: Readonly<Vector2>;
    
    //#region Basic Buttons
    public get DirectionalUp(): ButtonState
    {
        return this.Buttons[12];
    }

    public get DirectionalDown(): ButtonState
    {
        return this.Buttons[13];
    }

    public get DirectionalLeft(): ButtonState
    {
        return this.Buttons[14];
    }

    public get DirectionalRight(): ButtonState
    {
        return this.Buttons[15];
    }

    public get LeftStickButton(): ButtonState
    {
        return this.Buttons[10];
    }

    public get RightStickButton(): ButtonState
    {
        return this.Buttons[11];
    }

    public get Button1(): ButtonState
    {
        return this.Buttons[0];
    }

    public get Button2(): ButtonState
    {
        return this.Buttons[1];
    }

    public get Button3(): ButtonState
    {
        return this.Buttons[2];
    }

    public get Button4(): ButtonState
    {
        return this.Buttons[3];
    }

    public get LeftBumper(): ButtonState
    {
        return this.Buttons[4];
    }

    public get RightBumper(): ButtonState
    {
        return this.Buttons[5];
    }

    public get LeftTrigger(): ButtonState
    {
        return this.Buttons[6];
    }

    public get RightTrigger(): ButtonState
    {
        return this.Buttons[7];
    }
    //#endregion

    //#region PS4 Buttons
    public get Cross(): ButtonState
    {
        return this.Buttons[0];
    }
    
    public get Circle(): ButtonState
    {
        return this.Buttons[1];
    }
    
    public get Square(): ButtonState
    {
        return this.Buttons[2];
    }
    
    public get Triangle(): ButtonState
    {
        return this.Buttons[3];
    }
    
    public get L1(): ButtonState
    {
        return this.Buttons[4];
    }
    
    public get R1(): ButtonState
    {
        return this.Buttons[5];
    }
    
    public get L2(): ButtonState
    {
        return this.Buttons[6];
    }
    
    public get R2(): ButtonState
    {
        return this.Buttons[7];
    }
    //#endregion
    
    //#region XBOX Buttons
    public get A(): ButtonState
    {
        return this.Buttons[0];
    }
    
    public get B(): ButtonState
    {
        return this.Buttons[1];
    }
    
    public get X(): ButtonState
    {
        return this.Buttons[2];
    }
    
    public get Y(): ButtonState
    {
        return this.Buttons[3];
    }
    
    public get LB(): ButtonState
    {
        return this.Buttons[4];
    }
    
    public get RB(): ButtonState
    {
        return this.Buttons[5];
    }
    
    public get LT(): ButtonState
    {
        return this.Buttons[6];
    }
      
    public get RT(): ButtonState
    {
        return this.Buttons[7];
    }
    //#endregion
    
    public readonly Buttons: Readonly<FixedLengthArray<ButtonState, 16>>;

    constructor(
        controllerAxes: Float32Array,
        controllerAxesOffset: number,
        controllerButtons: Uint8ClampedArray,
        controllerButtonsOffset: number,
    ) {
        this.LeftStick = new Vector2(controllerAxes.buffer, (0 + controllerAxesOffset) * Vector2.BYTES_PER_ELEMENT);
        this.RightStick = new Vector2(controllerAxes.buffer, (2 + controllerAxesOffset) * Vector2.BYTES_PER_ELEMENT);
        this.Buttons = new Uint8ClampedArray(controllerButtons, controllerButtonsOffset * Vector2.BYTES_PER_ELEMENT, 16) as any as FixedLengthArray<ButtonState, 16>;
    }
}
