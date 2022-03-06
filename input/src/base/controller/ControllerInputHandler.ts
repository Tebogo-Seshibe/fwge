import { ControllerState } from "./ControllerState"

export class ControllerInputHandler
{
    static readonly LeftStickX: number = 0
    static readonly LeftStickY: number = 1
    static readonly LeftStickPress: number = 2

    static readonly RightStickX: number = 3
    static readonly RightStickY: number = 4
    static readonly RightStickPress: number = 5

    static readonly DPAD: number = 6
    static readonly ABXY: number = 10
    static readonly LeftBumper: number = 15
    static readonly LeftTrigger: number = 16
    static readonly RightBumper: number = 17
    static readonly RightTrigger: number = 18
    static readonly Buttons: number = 19

    #state: number[][] = []

    get State()
    {
        return []
        // this.#state.map(state => new ControllerState(
        //     new Vecthis.#state[]
        // ))
    }
    
    Start(): void        
    {
        
    }

    Update(_: number): void
    {

    }

    Stop(): void        
    {
        
    }
}
