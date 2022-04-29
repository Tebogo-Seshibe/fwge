import { Scene, System } from "@fwge/core"
import { ControllerInputHandler } from "../base/controller/ControllerInputHandler"
import { KeyboardInputHandler } from "../base/keyboard/KeyboardInputHandler"
import { MouseInputHandler } from "../base/mouse/MouseInputHandler"
import { Input } from "../components"

export class InputSystem extends System
{
    private _keyboard: KeyboardInputHandler = new KeyboardInputHandler(this.scene.Context!)
    private _mouse: MouseInputHandler = new MouseInputHandler(this.scene.Context!)
    private _controllers: ControllerInputHandler = new ControllerInputHandler(this.scene.Context!)

    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [ Input ] })
    }

    public Init(): void { }
    
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
            const inputComponent = entity.GetComponent(Input)!

            inputComponent.OnInput.call(entity,
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
