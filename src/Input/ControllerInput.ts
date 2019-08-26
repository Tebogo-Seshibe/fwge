import Vector2 from "../Maths/Vector2";
import { ButtonState } from "./InputState";

export default class ControllerInput
{
    public LeftStick: Vector2
    public RightStick: Vector2

    public DirectionalUp: ButtonState
    public DirectionalDown: ButtonState
    public DirectionalLeft: ButtonState
    public DirectionalRight: ButtonState

    public Button1: ButtonState
    public Button2: ButtonState
    public Button3: ButtonState
    public Button4: ButtonState
    
    public Start: ButtonState
    public Select: ButtonState
    
    public LeftBumper: ButtonState
    public RightBumper: ButtonState
    public LeftTrigger: ButtonState
    public RightTrigger: ButtonState


    constructor()
    {
        // TODO
        // Figure out how these are actually handled
    }
}