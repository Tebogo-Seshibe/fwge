import { Vector2 } from "@fwge/common"
import { ButtonState, WheelState } from "../InputState"


export class MouseState 
{
    public readonly Left: ButtonState
    public readonly Middle: ButtonState
    public readonly Right: ButtonState

    constructor(
        public readonly Offset: Readonly<Vector2>,
        public readonly RawPosition: Readonly<Vector2>,
        public readonly ScreenPosition: Readonly<Vector2>,
        public readonly Wheel: WheelState,
        public readonly Buttons: ButtonState[],
    ) {
        this.Left = Buttons[0]
        this.Middle = Buttons[1]
        this.Right = Buttons[2]
    }
}
