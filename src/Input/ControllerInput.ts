import Vector2 from "../Maths/Vector2";
import { ButtonState } from "./InputState";

export default class ControllerInput
{
    // region Private Fields
    private axis: Vector2[] = []
    private buttons: ButtonState[] = []
    // endregion

    public get LeftStick(): Vector2 // <axis[0], axis[1]>
    {
        return this.axis[0].Clone()
    }

    public get RightStick(): Vector2 // <axis[2], axis[3]>
    {
        return this.axis[1].Clone()
    }

    public get DirectionalUp(): ButtonState // buttons[12] -> [ U ]
    {
        return this.buttons[12]
    }

    public get DirectionalDown(): ButtonState // buttons[13] -> [ D ]
    {
        return this.buttons[13]
    }

    public get DirectionalLeft(): ButtonState // buttons[14] -> [ L ]
    {
        return this.buttons[14]
    }

    public get DirectionalRight(): ButtonState // buttons[15] -> [ R ]
    {
        return this.buttons[15]
    }

    public get LeftStickButton(): ButtonState // buttons[10] -> [ A ]-> ( L3 )
    {
        return this.buttons[10]
    }

    public get RightStickButton(): ButtonState // buttons[11] -> [ A ]-> ( R3 )
    {
        return this.buttons[11]
    }

    public get Button1(): ButtonState // buttons[0] -> [ A ]-> ( X )
    {
        return this.buttons[0]
    }

    public get Button2(): ButtonState // buttons[1] -> [ B ]-> ( O )
    {
        return this.buttons[1]
    }

    public get Button3(): ButtonState // buttons[2] -> [ X ]-> ( [] )
    {
        return this.buttons[2]
    }

    public get Button4(): ButtonState // buttons[3] -> [ Y ]-> ( /\ )
    {
        return this.buttons[3]
    }

    public get Start(): ButtonState  // buttons[8] -> [ A ]-> ( X )
    {
        return this.buttons[8]
    }

    public get Select(): ButtonState  // buttons[9] -> [ A ]-> ( X )
    {
        return this.buttons[9]
    }

    public get LeftBumper(): ButtonState // buttons[4] -> [ LB ]-> ( L1 )
    {
        return this.buttons[4]
    }

    public get RightBumper(): ButtonState // buttons[5] -> [ LB ]-> ( R1 )
    {
        return this.buttons[5]
    }

    public get LeftTrigger(): ButtonState // buttons[6] -> [ RB ]-> ( L2 )
    {
        return this.buttons[6]
    }

    public get RightTrigger(): ButtonState // buttons[7] -> [ RT ]-> ( R2 )
    {
        return this.buttons[7]
    }
    
    constructor(element: HTMLCanvasElement)
    {
        
    }
}
