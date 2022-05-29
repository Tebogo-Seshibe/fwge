import { Vector2 } from "@fwge/common"
import { ButtonState } from "../InputState"

export class ControllerState
{
    // <axis[0], axis[1]>
    public readonly LeftStick: Vector2

     // <axis[2], axis[3]>
    public readonly RightStick: Vector2

     // buttons[12] -> [ U ]
    public readonly DirectionalUp: ButtonState

     // buttons[13] -> [ D ]
    public readonly DirectionalDown: ButtonState

     // buttons[14] -> [ L ]
    public readonly DirectionalLeft: ButtonState

     // buttons[15] -> [ R ]
    public readonly DirectionalRight: ButtonState

     // buttons[10] -> [ A ]-> ( L3 )
    public readonly LeftStickButton: ButtonState

     // buttons[11] -> [ A ]-> ( R3 )
    public readonly RightStickButton: ButtonState

     // buttons[0] -> [ A ]-> ( X )
    public readonly Button1: ButtonState

     // buttons[1] -> [ B ]-> ( O )
    public readonly Button2: ButtonState

     // buttons[2] -> [ X ]-> ( [] )
    public readonly Button3: ButtonState

     // buttons[3] -> [ Y ]-> ( /\ )
    public readonly Button4: ButtonState

    // buttons[4] -> [ LB ]-> ( L1 )
    public readonly LeftBumper: ButtonState

     // buttons[5] -> [ LB ]-> ( R1 )
    public readonly RightBumper: ButtonState

     // buttons[6] -> [ RB ]-> ( L2 )
    public readonly LeftTrigger: ButtonState

     // buttons[7] -> [ RT ]-> ( R2 )    
    public readonly RightTrigger: ButtonState

    constructor(
        leftStick: [Vector2, ButtonState],
        rightStick: [Vector2, ButtonState],
        dpad: [ButtonState, ButtonState, ButtonState, ButtonState],
        abxy: [ButtonState, ButtonState, ButtonState, ButtonState],
        bumperTrigger: [ButtonState, ButtonState, ButtonState, ButtonState],
        public readonly Buttons: ButtonState[],
    ) { 
        this.LeftStick = leftStick[0]
        this.LeftStickButton = leftStick[1]
        this.RightStick = rightStick[0]
        this.RightStickButton = rightStick[1]

        this.DirectionalUp = dpad[0]
        this.DirectionalDown = dpad[1]
        this.DirectionalLeft = dpad[2]
        this.DirectionalRight = dpad[3]

        this.Button1 = abxy[0]
        this.Button2 = abxy[1]
        this.Button3 = abxy[2]
        this.Button4 = abxy[3]

        this.LeftBumper = bumperTrigger[0]
        this.RightBumper = bumperTrigger[1]
        this.LeftTrigger = bumperTrigger[2]
        this.RightTrigger = bumperTrigger[3]
    }
}
