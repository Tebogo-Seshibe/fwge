import { GL } from "@fwge/common"
import { System } from "@fwge/core"
import { ControllerInputHandler } from "../base/controller/ControllerInputHandler"
import { KeyboardInputHandler } from "../base/keyboard/KeyboardInputHandler"
import { MouseInputHandler } from "../base/mouse/MouseInputHandler"
import { Input } from "../components"

export class InputSystem extends System
{
    private _keyboard!: KeyboardInputHandler
    private _mouse!: MouseInputHandler
    private _controllers!: ControllerInputHandler

    constructor()
    {
        super({ requiredComponents: [ Input ] })
    }

    Init(): void
    {        
        this._keyboard = new KeyboardInputHandler(GL.canvas)
        this._mouse = new MouseInputHandler(GL.canvas)
        this._controllers = new ControllerInputHandler(GL.canvas)
    }
    
    Start(): void        
    {
        this._keyboard.Start()
        this._mouse.Start()
        this._controllers.Start()
    }

    Update(delta: number): void
    {   
        for (const entity of this.entities)
        {
            const { OnInput } = entity.GetComponent(Input)!

            OnInput.call(entity,
            {
                Keyboard: this._keyboard.State,
                Mouse: this._mouse.State,
                Controllers: this._controllers.State
            }, delta)
        }
        
        this._keyboard.Update(delta)
        this._mouse.Update(delta)
        this._controllers.Update(delta)
    }

    Stop(): void        
    {
        this._keyboard.Stop()
        this._mouse.Stop()
        this._controllers.Stop()
    }
}
