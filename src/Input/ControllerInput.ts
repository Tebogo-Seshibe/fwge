import Vector2 from "../Maths/Vector2";
import { InputState } from "./InputState";

export default class ControllerInput
{
    public LeftStick: Vector2
    public RightStick: Vector2

    public DirectionalUp: InputState
    public DirectionalDown: InputState
    public DirectionalLeft: InputState
    public DirectionalRight: InputState

    public Button1: InputState
    public Button2: InputState
    public Button3: InputState
    public Button4: InputState
    
    public Start: InputState
    public Select: InputState
    
    public LeftBumper: InputState
    public RightBumper: InputState
    public LeftTrigger: InputState
    public RightTrigger: InputState


    constructor()
    {

    }
}