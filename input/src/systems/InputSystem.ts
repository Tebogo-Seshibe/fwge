import { Scene, System } from "@fwge/core"
import { KeyboardState } from "../base"
import { ControllerInputHandler } from "../base/controller/ControllerInputHandler"
import { KeyboardInputHandler } from "../base/keyboard/KeyboardInputHandler"
import { MouseInputHandler } from "../base/mouse/MouseInputHandler"
import { Input } from "../components"

export class InputSystem extends System
{
    keyboard: KeyboardInputHandler = new KeyboardInputHandler(this.scene.Context!)
    mouse: MouseInputHandler = new MouseInputHandler(this.scene.Context!)
    controllers: ControllerInputHandler = new ControllerInputHandler()

    constructor(scene: Scene)
    {
        super(scene, Input)
    }

    Start(): void        
    {
        this.keyboard.Start()
        this.mouse.Start()
        this.controllers.Start()
    }

    Update(delta: number): void
    {
        this.keyboard.Update(delta)
        this.mouse.Update(delta)
        this.controllers.Update(delta)
    
        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!
            const inputComponent = entity.GetComponent(Input)!

            inputComponent.OnInput.call(entity,
            {
                Keyboard: this.keyboard.State,
                Mouse: this.mouse.State,
                Controllers: this.controllers.State
            }, delta)
        }
    }

    Stop(): void        
    {
        this.keyboard.Stop()
        this.mouse.Stop()
        this.controllers.Stop()
    }
}
