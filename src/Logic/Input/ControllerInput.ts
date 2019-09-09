import Vector2 from "../Maths/Vector2";
import { ButtonState } from "./InputState";

export default class ControllerInput
{
    public LeftStick: Vector2 // <axis[0], axis[1]>
    public RightStick: Vector2 // <axis[2], axis[3]>

    public DirectionalUp: ButtonState // buttons[12] -> [ U ]
    public DirectionalDown: ButtonState // buttons[13] -> [ D ]
    public DirectionalLeft: ButtonState // buttons[14] -> [ L ]
    public DirectionalRight: ButtonState // buttons[15] -> [ R ]

    public LeftStickButton: ButtonState // buttons[10] -> [ A ]-> ( L3 )
    public RightStickButton: ButtonState // buttons[11] -> [ A ]-> ( R3 )

    public Button1: ButtonState // buttons[0] -> [ A ]-> ( X )
    public Button2: ButtonState // buttons[1] -> [ B ]-> ( O )
    public Button3: ButtonState // buttons[2] -> [ X ]-> ( [] )
    public Button4: ButtonState // buttons[3] -> [ Y ]-> ( /\ )
    
    public Start: ButtonState  // buttons[8] -> [ A ]-> ( X )
    public Select: ButtonState  // buttons[9] -> [ A ]-> ( X )
    
    public LeftBumper: ButtonState // buttons[4] -> [ LB ]-> ( L1 )
    public RightBumper: ButtonState // buttons[5] -> [ LB ]-> ( R1 )
    public LeftTrigger: ButtonState // buttons[6] -> [ RB ]-> ( L2 )
    public RightTrigger: ButtonState // buttons[7] -> [ RT ]-> ( R2 )


    constructor()
    {
        
    }
}